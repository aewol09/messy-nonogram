import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Home from './src/pages/Home';
import ThemeSelect from './src/pages/ThemeSelect';
import DifficultySelect from './src/pages/DifficultySelect';
import PuzzleList from './src/pages/PuzzleList';
import Game from './src/pages/Game';
import Collection from './src/pages/Collection';
import Settings from './src/pages/Settings';
import PrivacyPolicy from './src/pages/PrivacyPolicy';

export type RootStackParamList = {
  Home: undefined;
  ThemeSelect: undefined;
  DifficultySelect: { themeId: string };
  PuzzleList: { themeId: string; diffId: string };
  Game: { puzzleId: string };
  Collection: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#990000', padding: 20, justifyContent: 'center' }}>
          <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>앱 실행 중 오류 발생</Text>
          <Text style={{ color: '#ffffff', fontSize: 14 }}>{this.state.error?.toString()}</Text>
          <Text style={{ color: '#ffaaaa', fontSize: 12, marginTop: 10 }}>{this.state.error?.stack}</Text>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ThemeSelect" component={ThemeSelect} />
            <Stack.Screen name="DifficultySelect" component={DifficultySelect} />
            <Stack.Screen name="PuzzleList" component={PuzzleList} />
            <Stack.Screen name="Game" component={Game} />
            <Stack.Screen name="Collection" component={Collection} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

