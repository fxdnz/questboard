import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of adventure progress data
interface AdventureProgressType {
  isOnAdventure: boolean;
  adventureNumber: number;
  startTime: number;
  pendingDiamonds: number;
  characterAnimation: string;
  remainingTime: number;
  adventureEndTime: number | null;
}

interface AdventureContextType {
  adventureProgress: AdventureProgressType;
  updateAdventureProgress: (updates: Partial<AdventureProgressType>) => void;
  resetAdventureProgress: () => void;
  startAdventure: (diamondReward?: number) => void;
  endAdventure: () => void;
}

const AdventureContext = createContext<AdventureContextType | undefined>(undefined);

export const useAdventureProgress = () => {
  const context = useContext(AdventureContext);
  if (!context) {
    throw new Error('useAdventureProgress must be used within an AdventureProvider');
  }
  return context;
};

export const AdventureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default initial state
  const defaultProgress: AdventureProgressType = {
    isOnAdventure: false,
    adventureNumber: 1,
    startTime: 0,
    pendingDiamonds: 0,
    characterAnimation: 'idle.gif',
    remainingTime: 0,
    adventureEndTime: null
  };

  // State to store adventure progress
  const [adventureProgress, setAdventureProgress] = useState<AdventureProgressType>(defaultProgress);

  // Method to update adventure progress
  const updateAdventureProgress = (updates: Partial<AdventureProgressType>) => {
    setAdventureProgress(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Method to reset adventure progress
  const resetAdventureProgress = () => {
    setAdventureProgress(defaultProgress);
  };

  // Method to start an adventure
  const startAdventure = () => {
    const adventureDuration = 30000; // 30 seconds
    const endTime = Date.now() + adventureDuration;

    setAdventureProgress(prev => ({
      ...prev,
      isOnAdventure: true,
      adventureNumber: prev.adventureNumber + 1,
      startTime: Date.now(),
      pendingDiamonds: 0, // Set to 0 when starting adventure
      characterAnimation: 'rightadv.gif',
      remainingTime: adventureDuration / 1000,
      adventureEndTime: endTime
    }));
  };

  // Method to end an adventure
  const endAdventure = () => {
    // If no specific reward is passed, generate a random reward
    const diamondReward = Math.floor(Math.random() * (500 - 100 + 1)) + 100;

    setAdventureProgress(prev => ({
      ...prev,
      isOnAdventure: false,
      characterAnimation: 'idle.gif',
      remainingTime: 0,
      adventureEndTime: null,
      pendingDiamonds: diamondReward // Set pending diamonds when adventure ends
    }));
  };

  // Handle adventure timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (adventureProgress.isOnAdventure && adventureProgress.adventureEndTime) {
      timer = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, adventureProgress.adventureEndTime! - now);

        if (timeLeft <= 0) {
          if (timer) clearInterval(timer);
          endAdventure();
        } else {
          updateAdventureProgress({
            remainingTime: Math.ceil(timeLeft / 1000),
            adventureEndTime: adventureProgress.adventureEndTime
          });
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [adventureProgress.isOnAdventure, adventureProgress.adventureEndTime]);

  return (
    <AdventureContext.Provider 
      value={{ 
        adventureProgress, 
        updateAdventureProgress, 
        resetAdventureProgress,
        startAdventure,
        endAdventure
      }}
    >
      {children}
    </AdventureContext.Provider>
  );
};