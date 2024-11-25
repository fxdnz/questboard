// src/types/auth.ts

export interface AuthScreenProps {
    
    onLogin: (user: { email: string }) => void; // Accepts an object with an email property
    onSwitchToLogin: () => void; // No arguments, just switches to login screen
    onSwitchToRegister: () => void;
  }

export interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
}
