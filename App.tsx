import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

export default function App() {
  return (
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
  );
}
