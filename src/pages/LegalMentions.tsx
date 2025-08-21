import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LegalMentionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const LegalMentions: React.FC<LegalMentionsProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-4 lg:p-8 bg-background text-foreground prose dark:prose-invert mx-auto max-w-4xl",
        className
      )}
      {...props}
    >
      <h2 className="text-4xl font-extrabold text-center mb-6 text-primary">
        Pivota Corp™ Legal Mentions
      </h2>
      <p className="text-center text-lg text-muted-foreground mb-10">
        Welcome to Pivota Corp™'s Legal Mentions page. Unlike our Terms & Conditions, this section is designed to be genuinely understandable.
      </p>

      <div className="space-y-6">
        <p>
          This website, "Pivota Corp™ Official Terms & Conditions", is a satirical and fictional work. It was created with the aim of exploring and parodying the often excessive complexity, absurdity, and length of the terms and conditions we daily accept without reading.
        </p>
        <p>
          All clauses, company names, characters, and situations described on this site are purely imaginary and should under no circumstances be taken seriously or considered as legal or commercial advice. Any resemblance to existing companies or situations is coincidental and unintentional.
        </p>
        <p>
          The main objective is to entertain and humorously raise awareness about the importance (and sometimes the impossibility) of understanding online legal documents. We hope you enjoy this unique reading experience and that it encourages you to take a closer look at "real" terms and conditions in the future.
        </p>
        <p>
          This site does not collect any real personal data and has no commercial intent. It is a demonstration project and an exploration of modern web technologies, including React, TypeScript, and Tailwind CSS, within a fun and educational framework.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link to="/">
          <Button variant="outline" className="text-primary-foreground bg-primary hover:bg-primary/90">
            Return to Terms & Conditions
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LegalMentions;