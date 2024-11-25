// src/components/auth/AuthScreen.tsx
import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { useAuth } from '@/context/authContext';

const AuthScreen = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLogin = () => {
    // Additional login success handling if needed
    console.log('Login successful');
  };

  const handleRegister = ({ email }: { email: string }) => {
    // Additional registration success handling if needed
    console.log('Registration successful with email:', email);
  };

  // Transition handlers
  const switchToRegister = () => setIsLoginView(false);
  const switchToLogin = () => setIsLoginView(true);

  return (
    <div className="relative min-h-screen w-full">
      {/* Background image and overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/winter.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {/* Auth screens with smooth transition */}
      <div className="relative z-10">
        <div className="transition-all duration-500 ease-in-out">
          {isLoginView ? (
            <LoginScreen
              onLogin={handleLogin}
              onSwitchToRegister={switchToRegister}
            />
          ) : (
            <RegisterScreen
              onLogin={handleRegister}
              onSwitchToLogin={switchToLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;