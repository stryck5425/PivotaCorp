import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NavigationLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  onLinkClick?: () => void; // Callback to close sidebar on link click
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ onLinkClick, className, ...props }) => {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className={cn("flex items-center space-x-4", className)} {...props}>
      <Link to="/world-record" onClick={onLinkClick}>
        <Button variant="ghost">
          World Record
        </Button>
      </Link>
      <Link to="/legal-mentions" onClick={onLinkClick}>
        <Button variant="ghost">
          Legal Mentions
        </Button>
      </Link>
      {user ? (
        <Button variant="ghost" onClick={handleLogout} disabled={loading}>
          Logout
        </Button>
      ) : (
        <Link to="/auth" onClick={onLinkClick}>
          <Button variant="ghost">
            Login / Sign Up
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NavigationLinks;