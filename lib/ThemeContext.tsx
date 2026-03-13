import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  colorScheme: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    card: string;
    elevated: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryLight: string;
  };
}

const lightColors = {
  background: '#FFFFFF',
  surface: '#F2F2F7',
  card: '#FFFFFF',
  elevated: '#F2F2F7',
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  primary: '#34C759',
  primaryLight: 'rgba(52, 199, 89, 0.12)',
};

const darkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  card: '#1C1C1E',
  elevated: '#2C2C2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#98989D',
  border: '#38383A',
  primary: '#30D158',
  primaryLight: 'rgba(48, 209, 88, 0.18)',
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colorScheme: 'light',
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const value: ThemeContextType = {
    isDark,
    colorScheme: isDark ? 'dark' : 'light',
    colors: isDark ? darkColors : lightColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
