import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Zap, Star, ShieldAlert } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { puzzles } from '../data';
import { getTheme } from '../styles/theme';
import { getTranslation } from '../utils/i18n';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DifficultySelect'>;
type RouteProps = RouteProp<RootStackParamList, 'DifficultySelect'>;

export default function DifficultySelect() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { themeId } = route.params;
  const { completedPuzzles, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);
  const t = getTranslation(settings.language || 'ko');

  const themeNames: Record<string, string> = {
    animal: t.themeAnimal,
    food: t.themeFood,
    travel: t.themeTravel
  };

  const difficulties = [
    { id: 'easy', name: 'Easy', label: t.diffEasy, size: '10x10', icon: Zap, themeColor: 'emerald' },
    { id: 'normal', name: 'Normal', label: t.diffNormal, size: '15x15', icon: Star, themeColor: 'amber' },
    { id: 'hard', name: 'Hard', label: t.diffHard, size: '20x20', icon: ShieldAlert, themeColor: 'rose' }
  ];

  const getCompletion = (diffId: string) => {
    const themePuzzles = puzzles.filter(p => p.theme === themeId && p.difficulty === diffId);
    const total = themePuzzles.length;
    const completed = themePuzzles.filter(p => completedPuzzles.includes(p.id)).length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const themeName = themeNames[themeId] || 'Theme';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{themeName} - {t.selectDifficulty}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {difficulties.map((diff) => {
          const stats = getCompletion(diff.id);
          const Icon = diff.icon;
          const diffColors = (theme as any)[diff.themeColor];

          return (
            <TouchableOpacity
              key={diff.id}
              style={[styles.card, { backgroundColor: theme.card, borderColor: diffColors[200] }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PuzzleList', { themeId, diffId: diff.id })}
            >
              <View style={[styles.iconContainer, { backgroundColor: diffColors[100] }]}>
                <Icon size={40} color={diffColors[600]} />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{diff.name}</Text>
                  <View style={[styles.badge, { backgroundColor: theme.slate[100] }]}>
                    <Text style={[styles.badgeText, { color: theme.slate[600] }]}>{diff.size}</Text>
                  </View>
                </View>
                
                <View style={[styles.progressBarBg, { backgroundColor: theme.slate[100] }]}>
                  <View style={[styles.progressBarFill, { backgroundColor: diffColors[600], width: `${stats.percentage}%` }]} />
                </View>

                <Text style={[styles.cardStats, { color: theme.subText }]}>
                  {stats.completed} / {stats.total} {t.completed}
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
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardStats: {
    fontSize: 14,
    fontWeight: '500',
  },
});
