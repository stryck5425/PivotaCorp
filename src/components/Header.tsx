import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName: string;
  tagline: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ companyName, tagline, className, onMenuClick, ...props }) => {
  const { user, logout, loading } = useAuth(); // Use the auth hook

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
          <Link to="/world-record"> {/* New link for World Record */}
            <Button variant="ghost">
              World Record
            </Button>
          </Link>
          <Link to="/legal-mentions">
            <Button variant="ghost">
              Legal Mentions
            </Button>
          </Link>
          {user ? (
            <Button variant="ghost" onClick={logout} disabled={loading}>
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost">
                Login / Sign Up
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;