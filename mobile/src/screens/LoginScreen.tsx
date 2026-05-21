import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as AppleAuthentication from 'expo-apple-authentication';
import AuthService from '../core/services/AuthService';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(false);

  async function handleAppleLogin() {
    setLoading(true);
    try {
      await AuthService.signInWithApple();
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e: any) {
      if (e?.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('로그인 실패', '다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDevLogin() {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>Thingz</Text>
      <Text style={styles.sub}>당신의 관심사를 공유하세요</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.button} />
      ) : Platform.OS === 'ios' ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={12}
          style={styles.button}
          onPress={handleAppleLogin}
        />
      ) : (
        <TouchableOpacity style={styles.devButton} onPress={handleDevLogin}>
          <Text style={styles.devButtonText}>개발 테스트 로그인 (Android)</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.hint}>
        {Platform.OS === 'ios' ? 'iOS 기기에서 Apple 로그인 사용 가능' : 'Android: Apple 로그인은 iOS 전용'}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logo: {
    fontSize: 56,
    fontFamily: 'Pacifico_400Regular',
    color: Colors.ink,
    letterSpacing: 0,
  },
  sub: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  button: {
    width: 280,
    height: 50,
  },
  devButton: {
    width: 280,
    height: 50,
    backgroundColor: Colors.ink,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  hint: {
    fontSize: FontSize.sm,
    color: Colors.gray300,
    marginTop: 8,
  },
});
