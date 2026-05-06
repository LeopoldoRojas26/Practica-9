import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useThemeContext } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme, isDark } = useThemeContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarStyle: {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDark ? '#333333' : '#E5E5E5',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="entrenar"
        options={{
          title: 'Entrenar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="figure.run" color={color} />,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="descanso"
        options={{
          title: 'Descanso',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="timer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ejercicios"
        options={{
          title: 'Ejercicios',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }}
      />
    </Tabs>
  );
}
