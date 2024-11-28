import React, { createContext, useState, useContext, ReactNode } from 'react';

// Update the DiamondContext to include setDiamonds
interface DiamondContextType {
    diamonds: number;
    setDiamonds: React.Dispatch<React.SetStateAction<number>>; // Add this line
    addDiamonds: (amount: number) => void;
  }
  
  const DiamondContext = createContext<DiamondContextType | undefined>(undefined);
  
  export const DiamondProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [diamonds, setDiamonds] = useState<number>(0);
  
    const addDiamonds = (amount: number) => {
      setDiamonds(prev => prev + amount);
    };
  
    return (
      <DiamondContext.Provider value={{ diamonds, setDiamonds, addDiamonds }}>
        {children}
      </DiamondContext.Provider>
    );
  };
  
  export const useDiamonds = () => {
    const context = useContext(DiamondContext);
    if (context === undefined) {
      throw new Error('useDiamonds must be used within a DiamondProvider');
    }
    return context;
  };
  