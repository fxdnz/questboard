import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebase/firebase'; // Adjust the import path as needed

// Define the interface for the context
interface DiamondContextType {
  diamonds: number;
  setDiamonds: React.Dispatch<React.SetStateAction<number>>;
  addDiamonds: (amount: number) => void;
  syncDiamonds: () => Promise<void>;
}

// Create the context with a more specific initial value
const DiamondContext = createContext<DiamondContextType | undefined>(undefined);

export const DiamondProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [diamonds, setDiamonds] = useState<number>(0);

  // Sync diamonds with Firestore when the component mounts
  useEffect(() => {
    syncDiamonds();
  }, []);

  // Add diamonds and sync to Firestore
  const addDiamonds = async (amount: number) => {
    const newTotal = diamonds + amount;
    setDiamonds(newTotal);
    await saveDiamondsToFirestore(newTotal);
  };

  // Sync diamonds from Firestore
  const syncDiamonds = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const firestoreDiamonds = userData?.diamonds || 0;
        setDiamonds(firestoreDiamonds);
      }
    } catch (error) {
      console.error('Error syncing diamonds:', error);
    }
  };

  // Save diamonds to Firestore
  const saveDiamondsToFirestore = async (amount: number) => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { diamonds: amount });
    } catch (error) {
      console.error('Error saving diamonds:', error);
    }
  };

  return (
    <DiamondContext.Provider value={{ 
      diamonds, 
      setDiamonds, 
      addDiamonds,
      syncDiamonds 
    }}>
      {children}
    </DiamondContext.Provider>
  );
};

// Custom hook to use the DiamondContext
export const useDiamonds = () => {
  const context = useContext(DiamondContext);
  if (context === undefined) {
    throw new Error('useDiamonds must be used within a DiamondProvider');
  }
  return context;
};