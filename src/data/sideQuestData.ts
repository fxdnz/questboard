import type { SideQuest } from '../types/index';

export const INITIAL_SIDE_QUESTS: SideQuest[] = [
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
    progress: '0/1000',
    completed: false
  }
];

export interface SideQuest1 {
  id: number;
  title: string;
  reward: number;
  progress: string;
  completed: boolean;
}

export const sideQuestUtils = {
  updateProgress: (quests: SideQuest[], questId: number, newProgress: string) => {
    return quests.map(quest => 
      quest.id === questId 
        ? { 
            ...quest, 
            progress: newProgress, 
            completed: isQuestCompleted(quest, newProgress) 
          }
        : quest
    );
  },

  claimReward: (quests: SideQuest[], questId: number) => {
    return quests.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true }
        : quest
    );
  }
};

function isQuestCompleted(quest: SideQuest, newProgress: string): boolean {
  const [current, total] = newProgress.split('/').map(Number);
  return current >= Number(total.toFixed());
}