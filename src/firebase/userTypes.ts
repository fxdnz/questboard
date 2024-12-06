import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface FirestoreUserProfile {
  uid: string;
  email: string | null;
  username: string;
  createdAt: Timestamp | Date;
  lastLogin: Timestamp | Date;
  emailVerified: boolean;
  profile: {
    displayName: string;
    // Add any additional profile-related fields here
    photoURL?: string;
    bio?: string;
  };
}

export type FirebaseUserWithProfile = User & {
  // You can add any additional User-specific fields here if needed
};