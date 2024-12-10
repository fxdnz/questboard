import { useState, useEffect } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
} from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import { DEFAULT_ICON } from '@/lib/constants';

export default function MainApplication() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const { diamonds, addDiamonds } = useDiamonds();
  const [isAddQuestModalVisible, setIsAddQuestModalVisible] = useState<boolean>(false);
  const [quests, setQuests] = useState<Quest[]>([]);

  const { user } = useAuth();
  const { 
    adventureProgress, 
    updateAdventureProgress 
  } = useAdventureProgress();

  // Fetch quests for the current user
  useEffect(() => {
    if (!user) return;

    // Reference to the user's quests collection
    const questsRef = collection(firestore, 'users', user.uid, 'quests');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(questsRef, (snapshot) => {
      const fetchedQuests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Quest));

      setQuests(fetchedQuests);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  const handleCollectRewards = () => {
    if (adventureProgress.pendingDiamonds > 0) {
      addDiamonds(adventureProgress.pendingDiamonds);
      updateAdventureProgress({ pendingDiamonds: 0 });
    }
  };

  // Create a new quest in Firestore
  const handleAddQuest = async (title: string, iconPath?: string) => {
    if (!user || !title.trim()) return;

    try {
      const questsRef = collection(firestore, 'users', user.uid, 'quests');
      const newQuest: Omit<Quest, 'id'> = { 
        title, 
        iconPath: iconPath || DEFAULT_ICON, 
        energy: 5, 
        isEditing: false 
      };

      await addDoc(questsRef, newQuest);
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col max-w-full mx-auto relative">
      <div className="absolute inset-0 w-full">
        <div
          className="absolute inset-0 w-full h-screen"
          style={{
            backgroundImage: "url('/spring.png')",
            backgroundPosition: "top center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
        />
        <div className="absolute inset-0 w-full bg-black/10" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {activeTab !== 'profile' && (
          <div className="fixed top-0 left-0 right-0 z-50 max-w-3xl mx-auto h-14">
            <Header diamonds={diamonds} />
          </div>
        )}

        <div className="relative h-52 mt-40">
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