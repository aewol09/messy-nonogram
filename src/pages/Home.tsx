import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Play, Grid, Settings as SettingsIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { getTheme } from '../styles/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const { settings } = useGameStore();
  const theme = getTheme(settings.darkMode);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.titlePrimary, { color: theme.primary }]}>Pixel Puzzle</Text>
        <Text style={[styles.titleSecondary, { color: theme.secondary }]}>Quest</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: theme.primary, shadowColor: theme.indigo[200] }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ThemeSelect')}
        >
          <Play size={24} color={theme.white} fill={theme.white} />
          <Text style={styles.primaryButtonText}>플레이 시작</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.secondaryButton, { backgroundColor: theme.card, borderColor: theme.purple[100] }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Collection')}
        >
          <Grid size={24} color={theme.secondary} />
          <Text style={[styles.secondaryButtonText, { color: theme.secondary }]}>컬렉션</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tertiaryButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Settings')}
        >
          <SettingsIcon size={24} color={theme.subText} />
          <Text style={[styles.tertiaryButtonText, { color: theme.subText }]}>설정</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titleContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  titlePrimary: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleSecondary: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  tertiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tertiaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
