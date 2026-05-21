import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import * as SplashScreen from 'expo-splash-screen';
import TokenManager from './src/core/auth/TokenManager';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/styles/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Main' | null>(null);
  const [fontsLoaded] = useFonts({ Pacifico_400Regular });

  useEffect(() => {
    TokenManager.isLoggedIn().then(ok => setInitialRoute(ok ? 'Main' : 'Login'));
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialRoute !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialRoute]);

  if (!fontsLoaded || initialRoute === null) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.ivory }}>
          <ActivityIndicator color={Colors.ink} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator initialRoute={initialRoute} />
    </SafeAreaProvider>
  );
}
