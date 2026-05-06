import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceTheme = useDeviceColorScheme() as ThemeType | null;
  const [theme, setTheme] = useState<ThemeType>(deviceTheme || 'light');

  useEffect(() => {
    // Cargar el tema guardado
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        } else if (deviceTheme) {
          setTheme(deviceTheme);
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      }
    };
    loadTheme();
  }, [deviceTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('appTheme', newTheme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
