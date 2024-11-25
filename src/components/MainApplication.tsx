import { useState } from 'react';
import HomeTab from '@/components/tabs/HomeTab';
import ShopTab from '@/components/tabs/ShopTab';
import SideQuestsTab from '@/components/tabs/SideQuestsTab';
import ProfileTab from '@/components/tabs/ProfileTab';
import AddQuestModal from '@/components/modals/AddQuestModal';
import AdventureModal from '@/components/modals/AdventureModal';
import RewardModal from '@/components/modals/RewardModal';
import Navigation from '@/components/layout/Navigation';
import Header from '@/components/layout/Header';
import type { TabType, Quest } from '@/types';

interface SideQuest {
  id: number;
  title: string;
  reward: number;
  progress: string;
  completed: boolean;
}

export default function MainApplication() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [diamonds, setDiamonds] = useState<number>(0);
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState<boolean>(false);
  const [characterAnimation, setCharacterAnimation] = useState<string>('idle.gif');
  const [quests, setQuests] = useState<Quest[]>([]);

  // Side quests state
  const [sideQuests, setSideQuests] = useState<SideQuest[]>([
    {
      id: 1,
      title: 'Start an adventure today',
      reward: 500,
      progress: '0/1',
      completed: false
    },
    {
      id: 2,
      title: 'Collect 1000 diamonds',
      reward: 1000,
      progress: `${diamonds}/1000`,
      completed: diamonds >= 1000
    }
  ]);

  // Adventure-related state
  const [isOnAdventure, setIsOnAdventure] = useState<boolean>(false);
  const [adventureNumber, setAdventureNumber] = useState<number>(1);
  const [showAdventureModal, setShowAdventureModal] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [pendingDiamonds, setPendingDiamonds] = useState<number>(0);

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false); // New state

  const handleStartAdventure = () => {
    if (isOnAdventure) return;

    const minDiamonds = 100;
    const maxDiamonds = 500;
    const diamondReward = Math.floor(Math.random() * (maxDiamonds - minDiamonds + 1));

    setSideQuests(prev =>
      prev.map(quest =>
        quest.id === 1
          ? { ...quest, progress: '1/1', completed: true }
          : quest
      )
    );

    setAdventureNumber(prev => prev + 1);
    setShowAdventureModal(false);
    setIsOnAdventure(true);
    setCharacterAnimation('rightadv.gif');
    setPendingDiamonds(diamondReward);

    setTimeout(() => {
      setCharacterAnimation('idle.gif');
      setIsOnAdventure(false);
      setShowRewardModal(true);
    }, 30000);
  };

  const handleCollectRewards = () => {
    const newDiamondTotal = diamonds + pendingDiamonds;
    setDiamonds(newDiamondTotal);

    setSideQuests(prev =>
      prev.map(quest =>
        quest.id === 2
          ? { ...quest, progress: `${newDiamondTotal}/1000`, completed: newDiamondTotal >= 1000 }
          : quest
      )
    );

    setPendingDiamonds(0);
    setShowRewardModal(false);
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

  const handleClaim = (id: number) => {
    // Handle the quest claim logic here
    setSideQuests(prev =>
      prev.map(quest =>
        quest.id === id
          ? { ...quest, completed: true, progress: `${quest.reward}/${quest.reward}` }
          : quest
      )
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col max-w-3xl mx-auto">
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
              src={characterAnimation}
              alt="Character"
              className={`h-[180px] w-[160px] ${characterAnimation === 'rightadv.gif' ? 'mr-10' : 'ml-10'}`}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === 'home' && (
            <HomeTab
              quests={quests}
              setQuests={setQuests}
              setCharacterAnimation={setCharacterAnimation}
              setShowAdventureModal={setShowAdventureModal}
              isOnAdventure={isOnAdventure}
              adventureNumber={adventureNumber}
              setDiamonds={setDiamonds}
            />
          )}
          {activeTab === 'shop' && <ShopTab />}
          {activeTab === 'quests' && <SideQuestsTab sideQuests={sideQuests} onClaim={handleClaim} />}
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

        <AdventureModal
          isVisible={showAdventureModal}
          onClose={() => setShowAdventureModal(false)}
          onStartAdventure={handleStartAdventure}
          adventureNumber={adventureNumber}
          maxEnergy={15}
          isOnAdventure={isOnAdventure}
        />

        <RewardModal
          isVisible={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          diamonds={pendingDiamonds}
          onCollect={handleCollectRewards}
        />
      </div>
    </div>
  );
}
