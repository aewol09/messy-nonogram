import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Cat, Coffee, Plane, Lock, Zap, Star, ShieldAlert } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { puzzles } from '../data';
import { getTheme } from '../styles/theme';
import PixelArtPreview from '../components/PixelArtPreview';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Collection'>;

const themes = [
  { id: 'animal', name: '동물', icon: Cat },
  { id: 'food', name: '음식', icon: Coffee },
  { id: 'travel', name: '여행', icon: Plane },
];

const difficultySections = [
  { id: 'easy', title: 'Easy (5x5)', icon: Zap, themeKey: 'emerald' },
  { id: 'normal', title: 'Normal (10x10)', icon: Star, themeKey: 'amber' },
  { id: 'hard', title: 'Hard (15x15)', icon: ShieldAlert, themeKey: 'rose' },
];

export default function Collection() {
  const navigation = useNavigation<NavigationProp>();
  const { completedPuzzles, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);
  const [activeTab, setActiveTab] = useState('animal');

  const themePuzzles = puzzles.filter(p => p.theme === activeTab);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>컬렉션</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {themes.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setActiveTab(t.id)}
                style={[
                  styles.tab,
                  isActive
                    ? [styles.tabActive, { backgroundColor: theme.primary }]
                    : [styles.tabInactive, { backgroundColor: theme.background, borderColor: theme.border, borderWidth: 1 }],
                ]}
              >
                <Icon size={18} color={isActive ? theme.white : theme.subText} />
                <Text style={[styles.tabText, { color: isActive ? theme.white : theme.subText }]}>
                  {t.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {difficultySections.map(section => {
          const sectionPuzzles = themePuzzles.filter(p => p.difficulty === section.id);
          const completedCount = sectionPuzzles.filter(p => completedPuzzles.includes(p.id)).length;
          const SectionIcon = section.icon;
          const palette = (theme as any)[section.themeKey] || theme.indigo;

          return (
            <View key={section.id} style={styles.sectionContainer}>
              <View style={[styles.sectionHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.sectionTitleRow}>
                  <View style={[styles.sectionIconBox, { backgroundColor: palette[100] }]}>
                    <SectionIcon size={18} color={palette[600]} />
                  </View>
                  <Text style={[styles.sectionTitleText, { color: theme.text }]}>
                    {section.title}
                  </Text>
                </View>
                <Text style={[styles.sectionStatsText, { color: theme.subText }]}>
                  {completedCount} / {sectionPuzzles.length} 완성
                </Text>
              </View>

              <View style={styles.grid}>
                {sectionPuzzles.map((puzzle, idx) => {
                  const isCompleted = completedPuzzles.includes(puzzle.id);

                  return (
                    <View
                      key={puzzle.id}
                      style={[
                        styles.card,
                        isCompleted
                          ? [styles.cardCompleted, { backgroundColor: theme.card, borderColor: theme.border }]
                          : [styles.cardLocked, { backgroundColor: theme.background, borderColor: theme.border }],
                      ]}
                    >
                      {isCompleted ? (
                        <View style={styles.pixelArtContainer}>
                          <View style={styles.pixelWrapper}>
                            <PixelArtPreview
                              solution={puzzle.solution}
                              size={100}
                              primaryColor={theme.primary}
                              gridBorder={false}
                            />
                          </View>
                          <View style={[styles.puzzleNameOverlay, { backgroundColor: theme.card }]}>
                            <Text style={[styles.puzzleNameText, { color: theme.text }]} numberOfLines={1}>
                              {puzzle.name}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.lockedContainer}>
                          <Lock size={24} color={theme.subText} />
                          <Text style={[styles.lockedText, { color: theme.subText }]}>{idx + 1}번 퍼즐</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
                {sectionPuzzles.length % 2 !== 0 && (
                  <View style={[styles.card, { borderWidth: 0, backgroundColor: 'transparent' }]} />
                )}
              </View>
            </View>
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
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  tabActive: {
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabInactive: {},
  tabText: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 24,
  },
  sectionContainer: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionStatsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardCompleted: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardLocked: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedContainer: {
    alignItems: 'center',
    gap: 8,
  },
  lockedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pixelArtContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 8,
  },
  pixelWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  puzzleNameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  puzzleNameText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});


