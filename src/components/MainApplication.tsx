import { useState } from 'react';
import HomeTab from '@/components/tabs/HomeTab';
import ShopTab from '@/components/tabs/ShopTab';
import SideQuestsTab from '@/components/tabs/SideQuestsTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import AddQuestModal from '@/components/modals/AddQuestModal';
import RewardModal from '@/components/modals/RewardModal';
import Navigation from '@/components/layout/Navigation';
import Header from '@/components/layout/Header';
import type { TabType, Quest } from '@/types';
import { useDiamonds } from '@/context/DiamondContext';
import { useAdventureProgress } from '@/context/AdventureContext';

export default function MainApplication() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { diamonds, addDiamonds } = useDiamonds();
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState<boolean>(false);
  const [quests, setQuests] = useState<Quest[]>([]);

  // Use AdventureContext for adventure-related state
  const { 
    adventureProgress, 

    updateAdventureProgress 
  } = useAdventureProgress();

  

  const handleCollectRewards = () => {
    addDiamonds(adventureProgress.pendingDiamonds);
    updateAdventureProgress({ pendingDiamonds: 0 });
  };

  const handleAddQuest = (title: string, iconPath: string) => {
    const newQuest: Quest = {
      id: Date.now(),
      title,
      iconPath,
      energy: 5,
      isEditing: false
    };
    setQuests(prev => [...prev, newQuest]);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col max-w-3xl mx-auto">
      {/* Background and overlay remain the same */}
      <div className="absolute inset-0 w-full">
        <div
          className="absolute inset-0 w-full h-screen"
          style={{
            backgroundImage: "url('/winter.png')",
            backgroundPosition: "top center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0 w-full bg-black/30" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Conditionally render the Header based on the active tab */}
        {activeTab !== 'profile' && (
          <div className="fixed top-0 left-0 right-0 z-50 max-w-3xl mx-auto h-14">
            <Header diamonds={diamonds} />
          </div>
        )}

        <div className="relative h-52 mt-20">
          <div className="absolute inset-0 flex justify-center items-center">
            <img
              src={adventureProgress.characterAnimation}
              alt="Character"
              className={`h-[180px] w-[160px] ${adventureProgress.characterAnimation === 'rightadv.gif' ? 'mr-10' : 'ml-10'}`}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === 'home' && (
            <HomeTab
              quests={quests}
              setQuests={setQuests}
            />
          )}
          {activeTab === 'shop' && <ShopTab />}
          {activeTab === 'quests' && <SideQuestsTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </main>

        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowAddQuestModal={setIsAddQuestModalVisible}
        />

        <AddQuestModal
          isVisible={isAddQuestModalVisible}
          onClose={() => setIsAddQuestModalVisible(false)}
          onAddQuest={handleAddQuest}
        />

        

        <RewardModal
          isVisible={adventureProgress.pendingDiamonds > 0}
          onClose={() => updateAdventureProgress({ pendingDiamonds: 0 })}
          diamonds={adventureProgress.pendingDiamonds}
          onCollect={handleCollectRewards}
        />
      </div>
    </div>
  );
}