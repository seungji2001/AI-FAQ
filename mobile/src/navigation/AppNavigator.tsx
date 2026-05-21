import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors, FontSize, FontWeight } from '../styles/theme';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import MyPageScreen from '../screens/MyPageScreen';
import WriteScreen from '../screens/WriteScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  ArticleDetail: { id: string };
  UserProfile: { id: string };
  Write: { id?: string } | undefined;
};

type TabParamList = {
  Home: undefined;
  Explore: undefined;
  WriteTab: undefined;
  MyPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_CONFIG: Record<string, { icon: string; label: string; title: string }> = {
  Home:     { icon: '🏠', label: '홈',    title: 'Thingz' },
  Explore:  { icon: '🔍', label: '탐색',  title: '탐색' },
  WriteTab: { icon: '✏️', label: '글쓰기', title: '새 글 쓰기' },
  MyPage:   { icon: '👤', label: '마이',  title: '마이페이지' },
};

// 글쓰기 탭은 스택으로 전환하는 더미 화면
function WriteTabPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
}

function MainTabs() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: TAB_CONFIG[route.name]?.title ?? '',
        headerTitleStyle: styles.headerTitle,
        headerStyle: styles.header,
        headerShadowVisible: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
            {TAB_CONFIG[route.name]?.icon}
          </Text>
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, { color: focused ? '#111' : '#aaa' }]}>
            {TAB_CONFIG[route.name]?.label}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen
        name="WriteTab"
        component={WriteTabPlaceholder}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Write', undefined);
          },
        }}
      />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
}

interface Props {
  initialRoute: 'Login' | 'Main';
}

export default function AppNavigator({ initialRoute }: Props) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          headerBackTitle: '뒤로',
          headerTintColor: Colors.ink,
          contentStyle: { backgroundColor: Colors.ivory },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ title: '' }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: '' }} />
        <Stack.Screen
          name="Write"
          component={WriteScreen}
          options={({ route }) => ({ title: route.params?.id ? '글 수정' : '새 글 쓰기' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.ivory,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.ink,
  },
  tabBar: {
    backgroundColor: Colors.ivory,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 6,
    height: Platform.OS === 'ios' ? 82 : 60,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
    color: Colors.ink,
  },
});
