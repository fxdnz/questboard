// app/page.tsx
'use client'

import { useAuth } from '@/context/authContext';
import AuthScreen from '@/components/auth/AuthScreen';
import { NavigationProvider } from '@/context/NavigationContext';
import MainApplication from '@/components/MainApplication';

export default function Home() {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userLoggedIn) {
    return <AuthScreen />;
  }

  return (
    <NavigationProvider>
      <MainApplication />
    </NavigationProvider>
  );
}