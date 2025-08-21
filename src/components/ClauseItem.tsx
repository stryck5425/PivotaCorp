import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface ClauseItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  title: string;
  content: string;
  number: number;
  category: string;
  lastUpdated: string;
  innerRef?: React.Ref<HTMLDivElement>;
}

const ClauseItem: React.FC<ClauseItemProps> = ({ id, title, content, number, category, lastUpdated, innerRef, className, ...props }) => {
  return (
    <Card
      id={id}
      ref={innerRef}
      className={cn("mb-6 bg-card text-card-foreground border-border shadow-sm", className)}
      {...props}
    >
      <CardHeader className="pb-2">
        <p className="text-xs text-muted-foreground mb-1">
          Clause {number} &bull; Category: {category} &bull; Last Updated: {lastUpdated}
        </p>
        <CardTitle className="text-xl font-semibold text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-foreground leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  );
};

export default ClauseItem;