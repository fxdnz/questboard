//src/types/index.ts
export interface Quest {
  id: string;
  title: string;
  energy: number;
  iconPath: string;
  isEditing?: boolean;
}

export interface IconOption {
  id: string;
  imagePath: string;
}

export interface SideQuest {
  id: number;
  title: string;
  reward: number;
  progress: string;
  completed: boolean;
}

export interface Voucher {
  id: number;
  title: string;
  diamonds: number;
  expires: string;
  rarity:string;
  icon:string;
}

export type User = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  level?: number;
  experience?: number;
  // Add any other user-related fields you need
};


export type TabType = 'home' | 'quests' | 'shop' | 'profile';
