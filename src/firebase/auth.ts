import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword, sendEmailVerification, UserCredential } from 'firebase/auth';
import { auth } from './firebase';  // Assuming you're using Firebase auth instance here

// Function to create a user with email and password
export const doCreateUserWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error: any) {
    console.error('Error creating user:', error);
    handleFirebaseError(error);
    throw error;  // Rethrow the error if you need to handle it further up the stack
  }
};

// Function to sign in with email and password
export const doSignInWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error: any) {
    console.error('Error signing in:', error);
    handleFirebaseError(error);
    throw error;
  }
};

// Function to sign in with Google
export const doSignInWithGoogle = async (): Promise<UserCredential | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      // Ignore if the popup was closed by the user
      console.log('Google sign-in popup closed by the user');
    } else if (error.code === 'auth/unauthorized-domain') {
      // Handle the unauthorized domain error
      alert('This domain is not authorized to use Google Sign-In. Please check the domain settings in Firebase Console.');
    } else {
      console.error('Error during Google sign-in:', error);
      alert('An error occurred during sign-in. Please try again.');
    }
    return null;
  }
};

// Function to sign out the current user
export const doSignOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    handleFirebaseError(error);
    throw error;
  }
};

// Function to send password reset email
export const doPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    handleFirebaseError(error);
    throw error;
  }
};

// Function to change the password of the current user
export const doPasswordChange = async (password: string): Promise<void> => {
  if (auth.currentUser) {
    try {
      await updatePassword(auth.currentUser, password);
    } catch (error: any) {
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

// Function to send email verification
export const doSendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
      });
    } catch (error: any) {
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

// Function to handle Firebase errors and alert the user
const handleFirebaseError = (error: any) => {
  let errorMessage = 'An unexpected error occurred. Please try again.';

  // Customize the error messages based on the error code
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
      console.error('Unhandled error:', error); // This will help you debug other errors.
      break;
  }

  // Show the error message using alert
  alert(errorMessage);
};