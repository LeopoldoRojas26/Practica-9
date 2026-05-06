import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProvider } from '@/app/context/AppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { isDark } = useThemeContext();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="historial/[id]" options={{ presentation: 'card', title: 'Detalle de Sesión', headerBackTitle: 'Atrás' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={isDark ? "light" : "dark"} />
        </NavigationThemeProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <RootNavigator />
    </CustomThemeProvider>
  );
}
