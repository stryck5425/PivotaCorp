import React from 'react';
import AuthForm from '@/components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate('/'); // Redirect to home after successful login/signup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </div>
  );
};

export default AuthPage;