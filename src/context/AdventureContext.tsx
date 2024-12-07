import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import the User type
import { auth, firestore } from '@/firebase/firebase'; // Adjust this to your Firebase config path

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
  loadAdventureProgress: () => Promise<void>;
  saveAdventureProgress: (progress?: Partial<AdventureProgressType>) => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Explicitly type as User | null

  // Method to save adventure progress to Firestore
  const saveAdventureProgress = async (progress?: Partial<AdventureProgressType>) => {
    if (!currentUser) return;

    const progressToSave = progress ? { ...adventureProgress, ...progress } : adventureProgress;
    
    try {
      const userDocRef = doc(firestore, 'userProgress', currentUser.uid);
      await setDoc(userDocRef, {
        adventureProgress: {
          ...progressToSave,
          // Convert Date/number to timestamp if needed
          startTime: progressToSave.startTime,
          adventureEndTime: progressToSave.adventureEndTime
        }
      }, { merge: true });
    } catch (error) {
      console.error("Error saving adventure progress:", error);
    }
  };

  // Method to load adventure progress from Firestore
  const loadAdventureProgress = async () => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(firestore, 'userProgress', currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const savedProgress = docSnap.data().adventureProgress;
        
        if (savedProgress) {
          // Restore progress, but handle ongoing adventures
          const now = Date.now();
          const savedEndTime = savedProgress.adventureEndTime;

          if (savedProgress.isOnAdventure && savedEndTime && savedEndTime > now) {
            // Adventure is still ongoing, update remaining time
            const remainingTime = Math.max(0, Math.ceil((savedEndTime - now) / 1000));
            
            setAdventureProgress({
              ...savedProgress,
              remainingTime,
              adventureEndTime: savedEndTime
            });
          } else if (savedProgress.isOnAdventure) {
            // Adventure was ongoing but is now completed
            setAdventureProgress({
              ...defaultProgress,
              adventureNumber: savedProgress.adventureNumber,
              pendingDiamonds: Math.floor(Math.random() * (500 - 100 + 1)) + 100
            });
          } else {
            // No active adventure
            setAdventureProgress(savedProgress);
          }
        }
      }
    } catch (error) {
      console.error("Error loading adventure progress:", error);
    }
  };

  // Method to update adventure progress
  const updateAdventureProgress = (updates: Partial<AdventureProgressType>) => {
    const newProgress = { ...adventureProgress, ...updates };
    setAdventureProgress(newProgress);
    
    // Save updates to Firestore
    saveAdventureProgress(updates);
  };

  // Method to reset adventure progress
  const resetAdventureProgress = () => {
    const resetState = defaultProgress;
    setAdventureProgress(resetState);
    saveAdventureProgress(resetState);
  };

  // Method to start an adventure
  const startAdventure = () => {
    const adventureDuration = 30000; // 30 seconds
    const endTime = Date.now() + adventureDuration;

    const newProgress = {
      isOnAdventure: true,
      adventureNumber: adventureProgress.adventureNumber + 1,
      startTime: Date.now(),
      pendingDiamonds: 0,
      characterAnimation: 'rightadv.gif',
      remainingTime: adventureDuration / 1000,
      adventureEndTime: endTime
    };

    setAdventureProgress(newProgress);
    saveAdventureProgress(newProgress);
  };

  // Method to end an adventure
  const endAdventure = () => {
    // Generate a random diamond reward
    const diamondReward = Math.floor(Math.random() * (500 - 100 + 1)) + 100;

    const newProgress = {
      isOnAdventure: false,
      characterAnimation: 'idle.gif',
      remainingTime: 0,
      adventureEndTime: null,
      pendingDiamonds: diamondReward
    };

    setAdventureProgress(prev => ({
      ...prev,
      ...newProgress
    }));
    saveAdventureProgress(newProgress);
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

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      // Load adventure progress when user changes
      if (user) {
        loadAdventureProgress();
      } else {
        // Reset progress when no user is logged in
        setAdventureProgress(defaultProgress);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AdventureContext.Provider 
      value={{ 
        adventureProgress, 
        updateAdventureProgress, 
        resetAdventureProgress,
        startAdventure,
        endAdventure,
        loadAdventureProgress,
        saveAdventureProgress
      }}
    >
      {children}
    </AdventureContext.Provider>
  );
};
