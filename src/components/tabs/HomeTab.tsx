import React, { useState, useEffect } from 'react';
import QuestList from '../quests/QuestList';
import { getOrdinalSuffix } from '../utils/helpers';
import { Quest } from '@/types';
import AdventureModal from '../modals/AdventureModal';
import RewardModal from '../modals/RewardModal';

interface HomeTabProps {
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  setCharacterAnimation: (animation: string) => void;
  setDiamonds: React.Dispatch<React.SetStateAction<number>>;
  // Add these new props
  setShowAdventureModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOnAdventure: boolean;
  adventureNumber: number;
}

const HomeTab = ({ 
  quests, 
  setQuests, 
  setCharacterAnimation,
  setDiamonds 
}: HomeTabProps): JSX.Element => {
  // State
  const [energy, setEnergy] = useState<number>(0);
  const [maxEnergy, setMaxEnergy] = useState<number>(15);
  const [isOnAdventure, setIsOnAdventure] = useState<boolean>(false);
  const [adventureNumber, setAdventureNumber] = useState<number>(1);
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [showAdventureModal, setShowAdventureModal] = useState<boolean>(false);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [pendingDiamonds, setPendingDiamonds] = useState<number | null>(null);
  const [adventureEndTime, setAdventureEndTime] = useState<number | null>(null);
  const [adventureProgress, setAdventureProgress] = useState<number>(0);

  
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startAdventure = () => {
    if (isOnAdventure) return;
    
    setEnergy(0);
    setAdventureNumber(prev => prev + 1);
    setMaxEnergy(prev => prev < 50 ? prev + 5 : prev);
    setShowAdventureModal(false);
    setIsOnAdventure(true);
    
    const adventureDuration = 30000; 
    const endTime = Date.now() + adventureDuration;
    setAdventureEndTime(endTime);
    
    setCharacterAnimation('rightadv.gif');
    
    const diamondReward = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
    setPendingDiamonds(diamondReward);
    
    setTimeout(() => {
      setCharacterAnimation('idle.gif');
      setIsOnAdventure(false);
      setAdventureEndTime(null);
      setShowRewardModal(true);
    }, adventureDuration);
  };

  const collectDiamonds = () => {
    if (pendingDiamonds) {
      setDiamonds(prev => prev + pendingDiamonds);
      setPendingDiamonds(null);
      setShowRewardModal(false);
    }
  };

  useEffect(() => {
    let timer: number | undefined;
  
    if (isOnAdventure && adventureEndTime) {
      const totalDuration = 30000;
      const startTime = Date.now();
  
      setAdventureProgress(0);
  
      timer = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
  
        if (now >= adventureEndTime) {
          setIsOnAdventure(false);
          setAdventureEndTime(null);
          setRemainingTime('00:00');
          setAdventureProgress(100);
          clearInterval(timer);
        } else {
          const timeLeft = adventureEndTime - now;
          setRemainingTime(formatTime(timeLeft));
  
          const progress = Math.min(100, (elapsed / totalDuration) * 100);
          setAdventureProgress(Math.round(progress));
        }
      }, 1000);
    }
  
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isOnAdventure, adventureEndTime]);

  useEffect(() => {
    if (energy >= maxEnergy && !isOnAdventure) {
      setShowAdventureModal(true);
    }
  }, [energy, maxEnergy, isOnAdventure]);

  const HomeContent = (): JSX.Element => {
    return (
      <div className="space-y-4 p-4 ">
        {/* Adventure and Energy Section */}
        <div className="bg-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/energy.webp" className="rounded h-8 w-8" alt="Energy" />
              <span className="text-lg font-semibold text-white">
                {isOnAdventure ? (
                  "Adventure ongoing"
                ) : (
                  <>
                    {adventureNumber}
                    <span className="text-xs align-top">
                      {getOrdinalSuffix(adventureNumber)}
                    </span>
                    {' Adventure'}
                  </>
                )}
              </span>
            </div>
            <span className="text-white font-medium">
              {isOnAdventure ? (
                <span className="text-yellow-400">{remainingTime} left</span>
              ) : (
                `${energy} / ${maxEnergy}`
              )}
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 rounded-full h-2 transition-all duration-300 ease-in-out"
              style={{ 
                width: isOnAdventure ? 
                  `${adventureProgress}%` : 
                  `${(energy / maxEnergy) * 100}%` 
              }}
            />
          </div>
          <div className="text-gray-300 text-sm">
            {isOnAdventure ? (
              "Alto is on an adventure! Complete quests to gain energy for the next adventure."
            ) : (
              "Gain ⚡ energy so Alto can go discover new things today!"
            )}
          </div>
        </div>

        {/* Quest Count Section */}
        <div className="text-gray-300">
          <span>{quests.length} main quests left for today!</span>
        </div>

        {/* Quest List */}
        <QuestList 
          quests={quests} 
          setQuests={setQuests} 
          setEnergy={setEnergy} 
          maxEnergy={maxEnergy}
          isOnAdventure={isOnAdventure}
          adventureProgress={adventureProgress}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <HomeContent />
      <AdventureModal
        isVisible={showAdventureModal}
        onClose={() => setShowAdventureModal(false)}
        onStartAdventure={startAdventure}
        adventureNumber={adventureNumber}
        maxEnergy={maxEnergy}
        isOnAdventure={isOnAdventure}
      />
      <RewardModal
        isVisible={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        diamonds={pendingDiamonds}
        onCollect={collectDiamonds}
      />
    </div>
  );
};

export default HomeTab;

