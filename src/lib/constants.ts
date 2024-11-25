//src/lib/constants.ts
export interface IconOption {
  id: string;
  imagePath: string;
}

export const ICON_OPTIONS: IconOption[] = [
  { id: 'default', imagePath: '/quest.webp' },
  { id: 'study', imagePath: '/study.webp' },
  { id: 'exercise', imagePath: '/exercise.webp' },
  { id: 'work', imagePath: '/work.webp' },
];

export const DEFAULT_ICON = '/quest.webp';
export const MAX_TITLE_LENGTH = 40;
