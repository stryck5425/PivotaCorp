import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, PanelLeft, PanelRight } from 'lucide-react';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName: string;
  tagline: string;
  onMenuClick?: () => void; // For mobile sidebar
  onToggleSidebar?: () => void; // For desktop sidebar toggle
  isSidebarOpen?: boolean; // To show appropriate icon for desktop toggle
}

const Header: React.FC<HeaderProps> = ({ companyName, tagline, className, onMenuClick, onToggleSidebar, isSidebarOpen, ...props }) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          {/* Desktop sidebar toggle button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex" // Only visible on large screens (desktop)
            onClick={onToggleSidebar}
          >
            {isSidebarOpen ? <PanelLeft className="h-6 w-6" /> : <PanelRight className="h-6 w-6" />}
            <span className="sr-only">Toggle desktop sidebar</span>
          </Button>

          <h1 className="text-2xl font-bold text-primary">
            {companyName}
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {tagline}
          </p>
        </div>
        <nav className="ml-auto flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden" // Only visible on small screens (mobile)
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle mobile sidebar</span>
          </Button>
          {/* Navigation items can go here if needed */}
        </nav>
      </div>
    </header>
  );
};

export default Header;