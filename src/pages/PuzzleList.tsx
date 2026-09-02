import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, CheckCircle2, Play } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { getPuzzlesByDifficulty } from '../data';
import { getTheme } from '../styles/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PuzzleList'>;
type RouteProps = RouteProp<RootStackParamList, 'PuzzleList'>;

const themeNames: Record<string, string> = {
  animal: '동물',
  food: '음식',
  travel: '여행'
};

export default function PuzzleList() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { themeId, diffId } = route.params;
  
  const { completedPuzzles, inProgressPuzzles, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);

  const themeName = themeNames[themeId] || '테마';
  const puzzleList = getPuzzlesByDifficulty(themeId, diffId);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {themeName} - {diffId.toUpperCase()}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.gridContainer}>
        <View style={styles.grid}>
          {puzzleList.map((puzzle, idx) => {
            const isCompleted = completedPuzzles.includes(puzzle.id);
            const isInProgress = !!inProgressPuzzles[puzzle.id];

            let cardBg = theme.card;
            let cardBorder = theme.border;
            let badgeBg = theme.slate[100];
            let badgeText = theme.slate[700];

            if (isCompleted) {
              cardBg = theme.indigo[50];
              cardBorder = theme.indigo[200];
              badgeBg = theme.indigo[200];
              badgeText = theme.indigo[700] || theme.primary;
            } else if (isInProgress) {
              cardBg = theme.amber[50];
              cardBorder = theme.amber[200];
              badgeBg = theme.amber[200];
              badgeText = theme.amber[700] || '#B45309';
            }

            return (
              <TouchableOpacity
                key={puzzle.id}
                style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Game', { puzzleId: puzzle.id })}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.numberBadge, { backgroundColor: badgeBg }]}>
                    <Text style={[styles.numberBadgeText, { color: badgeText }]}>{idx + 1}</Text>
                  </View>
                  {isCompleted && <CheckCircle2 size={20} color={theme.primary} />}
                  {isInProgress && !isCompleted && (
                    <Play size={16} color={theme.amber[600]} fill={theme.amber[600]} />
                  )}
                </View>

                <Text style={[styles.puzzleNameText, { color: theme.text }]} numberOfLines={2}>
                  {puzzle.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  gridContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 96,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  puzzleNameText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
});

