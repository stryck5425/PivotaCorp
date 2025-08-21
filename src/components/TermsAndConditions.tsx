import React from 'react';
import { useTermsScroll } from "@/hooks/useTermsScroll";
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
    scrollContainerRef,
  } = useTermsScroll();

  return (
    <div
      id="terms-scroll-container"
      ref={scrollContainerRef}
      className={cn(
        "flex-1 overflow-y-auto p-4 lg:p-8 bg-background text-foreground prose dark:prose-invert", // Added prose classes for better typography
        className
      )}
      {...props}
    >
      <h2 className="text-4xl font-extrabold text-center mb-6 text-primary">
        Pivota Corp™ Official Terms & Conditions
      </h2>
      <p className="text-center text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
        Welcome to the legal framework that underpins your entire digital existence with Pivota Corp™. Please read these terms carefully, as they govern your use of our services, your digital soul, and potentially your future. By continuing to scroll, you irrevocably agree to all clauses, present, past, and retroactively applied.
      </p>

      <div className="max-w-4xl mx-auto">
        {displayedClauses.map((clause) => (
          <div
            key={clause.id}
            id={clause.id}
            ref={(el) => {
              if (el) {
                clauseRefs.current.set(clause.id, el);
              } else {
                clauseRefs.current.delete(clause.id);
              }
            }}
            className="mb-6" // Kept mb-6 for spacing between clauses, removed card styling
          >
            <p className="text-xs text-muted-foreground mb-1">
              Clause {clause.number} &bull; Category: {clause.category} &bull; Last Updated: {clause.lastUpdated}
            </p>
            <h3 className="text-xl font-semibold text-primary mb-2">
              {clause.title}
            </h3>
            <p className="text-base text-foreground leading-relaxed">
              {clause.content}
            </p>
          </div>
        ))}

        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loadingMore && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;