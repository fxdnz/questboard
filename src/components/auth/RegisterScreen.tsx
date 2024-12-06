import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from './PasswordInput';
import { doCreateUserWithEmailAndPassword } from '@/firebase/auth';
import { FirebaseError } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

interface RegisterScreenProps {
  onLogin: ({ email }: { email: string }) => void;
  onSwitchToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onLogin, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const saveUserToFirestore = async (user: any, username: string) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);

    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: username,
        createdAt: new Date(),
        lastLogin: new Date(),
        emailVerified: user.emailVerified,
        // Add any additional user fields you want to track
        profile: {
          displayName: username,
          // You can add more profile-related fields here
        }
      });
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      throw error;
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setIsLoading(true);
    try {
      // Create user with email and password
      const userCredential = await doCreateUserWithEmailAndPassword(registerEmail, registerPassword);
      
      // Save additional user info to Firestore
      await saveUserToFirestore(userCredential.user, username);

      // Trigger login callback
      onLogin({ email: registerEmail });
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        // Handle Firebase-specific errors
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered. Please use a different email.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address. Please check and try again.');
            break;
          default:
            setError(err.message || 'An error occurred during registration');
        }
      } else if (err instanceof Error) {
        // Handle general JavaScript errors
        setError(err.message);
      } else {
        // Catch any unexpected errors
        setError('An unexpected error occurred. Please try again.');
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
            <img src="/logo.png" alt="Game Logo" className="w-35 h-32 mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Start your Journey</h1>
            <p className="text-gray-400 text-sm">Turn your tasks into Adventure</p>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
                required
              />
              <PasswordInput
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Password"
                showPassword={showRegisterPassword}
                onToggleVisibility={() => setShowRegisterPassword(!showRegisterPassword)}
              />
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                showPassword={showConfirmPassword}
                onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white hover:bg-yellow-600 text-black font-semibold h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="flex justify-center items-center">
              <button 
                type="button"
                className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                onClick={onSwitchToLogin}
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;