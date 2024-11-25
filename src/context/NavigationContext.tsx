// src/context/NavigationContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavigationProviderProps {
  children: ReactNode; // Define the children prop as ReactNode
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <NavigationContext.Provider value={{ activeTab, setActiveTab }}>
      {children} {/* This renders the children passed into this component */}
    </NavigationContext.Provider>
  );
};
