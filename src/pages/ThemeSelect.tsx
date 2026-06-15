import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Cat, Coffee, Plane } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { puzzles } from '../data';
import { colors } from '../styles/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ThemeSelect'>;

const themes = [
  { id: 'animal', name: '동물', icon: Cat, bgColor: colors.orange[100], iconColor: colors.orange[600] },
  { id: 'food', name: '음식', icon: Coffee, bgColor: colors.green[100], iconColor: colors.green[600] },
  { id: 'travel', name: '여행', icon: Plane, bgColor: colors.blue[100], iconColor: colors.blue[600] }
];

export default function ThemeSelect() {
  const navigation = useNavigation<NavigationProp>();
  const completedPuzzles = useGameStore((state) => state.completedPuzzles);

  const getCompletion = (themeId: string) => {
    const total = puzzles.filter(p => p.theme === themeId).length;
    const completed = puzzles.filter(p => p.theme === themeId && completedPuzzles.includes(p.id)).length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.slate[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>테마 선택</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {themes.map((theme) => {
          const stats = getCompletion(theme.id);
          const Icon = theme.icon;

          return (
            <TouchableOpacity
              key={theme.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DifficultySelect', { themeId: theme.id })}
            >
              <View style={[styles.iconContainer, { backgroundColor: theme.bgColor }]}>
                <Icon size={32} color={theme.iconColor} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{theme.name}</Text>
                <Text style={styles.cardStats}>
                  {stats.completed} / {stats.total} 완료 ({stats.percentage}%)
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
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
    color: colors.slate[800],
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
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.slate[100],
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
    color: colors.slate[800],
    marginBottom: 4,
  },
  cardStats: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate[500],
  },
});
