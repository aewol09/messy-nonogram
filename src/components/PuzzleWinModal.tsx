import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Trophy, ArrowRight, Grid, Award, Sparkles, X } from 'lucide-react-native';
import type { Puzzle } from '../types';
import PixelArtPreview from './PixelArtPreview';
import { getTheme } from '../styles/theme';
import { useGameStore } from '../store/useGameStore';
import { getTranslation, getLocalizedPuzzleName } from '../utils/i18n';

interface PuzzleWinModalProps {
  visible: boolean;
  puzzle: Puzzle;
  onClose: () => void;
  onNextPuzzle?: () => void;
  onGoToCollection: () => void;
  onGoToList: () => void;
  darkMode?: boolean;
}

export default function PuzzleWinModal({
  visible,
  puzzle,
  onClose,
  onNextPuzzle,
  onGoToCollection,
  onGoToList,
  darkMode = false,
}: PuzzleWinModalProps) {
  const { settings } = useGameStore();
  const theme = getTheme(darkMode);
  const lang = settings.language || 'ko';
  const t = getTranslation(lang);

  const localizedName = getLocalizedPuzzleName(puzzle.name, lang);

  const difficultyLabel =
    puzzle.difficulty === 'easy'
      ? t.diffEasy
      : puzzle.difficulty === 'normal'
      ? t.diffNormal
      : t.diffHard;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={20} color={theme.subText} />
          </TouchableOpacity>

          {/* Celebratory Icon Header */}
          <View style={styles.headerBox}>
            <View style={[styles.iconRing, { backgroundColor: theme.amber[100] }]}>
              <Trophy size={40} color={theme.amber[600]} />
              <View style={styles.sparkleBadge}>
                <Sparkles size={16} color="#FFFFFF" />
              </View>
            </View>

            <Text style={[styles.title, { color: theme.text }]}>{t.winTitle}</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>
              {lang === 'ko' ? (
                <>축하합니다! <Text style={styles.puzzleHighlight}>'{localizedName}'</Text> 그림을 완성했습니다.</>
              ) : lang === 'ja' ? (
                <>おめでとうございます！ <Text style={styles.puzzleHighlight}>『{localizedName}』</Text> を完成させました。</>
              ) : (
                <>Congratulations! You solved <Text style={styles.puzzleHighlight}>'{localizedName}'</Text>.</>
              )}
            </Text>
          </View>

          {/* Pixel Art Showcase Frame */}
          <View style={[styles.previewFrame, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.badgeRow}>
              <View style={[styles.infoBadge, { backgroundColor: theme.indigo[100] }]}>
                <Grid size={12} color={theme.primary} />
                <Text style={[styles.infoBadgeText, { color: theme.primary }]}>{difficultyLabel}</Text>
              </View>
              <View style={[styles.infoBadge, { backgroundColor: theme.indigo[50] }]}>
                <Award size={12} color={theme.indigo[700]} />
                <Text style={[styles.infoBadgeText, { color: theme.indigo[700] }]}>{t.completed}</Text>
              </View>
            </View>

            <View style={styles.artContainer}>
              <PixelArtPreview
                solution={puzzle.solution}
                colorSolution={puzzle.colorSolution}
                size={Math.min(160, puzzle.width * 14)}
                primaryColor={theme.primary}
                gridBorder={false}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonStack}>
            {onNextPuzzle && (
              <TouchableOpacity
                style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
                onPress={onNextPuzzle}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>{t.nextPuzzle}</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btnSecondary, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={onGoToCollection}
                activeOpacity={0.8}
              >
                <Text style={[styles.btnSecondaryText, { color: theme.text }]}>{t.viewCollection}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSecondary, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={onGoToList}
                activeOpacity={0.8}
              >
                <Text style={[styles.btnSecondaryText, { color: theme.text }]}>{t.goToList}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 6,
    zIndex: 10,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  sparkleBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  puzzleHighlight: {
    fontWeight: 'bold',
  },
  previewFrame: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  infoBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  artContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  btnPrimary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 3,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
