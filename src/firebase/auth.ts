import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword, sendEmailVerification, UserCredential } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from './firebase';

// Function to save user to Firestore
export const saveUserToFirestore = async (user: UserCredential['user']) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  try {
    // Check if user document already exists
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        createdAt: new Date(),
        lastLogin: new Date(),
        // Add any additional user fields you want to track
        emailVerified: user.emailVerified,
      });
    } else {
      // Update last login time for existing users
      await setDoc(userRef, {
        lastLogin: new Date(),
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
    throw error;
  }
};

// Modify the existing sign-in function to save user to Firestore
export const doSignInWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Save user to Firestore after successful sign-in
    await saveUserToFirestore(result.user);
    
    return result;
  } catch (error: unknown) {
    console.error('Error signing in:', error);
    handleFirebaseError(error);
    throw error;
  }
};

// Modify the create user function to save user to Firestore
export const doCreateUserWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Save user to Firestore after successful user creation
    await saveUserToFirestore(result.user);
    
    return result;
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    handleFirebaseError(error);
    throw error;
  }
};

// Rest of the existing functions remain the same...
export const doSignOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error('Error signing out:', error);
    handleFirebaseError(error);
    throw error;
  }
};

export const doPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    console.error('Error sending password reset email:', error);
    handleFirebaseError(error);
    throw error;
  }
};

export const doPasswordChange = async (password: string): Promise<void> => {
  if (auth.currentUser) {
    try {
      await updatePassword(auth.currentUser, password);
    } catch (error: unknown) {
      console.error('Error changing password:', error);
      handleFirebaseError(error);
      throw error;
    }
  } else {
    const error = new Error('No user is currently signed in');
    handleFirebaseError(error);
    throw error;
  }
};

export const doSendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
      });
    } catch (error: unknown) {
      console.error('Error sending email verification:', error);
      handleFirebaseError(error);
      throw error;
    }
  } else {
    const error = new Error('No user is currently signed in');
    handleFirebaseError(error);
    throw error;
  }
};

export const handleFirebaseError = (error: unknown): string => {
  let errorMessage = 'An unexpected error occurred. Please try again.';

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'The email address is invalid. Please enter a valid email address.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already in use. Please use a different email address.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid credentials. Please check your input and try again.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'The authentication popup was closed before completion.';
        break;
      default:
        console.error('Unhandled error:', error);
        break;
    }
  } else {
    console.error('Unexpected error:', error);
  }

  return errorMessage;
};