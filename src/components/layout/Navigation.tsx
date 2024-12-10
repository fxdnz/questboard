// src/components/layout/Navigation.tsx
import { Home, Rocket, ShoppingBag, UserCircle2, Plus } from 'lucide-react';
import type { TabType } from '@/types';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  setShowAddQuestModal: (show: boolean) => void; // Added prop for managing modal visibility
}

export default function Navigation({ activeTab, setActiveTab, setShowAddQuestModal }: NavigationProps) {
  return (
    <div className="bg-gray-900 text-gray-400 p-4 fixed bottom-0 w-full max-w-full z-20 border-t-2 border-white"> 
      <div className="flex items-center justify-evenly w-full space-x-4">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center ${activeTab === 'home' ? 'text-yellow-400' : ''}`}
        >
          <Home size={24} />
          
        </button>
        <button
          onClick={() => setActiveTab('quests')}
          className={`flex flex-col items-center ${activeTab === 'quests' ? 'text-yellow-400' : ''}`}
        >
          <Rocket size={24} />
          
        </button>

        <button
          onClick={() => setShowAddQuestModal(true)} // Trigger modal visibility
          className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center -mt-2"
        >
          <Plus size={24} className="text-black" />
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center ${activeTab === 'shop' ? 'text-yellow-400' : ''}`}
        >
          <ShoppingBag size={24} />
          
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-yellow-400' : ''}`}
        >
          <UserCircle2 size={24} />
          
        </button>
      </div>
    </div>
  );
}
