import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../lib/ThemeContext';
import { ProfileService } from '../lib/services/profile.service';

import '../global.css';

function RootStack() {
  const { isDark, colors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [hasSetup, setHasSetup] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    (async () => {
      const completed = await ProfileService.hasCompletedSetup();
      setHasSetup(completed);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    (async () => {
      const inOnboarding = segments[0] === 'onboarding';
      const actuallyHasSetup = await ProfileService.hasCompletedSetup();

      if (actuallyHasSetup !== hasSetup) {
        setHasSetup(actuallyHasSetup);
      }

      if (!actuallyHasSetup && !inOnboarding) {
        router.replace('/onboarding');
      }
    })();
  }, [isReady, segments]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings/index" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
