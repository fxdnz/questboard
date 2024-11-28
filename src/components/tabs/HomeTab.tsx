import React, { useState, useEffect } from 'react';
import QuestList from '../quests/QuestList';
import { getOrdinalSuffix } from '../utils/helpers';
import { Quest } from '@/types';
import { useAdventureProgress } from '@/context/AdventureContext';
import AdventureModal from '../modals/AdventureModal';
import RewardModal from '../modals/RewardModal';
import { useDiamonds } from '@/context/DiamondContext';

interface HomeTabProps {
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
}

const HomeTab = ({ 
  quests, 
  setQuests
}: HomeTabProps) => {
  const { addDiamonds } = useDiamonds();
  const { 
    adventureProgress, 
    startAdventure, 
    updateAdventureProgress 
  } = useAdventureProgress();

  const [energy, setEnergy] = useState<number>(0);
  const [maxEnergy, setMaxEnergy] = useState<number>(() => {
    // Start with 15 energy for the first adventure
    // Increment by 5 for each subsequent adventure
    return 15 + (Math.max(0, adventureProgress.adventureNumber - 1) * 5);
  });

  const [isReadyForAdventure, setIsReadyForAdventure] = useState<boolean>(false);

  // Collect diamonds when reward modal is shown
  const collectDiamonds = () => {
    if (adventureProgress.pendingDiamonds) {
      addDiamonds(adventureProgress.pendingDiamonds);
      updateAdventureProgress({ pendingDiamonds: 0 });
    }
  };

  // Update max energy when adventure number changes
  useEffect(() => {
    const newMaxEnergy = 15 + (Math.max(0, adventureProgress.adventureNumber - 1) * 5);
    setMaxEnergy(newMaxEnergy);
  }, [adventureProgress.adventureNumber]);

  // Check if energy is full and adventure is not ongoing
  useEffect(() => {
    if (energy >= maxEnergy && !adventureProgress.isOnAdventure) {
      setIsReadyForAdventure(true);
    } else {
      setIsReadyForAdventure(false);
    }
  }, [energy, maxEnergy, adventureProgress.isOnAdventure]);

  const HomeContent = (): JSX.Element => {
    return (
      <div className="space-y-4 p-4 ">
        <div className="bg-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/energy.webp" className="rounded h-8 w-8" alt="Energy" />
              <span className="text-lg font-semibold text-white">
                {adventureProgress.isOnAdventure ? (
                  "Adventure ongoing"
                ) : (
                  <>
                    {adventureProgress.adventureNumber}
                    <span className="text-xs align-top">
                      {getOrdinalSuffix(adventureProgress.adventureNumber)}
                    </span>
                    {' Adventure'}
                  </>
                )}
              </span>
            </div>
            <span className="text-white font-medium">
              {adventureProgress.isOnAdventure ? (
                <span className="text-yellow-400">
                  {adventureProgress.remainingTime}s left
                </span>
              ) : (
                `${energy} / ${maxEnergy}`
              )}
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 rounded-full h-2 transition-all duration-300 ease-in-out"
              style={{ 
                width: adventureProgress.isOnAdventure ? 
                  `${(30 - adventureProgress.remainingTime) / 30 * 100}%` : 
                  `${(energy / maxEnergy) * 100}%` 
              }}
            />
          </div>
          <div className="text-gray-300 text-sm">
            {adventureProgress.isOnAdventure ? (
              "Alto is on an adventure! Complete quests to gain energy for the next adventure."
            ) : (
              `Gain ⚡ energy to go on the ${adventureProgress.adventureNumber}${getOrdinalSuffix(adventureProgress.adventureNumber)} adventure!`
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
          isOnAdventure={adventureProgress.isOnAdventure}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <HomeContent />
      <AdventureModal
        isVisible={isReadyForAdventure}
        onClose={() => {/* No-op, user must interact */}}
        onStartAdventure={() => {
          const diamondReward = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
          startAdventure(diamondReward);
          setEnergy(0); // Reset energy when adventure starts
        }}
        adventureNumber={adventureProgress.adventureNumber}
        maxEnergy={maxEnergy}
        isOnAdventure={adventureProgress.isOnAdventure}
      />
      <RewardModal
        isVisible={adventureProgress.pendingDiamonds > 0}
        onClose={() => updateAdventureProgress({ pendingDiamonds: 0 })}
        diamonds={adventureProgress.pendingDiamonds}
        onCollect={collectDiamonds}
      />
    </div>
  );
};

export default HomeTab;