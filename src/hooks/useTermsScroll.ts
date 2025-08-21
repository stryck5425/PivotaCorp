import { useState, useEffect, useRef, useCallback } from "react";
import { absurdClauses, lawCategories } from "@/constants/absurdClauses";
import { useAuth } from "./useAuth"; // Chemin d'importation mis à jour
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
const FIRESTORE_SAVE_INTERVAL = 5000; // 5 seconds

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

  // Load personal record from Firestore or Local Storage on auth state change
  useEffect(() => {
    const loadPersonalRecord = async () => {
      if (authLoading) return;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setPersonalRecordStats({ timeSpent: data.personalRecordTimeSpent || 0 });
        } else {
          // If user doc doesn't exist (shouldn't happen after signup), create it
          await setDoc(userDocRef, { username: user.email?.split('@')[0], personalRecordTimeSpent: 0, createdAt: new Date() });
          setPersonalRecordStats({ timeSpent: 0 });
        }
      } else {
        // Not logged in, load from local storage
        try {
          const storedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
          setPersonalRecordStats(storedStats ? JSON.parse(storedStats) : { timeSpent: 0 });
        } catch (error) {
          console.error("Failed to load personal record from localStorage:", error);
          setPersonalRecordStats({ timeSpent: 0 });
        }
      }
    };

    loadPersonalRecord();
  }, [user, authLoading]);


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

  // Initial load
  useEffect(() => {
    const initialClauses: Clause[] = [];
    for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
      initialClauses.push(generateClause(i));
    }
    setDisplayedClauses(initialClauses);
    totalClausesGenerated.current = INITIAL_LOAD_COUNT;
  }, []);

  // Time spent tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSessionStats((prev) => ({
        ...prev,
        timeSpent: prev.timeSpent + 1,
      }));
    }, STATS_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Update personal record and save to Firestore/Local Storage
  useEffect(() => {
    setPersonalRecordStats((prev) => {
      const newRecordTime = Math.max(prev.timeSpent, currentSessionStats.timeSpent);
      const newRecord = { timeSpent: newRecordTime };

      if (!user) { // Only save to local storage if not logged in
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecord));
        } catch (error) {
          console.error("Failed to save personal record to localStorage:", error);
        }
      }
      return newRecord;
    });
  }, [currentSessionStats.timeSpent, user]); // Depend on currentSessionStats.timeSpent and user

  // Save to Firestore every 5 seconds if logged in
  useEffect(() => {
    let firestoreSaveInterval: NodeJS.Timeout;
    if (user) {
      firestoreSaveInterval = setInterval(async () => {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          await updateDoc(userDocRef, {
            personalRecordTimeSpent: personalRecordStats.timeSpent,
          });
          // console.log("Personal record saved to Firestore:", personalRecordStats.timeSpent);
        } catch (error) {
          console.error("Failed to save personal record to Firestore:", error);
        }
      }, FIRESTORE_SAVE_INTERVAL);
    }

    return () => {
      if (firestoreSaveInterval) {
        clearInterval(firestoreSaveInterval);
      }
    };
  }, [user, personalRecordStats.timeSpent]); // Depend on user and personalRecordStats.timeSpent

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