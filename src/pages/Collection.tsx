import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Cat, Coffee, Plane, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { puzzles } from '../data';
import { colors } from '../styles/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Collection'>;

const themes = [
  { id: 'animal', name: '동물', icon: Cat },
  { id: 'food', name: '음식', icon: Coffee },
  { id: 'travel', name: '여행', icon: Plane }
];

export default function Collection() {
  const navigation = useNavigation<NavigationProp>();
  const completedPuzzles = useGameStore((state) => state.completedPuzzles);
  const [activeTab, setActiveTab] = useState('animal');

  const themePuzzles = puzzles.filter(p => p.theme === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.slate[700]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>컬렉션</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {themes.map(theme => {
            const Icon = theme.icon;
            const isActive = activeTab === theme.id;
            
            return (
              <TouchableOpacity
                key={theme.id}
                onPress={() => setActiveTab(theme.id)}
                style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
              >
                <Icon size={18} color={isActive ? colors.white : colors.slate[600]} />
                <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
                  {theme.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {themePuzzles.map((puzzle, idx) => {
            const isCompleted = completedPuzzles.includes(puzzle.id);

            return (
              <View key={puzzle.id} style={[styles.card, isCompleted ? styles.cardCompleted : styles.cardLocked]}>
                {isCompleted ? (
                  <View style={styles.pixelArtContainer}>
                    <View style={styles.pixelArtGrid}>
                      {puzzle.solution.map((row, rIdx) => (
                        <View key={`r-${rIdx}`} style={styles.pixelRow}>
                          {row.map((cell, cIdx) => (
                            <View 
                              key={`c-${cIdx}`} 
                              style={[
                                styles.pixelCell, 
                                { backgroundColor: cell === 1 ? colors.primary : 'transparent' }
                              ]} 
                            />
                          ))}
                        </View>
                      ))}
                    </View>
                    <View style={styles.puzzleNameOverlay}>
                      <Text style={styles.puzzleNameText} numberOfLines={1}>{puzzle.name}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.lockedContainer}>
                    <Lock size={28} color={colors.slate[400]} />
                    <Text style={styles.lockedText}>{idx + 1}번 퍼즐</Text>
                  </View>
                )}
              </View>
            );
          })}
          {/* Add empty views to align last row left if it's odd */}
          {themePuzzles.length % 2 !== 0 && <View style={[styles.card, { borderWidth: 0, backgroundColor: 'transparent' }]} />}
        </View>
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
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
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
    color: colors.slate[800],
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
    backgroundColor: colors.primary,
    elevation: 2,
    shadowColor: colors.indigo[200],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  tabInactive: {
    backgroundColor: colors.slate[100],
  },
  tabText: {
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: colors.white,
  },
  tabTextInactive: {
    color: colors.slate[600],
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // For 2 columns
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 8,
  },
  cardCompleted: {
    backgroundColor: colors.white,
    borderColor: colors.slate[200],
  },
  cardLocked: {
    backgroundColor: colors.slate[50],
    borderColor: colors.slate[200],
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
    color: colors.slate[400],
  },
  pixelArtContainer: {
    flex: 1,
    position: 'relative',
  },
  pixelArtGrid: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pixelRow: {
    flex: 1,
    flexDirection: 'row',
  },
  pixelCell: {
    flex: 1,
    margin: 0.5,
  },
  puzzleNameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  puzzleNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.slate[800],
  },
});
