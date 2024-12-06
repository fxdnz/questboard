import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from './PasswordInput';
import { doSignInWithEmailAndPassword, handleFirebaseError } from '@/firebase/auth';
import { FirebaseError } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { FirestoreUserProfile, FirebaseUserWithProfile } from '@/firebase/userTypes';


interface LoginScreenProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

   // In LoginScreen
   const saveUserToFirestore = async (user: FirebaseUserWithProfile) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
  
    try {
      // Check if user document already exists
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          username: user.displayName || '',
          createdAt: new Date(),
          lastLogin: new Date(),
          emailVerified: user.emailVerified,
          profile: {
            displayName: user.displayName || '',
            photoURL: user.photoURL,
          }
        } as FirestoreUserProfile);
      } else {
        // Update last login time for existing users
        await setDoc(userRef, {
          lastLogin: new Date(),
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      // Optionally, you could set an error state here
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError(''); // Reset any previous errors

    try {
      // Perform login
      const userCredential = await doSignInWithEmailAndPassword(loginEmail, loginPassword);
      
      // Save user to Firestore
      if (userCredential.user) {
        await saveUserToFirestore(userCredential.user);
      }

      // Call onLogin callback
      onLogin();
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        // Use the handleFirebaseError function to get the error message
        const errorMessage = handleFirebaseError(err);
        setEmailError(errorMessage); // Set the error message in state
      } else {
        setEmailError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 p-4">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="Logo" className="w-35 h-32 mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Continue your Adventure</h1>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Email error message */}
              {emailError && (
                <div className="text-red-400 text-sm text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  {emailError}
                </div>
              )}
              <Input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setEmailError(''); // Clear error when user starts typing
                }}
                className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12 ${
                  emailError ? 'border-red-500' : ''
                }`}
                required
              />
              <PasswordInput
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                showPassword={showLoginPassword}
                onToggleVisibility={() => setShowLoginPassword(!showLoginPassword)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white hover:bg-white text-black font-semibold h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </Button>

            <div className="flex justify-between items-center text-sm">
              <button type="button" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Forgot Password?
              </button>
              <button
                type="button"
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                onClick={onSwitchToRegister}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;