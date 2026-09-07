import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Cat, Coffee, Plane } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { puzzles } from '../data';
import { getTheme } from '../styles/theme';
import { getTranslation } from '../utils/i18n';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ThemeSelect'>;

export default function ThemeSelect() {
  const navigation = useNavigation<NavigationProp>();
  const { completedPuzzles, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);
  const t = getTranslation(settings.language || 'ko');

  const themes = [
    { id: 'animal', name: t.themeAnimal, icon: Cat, colorKey: 'orange' },
    { id: 'food', name: t.themeFood, icon: Coffee, colorKey: 'green' },
    { id: 'travel', name: t.themeTravel, icon: Plane, colorKey: 'blue' },
  ];

  const getCompletion = (themeId: string) => {
    const total = puzzles.filter(p => p.theme === themeId).length;
    const completed = puzzles.filter(p => p.theme === themeId && completedPuzzles.includes(p.id)).length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t.selectTheme}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {themes.map(item => {
          const stats = getCompletion(item.id);
          const Icon = item.icon;
          const palette = (theme as any)[item.colorKey] || theme.indigo;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DifficultySelect', { themeId: item.id })}
            >
              <View style={[styles.iconContainer, { backgroundColor: palette[100] }]}>
                <Icon size={32} color={palette[600]} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.cardStats, { color: theme.subText }]}>
                  {stats.completed} / {stats.total} {t.completed} ({stats.percentage}%)
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 16,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 50,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardStats: {
    fontSize: 14,
    fontWeight: '500',
  },
});

