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
        <Text style={[styles.headerTitle, { color: theme.text }]}>{themeName} - {diffId.toUpperCase()}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.gridContainer}>
        <View style={styles.grid}>
          {puzzleList.map((puzzle, idx) => {
            const isCompleted = completedPuzzles.includes(puzzle.id);
            const isInProgress = !!inProgressPuzzles[puzzle.id];

            let cardStyle: any = { backgroundColor: theme.card, borderColor: theme.border };
            let textStyle: any = { color: theme.subText };

            if (isCompleted) {
              cardStyle = { backgroundColor: theme.indigo[50], borderColor: theme.indigo[200] };
              textStyle = { color: theme.indigo[700] };
            } else if (isInProgress) {
              cardStyle = { backgroundColor: theme.amber[50], borderColor: theme.amber[200] };
              textStyle = { color: theme.amber[700] };
            }

            return (
              <TouchableOpacity
                key={puzzle.id}
                style={[styles.card, cardStyle]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Game', { puzzleId: puzzle.id })}
              >
                <Text style={[styles.numberText, textStyle]}>{idx + 1}</Text>
                
                {isCompleted && (
                  <View style={styles.iconBottomRight}>
                    <CheckCircle2 size={20} color={theme.primary} />
                  </View>
                )}
                {isInProgress && !isCompleted && (
                  <View style={[styles.iconBottomRight, { opacity: 0.5 }]}>
                    <Play size={16} color={theme.amber[700]} fill={theme.amber[700]} />
                  </View>
                )}
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
    height: 80, // Fixed height to make it horizontal
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconBottomRight: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
});
