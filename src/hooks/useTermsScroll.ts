import { useState, useEffect, useRef, useCallback } from "react";
import { absurdClauses, lawCategories } from "@/constants/absurdClauses";
import { useAuth } from "./useAuth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner"; // Import toast for error notifications

interface Clause {
  id: string;
  title: string;
  content: string;
  number: number;
  category: string;
  lastUpdated: string;
}

interface Stats {
  timeSpent: number; // in seconds
}

interface UseTermsScrollReturn {
  displayedClauses: Clause[];
  currentSessionStats: Stats;
  personalRecordStats: Stats;
  loadingMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  resetSession: () => void;
  clauseRefs: React.MutableRefObject<Map<string, HTMLElement>>;
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const INITIAL_LOAD_COUNT = 20;
const LOAD_MORE_COUNT = 10;
const STATS_UPDATE_INTERVAL = 1000; // 1 second
const LOCAL_STORAGE_KEY = "corporate_terms_personal_record";

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateClause(index: number): Clause {
  const randomClause = getRandomElement(absurdClauses);
  const randomCategory = getRandomElement(lawCategories);
  const date = new Date();
  const lastUpdated = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  return {
    id: `clause-${index}-${Date.now()}-${Math.random()}`,
    title: randomClause.title,
    content: randomClause.content,
    number: index + 1,
    category: randomCategory,
    lastUpdated: lastUpdated,
  };
}

export function useTermsScroll(): UseTermsScrollReturn {
  const { user, loading: authLoading } = useAuth();
  const [displayedClauses, setDisplayedClauses] = useState<Clause[]>([]);
  const [currentSessionStats, setCurrentSessionStats] = useState<Stats>({
    timeSpent: 0,
  });
  const [personalRecordStats, setPersonalRecordStats] = useState<Stats>(() => ({ timeSpent: 0 }));
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const clauseRefs = useRef<Map<string, HTMLElement>>(new Map());
  const totalClausesGenerated = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to save personal record to Firestore or Local Storage
  const savePersonalRecord = useCallback(async (recordTime: number) => {
    console.log("Attempting to save personal record:", recordTime, "User:", user ? user.uid : "Not logged in");
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          personalRecordTimeSpent: recordTime,
        });
        console.log("Personal record saved to Firestore successfully:", recordTime);
      } catch (error: any) {
        console.error("Failed to save personal record to Firestore:", error);
        toast.error(`Failed to save record to cloud: ${error.message}`);
      }
    } else {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ timeSpent: recordTime }));
        console.log("Personal record saved to localStorage successfully:", recordTime);
      } catch (error: any) {
        console.error("Failed to save personal record to localStorage:", error);
        toast.error(`Failed to save record locally: ${error.message}`);
      }
    }
  }, [user]);

  // Load personal record from Firestore or Local Storage on auth state change
  useEffect(() => {
    const loadAndSyncPersonalRecord = async () => {
      if (authLoading) {
        console.log("Auth loading, skipping record load.");
        return;
      }

      let firestoreRecordTime = 0;
      let localStorageRecordTime = 0;

      // Try to load from localStorage first, regardless of auth status
      try {
        const storedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedStats) {
          localStorageRecordTime = JSON.parse(storedStats).timeSpent || 0;
          console.log("Loaded from localStorage:", localStorageRecordTime);
        }
      } catch (error) {
        console.error("Failed to load personal record from localStorage:", error);
      }

      if (user) {
        console.log("User logged in, attempting to load from Firestore:", user.uid);
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          firestoreRecordTime = data.personalRecordTimeSpent || 0;
          console.log("Loaded from Firestore:", firestoreRecordTime);
        } else {
          // If user doc doesn't exist (shouldn't happen after signup), create it
          console.log("User document not found in Firestore, creating with 0 record.");
          await setDoc(userDocRef, { username: user.email?.split('@')[0], personalRecordTimeSpent: 0, createdAt: new Date() });
        }

        // Determine the highest record and set it
        const highestRecord = Math.max(firestoreRecordTime, localStorageRecordTime);
        setPersonalRecordStats({ timeSpent: highestRecord });
        console.log("Personal record set to highest (Firestore vs Local):", highestRecord);

        // If localStorage had a higher record, update Firestore
        if (localStorageRecordTime > firestoreRecordTime) {
          console.log("Local storage record is higher, updating Firestore.");
          await savePersonalRecord(localStorageRecordTime);
        }
        // Clear localStorage after merging to avoid stale data
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        console.log("Local storage cleared after sync.");

      } else {
        // Not logged in, just use the localStorage record
        setPersonalRecordStats({ timeSpent: localStorageRecordTime });
        console.log("User not logged in, personal record set from localStorage:", localStorageRecordTime);
      }
    };

    loadAndSyncPersonalRecord();
  }, [user, authLoading, savePersonalRecord]);


  const loadMoreClauses = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => { // Simulate network delay
      const newClauses: Clause[] = [];
      for (let i = 0; i < LOAD_MORE_COUNT; i++) {
        newClauses.push(generateClause(totalClausesGenerated.current + i));
      }
      setDisplayedClauses((prev) => [...prev, ...newClauses]);
      totalClausesGenerated.current += LOAD_MORE_COUNT;
      setLoadingMore(false);
    }, 500);
  }, [loadingMore]);

  // Initial load of clauses
  useEffect(() => {
    const initialClauses: Clause[] = [];
    for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
      initialClauses.push(generateClause(i));
    }
    setDisplayedClauses(initialClauses);
    totalClausesGenerated.current = INITIAL_LOAD_COUNT;
  }, []);

  // Time spent tracking and immediate personal record update/save
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSessionStats((prev) => {
        const newTimeSpent = prev.timeSpent + 1;
        return {
          ...prev,
          timeSpent: newTimeSpent,
        };
      });
    }, STATS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Effect to update personal record state and trigger immediate save if a new record is set
  useEffect(() => {
    // Only update and save if current session time surpasses the personal record
    if (currentSessionStats.timeSpent > personalRecordStats.timeSpent) {
      const newRecordTime = currentSessionStats.timeSpent;
      console.log(`New personal record achieved: ${newRecordTime}s (Previous: ${personalRecordStats.timeSpent}s)`);
      setPersonalRecordStats({ timeSpent: newRecordTime }); // Update state immediately

      // Save to Firestore/localStorage immediately
      savePersonalRecord(newRecordTime);
    }
  }, [currentSessionStats.timeSpent, personalRecordStats.timeSpent, savePersonalRecord]);


  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMoreClauses();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, loadingMore, loadMoreClauses]);

  const resetSession = useCallback(() => {
    setCurrentSessionStats({ timeSpent: 0 });
    // Re-initialize clauses to reset the scroll position and content
    const initialClauses: Clause[] = [];
    totalClausesGenerated.current = 0; // Reset total generated count
    for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
      initialClauses.push(generateClause(i));
    }
    setDisplayedClauses(initialClauses);
    totalClausesGenerated.current = INITIAL_LOAD_COUNT;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0; // Scroll to top on reset
    }
    console.log("Session reset.");
  }, []);

  return {
    displayedClauses,
    currentSessionStats,
    personalRecordStats,
    loadingMore,
    loadMoreRef,
    resetSession,
    clauseRefs: clauseRefs,
    scrollContainerRef: scrollContainerRef,
  };
}