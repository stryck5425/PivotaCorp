import React, { useEffect } from 'react';
import { useTermsScroll } from "@/hooks/useTermsScroll";
import ClauseItem from "./ClauseItem";
import { MadeWithDyad } from "./made-with-dyad";
import { Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';

interface TermsAndConditionsProps extends React.HTMLAttributes<HTMLDivElement> {
  // No specific props needed for now, but can be extended
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ className, ...props }) => {
  const {
    displayedClauses,
    loadingMore,
    loadMoreRef,
    clauseRefs,
    scrollContainerRef, // Access the ref from the hook
  } = useTermsScroll();

  // Assign the scroll container ref to the main div
  useEffect(() => {
    if (scrollContainerRef) {
      (scrollContainerRef as React.MutableRefObject<HTMLElement | null>).current = document.getElementById('terms-scroll-container');
    }
  }, [scrollContainerRef]);

  return (
    <div
      id="terms-scroll-container" // Assign an ID for the ref
      className={cn(
        "flex-1 overflow-y-auto p-4 lg:p-8 bg-background text-foreground",
        className
      )}
      {...props}
    >
      <h2 className="text-4xl font-extrabold text-center mb-6 text-primary">
        SynergyCorp™ Official Terms & Conditions
      </h2>
      <p className="text-center text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
        Welcome to the legal framework that underpins your entire digital existence with SynergyCorp™. Please read these terms carefully, as they govern your use of our services, your digital soul, and potentially your future. By continuing to scroll, you irrevocably agree to all clauses, present, past, and retroactively applied.
      </p>

      <div className="max-w-4xl mx-auto">
        {displayedClauses.map((clause) => (
          <ClauseItem
            key={clause.id}
            id={clause.id}
            title={clause.title}
            content={clause.content}
            number={clause.number}
            category={clause.category}
            lastUpdated={clause.lastUpdated}
            innerRef={(el) => {
              if (el) {
                clauseRefs.current.set(clause.id, el);
              } else {
                clauseRefs.current.delete(clause.id);
              }
            }}
          />
        ))}

        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loadingMore && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default TermsAndConditions;