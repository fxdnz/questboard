// app/page.tsx
'use client'

import { useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import AuthScreen from '@/components/auth/AuthScreen';
import { NavigationProvider } from '@/context/NavigationContext';
import { DiamondProvider } from '@/context/DiamondContext';
import MainApplication from '@/components/MainApplication';
import { AdventureProvider } from '@/context/AdventureContext';

export default function Home() {
  const { userLoggedIn, loading } = useAuth();

  // Disable zooming on mobile devices by setting the viewport meta tag
  useEffect(() => {
    const metaTag = document.querySelector('meta[name="viewport"]');
    if (metaTag) {
      metaTag.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      );
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.setAttribute('name', 'viewport');
      newMetaTag.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      );
      document.head.appendChild(newMetaTag);
    }

    return () => {
      // Cleanup: Reset the meta tag when the component unmounts
      if (metaTag) {
        metaTag.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes'
        );
      }
    };
  }, []);

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
      <DiamondProvider>
        <AdventureProvider>
          <MainApplication />
        </AdventureProvider>
      </DiamondProvider>
    </NavigationProvider>
  );
}
