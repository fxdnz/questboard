import type { Voucher } from '@/types';

export const VOUCHERS: Voucher[] = [
    { id: 1, title: 'Koykoy 50PHP', diamonds: 5000, expires: '2024-12-31', rarity: 'Rare', icon: '/koykoy.webp' },
    { id: 2, title: 'Extra Quest Slot', diamonds: 7500, expires: '2024-12-31', rarity: 'Hero', icon: '/quest.webp' },
    { id: 3, title: 'Nuda 100PHP', diamonds: 25000, expires: '2024-12-31', rarity: 'Legendary', icon: '/nuda.webp' },
    
    // Modified entries for id 4, 5, and 6 with updated titles and icons
    { id: 4, title: 'Koykoy Premium', diamonds: 10000, expires: '2024-12-31', rarity: 'Rare', icon: '/koykoy.webp' },
    { id: 5, title: 'Double Quest Slot', diamonds: 15000, expires: '2024-12-31', rarity: 'Hero', icon: '/quest.webp' },
    { id: 6, title: 'Nuda 250PHP', diamonds: 50000, expires: '2024-12-31', rarity: 'Legendary', icon: '/nuda.webp' },
];
