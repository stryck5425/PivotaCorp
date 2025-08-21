import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';
import NavigationLinks from './NavigationLinks'; // Import the new component

interface Stats {
  timeSpent: number;
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  currentSessionStats: Stats;
  personalRecordStats: Stats;
  onResetSession: () => void;
  onLinkClick?: () => void; // New prop to close sidebar on link click
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .filter((v, i) => v !== '00' || i > 0 || h > 0)
    .join(':');
};

const Sidebar: React.FC<SidebarProps> = ({ currentSessionStats, personalRecordStats, onResetSession, onLinkClick, className, ...props }) => {
  return (
    <aside
      className={cn(
        "w-64 p-4 border-r bg-sidebar sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto flex flex-col", // Added flex-col for layout
        className
      )}
      {...props}
    >
      <Card className="mb-6 bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Current Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Time Spent:</span>
            <span className="font-medium">{formatTime(currentSessionStats.timeSpent)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Personal Record</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Time Spent:</span>
            <span className="font-medium">{formatTime(personalRecordStats.timeSpent)}</span>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4 bg-sidebar-border" />

      {/* Navigation links for mobile sidebar */}
      <div className="flex flex-col space-y-2 mb-6">
        <NavigationLinks className="flex-col items-start space-x-0 space-y-2" onLinkClick={onLinkClick} />
      </div>

      <Separator className="my-4 bg-sidebar-border" />

      <Button onClick={onResetSession} className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
        Reset Session
      </Button>
    </aside>
  );
};

export default Sidebar;