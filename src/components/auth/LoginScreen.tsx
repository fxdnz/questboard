import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from './PasswordInput';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '@/firebase/auth';

interface LoginScreenProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await doSignInWithEmailAndPassword(loginEmail, loginPassword);
      onLogin();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await doSignInWithGoogle();
      onLogin();
    } catch (err: any) {
      setErrorMessage(err.message);
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
           
            
          </div>

          {errorMessage && (
            <div className="text-red-400 text-sm text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-12"
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
              className="w-full bg-white hover:bg-yellow-600 text-black font-semibold h-12 text-lg"
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-400 bg-gray-900">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 h-12"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;