import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Play, Grid, Settings as SettingsIcon, Gamepad2, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { getTheme } from '../styles/theme';
import AuthModal from '../components/AuthModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const { currentUser, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top User Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.userChip, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowAuthModal(true)}
          activeOpacity={0.8}
        >
          <User size={16} color={theme.primary} />
          <Text style={[styles.userChipText, { color: theme.text }]} numberOfLines={1}>
            {currentUser ? currentUser.name : '로그인'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <View style={[styles.logoIconBadge, { backgroundColor: theme.indigo[100] }]}>
          <Gamepad2 size={56} color={theme.primary} />
        </View>
        <Text style={[styles.titlePrimary, { color: theme.primary }]}>Messy</Text>
        <Text style={[styles.titleSecondary, { color: theme.secondary }]}>Nonogram</Text>
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

      {/* Auth Modal */}
      <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    elevation: 2,
  },
  userChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    maxWidth: 100,
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoIconBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
