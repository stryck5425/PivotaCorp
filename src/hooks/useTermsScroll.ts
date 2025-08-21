import { useState, useEffect, useRef, useCallback } from "react";
import { absurdClauses, lawCategories } from "@/constants/absurdClauses";

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
  const [displayedClauses, setDisplayedClauses] = useState<Clause[]>([]);
  const [currentSessionStats, setCurrentSessionStats] = useState<Stats>({
    timeSpent: 0,
  });
  const [personalRecordStats, setPersonalRecordStats] = useState<Stats>(() => {
    try {
      const storedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedStats ? JSON.parse(storedStats) : { timeSpent: 0 };
    } catch (error) {
      console.error("Failed to load personal record from localStorage:", error);
      return { timeSpent: 0 };
    }
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const clauseRefs = useRef<Map<string, HTMLElement>>(new Map());
  // Removed clausesEverSeen ref as clausesRead is no longer tracked
  const totalClausesGenerated = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Removed Intersection Observer for clauses read

  // Time spent tracking (scroll distance tracking removed)
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

  // Update personal record
  useEffect(() => {
    setPersonalRecordStats((prev) => {
      const newRecord = {
        timeSpent: Math.max(prev.timeSpent, currentSessionStats.timeSpent),
      };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecord));
      } catch (error) {
        console.error("Failed to save personal record to localStorage:", error);
      }
      return newRecord;
    });
  }, [currentSessionStats]);

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