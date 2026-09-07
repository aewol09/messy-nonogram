import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration, useWindowDimensions, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, RotateCcw, Lightbulb, CheckSquare, XSquare, Eye } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { getPuzzleById, getPuzzlesByDifficulty } from '../data';
import { useGameStore } from '../store/useGameStore';
import { checkWinCondition } from '../utils/nonogram';
import NonogramBoard from '../components/NonogramBoard';
import HintStoreModal from '../components/HintStoreModal';
import PuzzleWinModal from '../components/PuzzleWinModal';
import { getTheme } from '../styles/theme';
import { confirmAction } from '../utils/confirm';
import { getTranslation, getLocalizedPuzzleName } from '../utils/i18n';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type RouteProps = RouteProp<RootStackParamList, 'Game'>;

type DrawMode = 'fill' | 'x' | 'erase';

export default function Game() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { puzzleId } = route.params;
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const puzzle = getPuzzleById(puzzleId);
  const {
    getGameState,
    saveProgress,
    resetProgress,
    completePuzzle,
    completedPuzzles,
    hintPool,
    useHint: consumeHint,
    isUnlimitedHints,
    currentUser,
    settings,
  } = useGameStore();

  const theme = getTheme(settings.darkMode);
  const lang = settings.language || 'ko';
  const t = getTranslation(lang);
  const isAdmin = currentUser?.isAdmin || currentUser?.email?.toLowerCase().includes('admin');

  const [board, setBoard] = useState<number[][]>([]);
  const [mode, setMode] = useState<'fill' | 'x'>('fill');
  const [isWon, setIsWon] = useState(false);
  const [isAnimatingWin, setIsAnimatingWin] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  const dragAction = useRef<DrawMode | null>(null);
  const lastCell = useRef<{ r: number; c: number } | null>(null);
  const isDragging = useRef(false);

  const sameDiffPuzzles = puzzle ? getPuzzlesByDifficulty(puzzle.theme, puzzle.difficulty) : [];
  const currentIndex = sameDiffPuzzles.findIndex((p) => p.id === puzzle?.id);
  const nextPuzzle = currentIndex >= 0 && currentIndex < sameDiffPuzzles.length - 1 ? sameDiffPuzzles[currentIndex + 1] : null;

  const revealSolution = () => {
    if (!puzzle || isWon) return;
    setBoard(puzzle.solution);
  };

  useEffect(() => {
    if (!puzzle) return;

    const alreadyCompleted = completedPuzzles.includes(puzzle.id);
    if (alreadyCompleted) {
      setIsWon(true);
      setShowWinModal(false);
      setBoard(puzzle.solution);
      return;
    }

    const savedState = getGameState(puzzle.id);
    if (savedState) {
      setBoard(savedState.board.map((row) => row.map((cell) => cell.value)));
    } else {
      const emptyBoard = Array(puzzle.height)
        .fill(0)
        .map(() => Array(puzzle.width).fill(0));
      setBoard(emptyBoard);
    }
  }, [puzzleId]);

  useEffect(() => {
    if (!puzzle || isWon || isAnimatingWin || board.length === 0) return;

    const won = checkWinCondition(board, puzzle.solution);
    if (won) {
      setIsAnimatingWin(true);
      if (settings.hapticEnabled) {
        Vibration.vibrate([0, 100, 50, 100]);
      }

      // Smooth Gradient Color Sweep Animation over 1000ms
      const startTime = Date.now();
      const duration = 1000;

      const animInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1.0, elapsed / duration);
        setRevealProgress(progress);

        if (progress >= 1.0) {
          clearInterval(animInterval);
          setTimeout(() => {
            setIsWon(true);
            setIsAnimatingWin(false);
            completePuzzle(puzzle.id);
            setShowWinModal(true);
          }, 300);
        }
      }, 30);
    } else {
      const stateToSave = {
        board: board.map((row) => row.map((v) => ({ value: v }))),
        isComplete: false,
        hintsUsed: 0,
      };
      saveProgress(puzzle.id, stateToSave);
    }
  }, [board, puzzle, isWon, isAnimatingWin]);

  if (!puzzle) return <View style={styles.container}><Text>Puzzle not found</Text></View>;

  const handleCellInteract = (r: number, c: number, type: 'start' | 'move' | 'end') => {
    if (isWon || isAnimatingWin) return;

    if (type === 'end') {
      isDragging.current = false;
      dragAction.current = null;
      lastCell.current = null;
      return;
    }

    if (lastCell.current && lastCell.current.r === r && lastCell.current.c === c) return;
    lastCell.current = { r, c };

    const currentVal = board[r][c];

    if (type === 'start') {
      isDragging.current = true;

      let nextVal = 0;
      if (mode === 'fill') {
        if (currentVal === 2) {
          dragAction.current = null;
          return;
        }
        nextVal = currentVal === 1 ? 0 : 1;
        dragAction.current = nextVal === 0 ? 'erase' : 'fill';
      } else {
        if (currentVal === 1) {
          dragAction.current = null;
          return;
        }
        nextVal = currentVal === 2 ? 0 : 2;
        dragAction.current = nextVal === 0 ? 'erase' : 'x';
      }

      updateCell(r, c, nextVal);
    } else if (type === 'move' && isDragging.current && dragAction.current) {
      if (dragAction.current === 'fill') {
        if (currentVal !== 2) {
          updateCell(r, c, 1);
        }
      } else if (dragAction.current === 'x') {
        if (currentVal !== 1) {
          updateCell(r, c, 2);
        }
      } else if (dragAction.current === 'erase') {
        updateCell(r, c, 0);
      }
    }
  };

  const updateCell = (r: number, c: number, val: number) => {
    setBoard((prev) => {
      const newBoard = prev.map((row) => [...row]);
      newBoard[r][c] = val;
      return newBoard;
    });
  };

  const resetBoard = () => {
    const executeReset = () => {
      const emptyBoard = Array(puzzle.height)
        .fill(0)
        .map(() => Array(puzzle.width).fill(0));
      setBoard(emptyBoard);
      setIsWon(false);
      setIsAnimatingWin(false);
      setRevealProgress(0);
      setShowWinModal(false);
      resetProgress(puzzle.id);
    };

    confirmAction(t.resetConfirmTitle, t.resetConfirmDesc, executeReset, t.reset);
  };

  const useHintAction = () => {
    if (isWon || isAnimatingWin) return;

    if (!isUnlimitedHints && hintPool <= 0) {
      setShowHintModal(true);
      return;
    }

    const unfilledCorrectCells: { r: number; c: number }[] = [];
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.solution[r][c] === 1 && board[r][c] !== 1) {
          unfilledCorrectCells.push({ r, c });
        }
      }
    }

    if (unfilledCorrectCells.length > 0) {
      const randomCell = unfilledCorrectCells[Math.floor(Math.random() * unfilledCorrectCells.length)];
      updateCell(randomCell.r, randomCell.c, 1);
      consumeHint();
    } else {
      const msg = '이미 모든 정답 칸이 채워져 있습니다.';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('알림', msg);
      }
    }
  };

  const availableWidth = windowWidth - 24;
  const availableHeight = windowHeight - insets.top - insets.bottom - 60 - 90 - 32;

  const totalHintsAvailable = isUnlimitedHints ? '∞' : hintPool;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {getLocalizedPuzzleName(puzzle.name, lang)}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.subText }]}>{puzzle.width}x{puzzle.height}</Text>
        </View>

        {isAdmin && (
          <TouchableOpacity
            style={[styles.adminHeaderBtn, { backgroundColor: '#7C3AED' }]}
            onPress={revealSolution}
            activeOpacity={0.8}
          >
            <Eye size={16} color="#FFFFFF" />
            <Text style={styles.adminHeaderBtnText}>{t.revealAnswer}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Board Container */}
      <View style={styles.boardCenterWrapper}>
        {board.length > 0 && (
          <NonogramBoard
            width={puzzle.width}
            height={puzzle.height}
            solution={puzzle.solution}
            colorSolution={puzzle.colorSolution}
            board={board}
            onCellInteract={handleCellInteract}
            maxAvailableWidth={availableWidth}
            maxAvailableHeight={availableHeight}
            isWon={isWon}
            isAnimatingWin={isAnimatingWin}
            revealProgress={revealProgress}
          />
        )}
      </View>

      {/* Controls Footer */}
      <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => setMode('fill')}
          style={[
            styles.footerBtn,
            mode === 'fill'
              ? [styles.footerBtnActivePrimary, { backgroundColor: theme.primary }]
              : [styles.footerBtnInactive, { backgroundColor: theme.background }],
          ]}
        >
          <CheckSquare size={22} color={mode === 'fill' ? theme.white : theme.subText} />
          <Text style={[styles.footerBtnText, { color: mode === 'fill' ? theme.white : theme.subText }]}>
            {t.fillMode}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode('x')}
          style={[
            styles.footerBtn,
            mode === 'x'
              ? [styles.footerBtnActiveSecondary, { backgroundColor: theme.slate[700] }]
              : [styles.footerBtnInactive, { backgroundColor: theme.background }],
          ]}
        >
          <XSquare size={22} color={mode === 'x' ? theme.white : theme.subText} />
          <Text style={[styles.footerBtnText, { color: mode === 'x' ? theme.white : theme.subText }]}>
            {t.xMode}
          </Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          onPress={useHintAction}
          disabled={isWon || isAnimatingWin}
          style={[
            styles.footerBtn,
            { backgroundColor: theme.amber[50] },
            (isWon || isAnimatingWin) && styles.opacity50,
          ]}
        >
          <View style={styles.hintIconContainer}>
            <Lightbulb size={22} color={theme.amber[600]} />
            <View style={styles.hintBadge}>
              <Text style={styles.hintBadgeText}>{totalHintsAvailable}</Text>
            </View>
          </View>
          <Text style={[styles.footerBtnText, { color: theme.amber[600] }]}>{t.hint}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={resetBoard}
          style={[
            styles.footerBtn,
            { backgroundColor: theme.rose[50] },
          ]}
        >
          <RotateCcw size={22} color={theme.rose[600]} />
          <Text style={[styles.footerBtnText, { color: theme.rose[600] }]}>{t.reset}</Text>
        </TouchableOpacity>
      </View>

      {/* Hint Store Modal */}
      <HintStoreModal visible={showHintModal} onClose={() => setShowHintModal(false)} />

      {/* Redesigned Completion Win Modal */}
      <PuzzleWinModal
        visible={showWinModal}
        puzzle={puzzle}
        darkMode={settings.darkMode}
        onClose={() => setShowWinModal(false)}
        onNextPuzzle={
          nextPuzzle
            ? () => {
                setShowWinModal(false);
                navigation.replace('Game', { puzzleId: nextPuzzle.id });
              }
            : undefined
        }
        onGoToCollection={() => {
          setShowWinModal(false);
          navigation.navigate('Collection');
        }}
        onGoToList={() => {
          setShowWinModal(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  headerTextContainer: {
    flex: 1,
  },
  adminHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    elevation: 2,
  },
  adminHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  boardCenterWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footer: {
    height: 80,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtn: {
    flex: 1,
    maxWidth: 80,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    gap: 2,
  },
  footerBtnInactive: {},
  footerBtnActivePrimary: {
    elevation: 2,
  },
  footerBtnActiveSecondary: {
    elevation: 2,
  },
  divider: {
    width: 1,
    height: 36,
    marginHorizontal: 4,
  },
  footerBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  hintIconContainer: {
    position: 'relative',
  },
  hintBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#F59E0B',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  opacity50: {
    opacity: 0.5,
  },
});
