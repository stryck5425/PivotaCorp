import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName: string;
  tagline: string;
}

const Header: React.FC<HeaderProps> = ({ companyName, tagline, className, ...props }) => {
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
          <h1 className="text-2xl font-bold text-primary">
            {companyName}
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {tagline}
          </p>
        </div>
        <nav className="ml-auto flex items-center space-x-4">
          {/* Navigation items can go here if needed */}
        </nav>
      </div>
    </header>
  );
};

export default Header;