import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration, ScrollView, Modal } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, RotateCcw, Lightbulb, CheckSquare, XSquare } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../App';
import { getPuzzleById } from '../data';
import { useGameStore } from '../store/useGameStore';
import { checkWinCondition } from '../utils/nonogram';
import NonogramBoard from '../components/NonogramBoard';
import { getTheme } from '../styles/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type RouteProps = RouteProp<RootStackParamList, 'Game'>;

type DrawMode = 'fill' | 'x' | null;

export default function Game() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { puzzleId } = route.params;

  const puzzle = getPuzzleById(puzzleId);
  const { getGameState, saveProgress, completePuzzle, completedPuzzles, settings } = useGameStore();
  const theme = getTheme(settings.darkMode);

  const [board, setBoard] = useState<number[][]>([]);
  const [mode, setMode] = useState<'fill' | 'x'>('fill');
  const [isWon, setIsWon] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [isDragging, setIsDragging] = useState(false);

  const dragAction = useRef<DrawMode>(null);
  const lastCell = useRef<{r: number, c: number} | null>(null);

  useEffect(() => {
    if (!puzzle) return;

    if (completedPuzzles.includes(puzzle.id)) {
      setIsWon(true);
      setBoard(puzzle.solution);
      return;
    }

    const savedState = getGameState(puzzle.id);
    if (savedState) {
      setBoard(savedState.board.map(row => row.map(cell => cell.value)));
      setHintsLeft(3 - savedState.hintsUsed);
    } else {
      const emptyBoard = Array(puzzle.height).fill(0).map(() => Array(puzzle.width).fill(0));
      setBoard(emptyBoard);
    }
  }, [puzzle, completedPuzzles]);

  useEffect(() => {
    if (!puzzle || isWon || board.length === 0) return;

    const won = checkWinCondition(board, puzzle.solution);
    if (won) {
      setIsWon(true);
      completePuzzle(puzzle.id);
      if (settings.hapticEnabled) {
        Vibration.vibrate([0, 100, 50, 100]);
      }
    } else {
      const stateToSave = {
        board: board.map(row => row.map(v => ({ value: v }))),
        isComplete: false,
        hintsUsed: 3 - hintsLeft
      };
      saveProgress(puzzle.id, stateToSave);
    }
  }, [board, puzzle, isWon]);

  if (!puzzle) return <View style={styles.container}><Text>Puzzle not found</Text></View>;

  const handleCellInteract = (r: number, c: number, type: 'start' | 'move' | 'end') => {
    if (isWon) return;

    if (type === 'end') {
      setIsDragging(false);
      dragAction.current = null;
      lastCell.current = null;
      return;
    }

    if (lastCell.current && lastCell.current.r === r && lastCell.current.c === c) return;
    lastCell.current = { r, c };

    if (type === 'start') {
      setIsDragging(true);
      const currentVal = board[r][c];
      
      let nextVal = 0;
      if (mode === 'fill') {
        nextVal = currentVal === 1 ? 0 : 1;
      } else {
        nextVal = currentVal === 2 ? 0 : 2;
      }
      
      // Lock the action for current drag (filling or erasing)
      dragAction.current = nextVal === 0 ? null : (nextVal === 1 ? 'fill' : 'x');
      updateCell(r, c, nextVal);
    } else if (type === 'move' && isDragging) {
      let nextVal = 0;
      if (dragAction.current === 'fill') nextVal = 1;
      else if (dragAction.current === 'x') nextVal = 2;
      else nextVal = 0; // erasing mode

      updateCell(r, c, nextVal);
    }
  };

  const updateCell = (r: number, c: number, val: number) => {
    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);
      newBoard[r][c] = val;
      return newBoard;
    });
  };

  const resetBoard = () => {
    if (isWon) return;
    Alert.alert('퍼즐 초기화', '정말 퍼즐을 초기화하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '초기화', style: 'destructive', onPress: () => {
        const emptyBoard = Array(puzzle.height).fill(0).map(() => Array(puzzle.width).fill(0));
        setBoard(emptyBoard);
      }}
    ]);
  };

  const useHint = () => {
    if (isWon || hintsLeft <= 0) return;

    const availableCells: {r: number, c: number}[] = [];
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.solution[r][c] === 1 && board[r][c] !== 1) {
          availableCells.push({r, c});
        }
      }
    }

    if (availableCells.length > 0) {
      const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
      updateCell(randomCell.r, randomCell.c, 1);
      setHintsLeft(prev => prev - 1);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{puzzle.name}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.subText }]}>{puzzle.width}x{puzzle.height}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView 
          contentContainerStyle={styles.boardScrollContainer}
          maximumZoomScale={2}
          minimumZoomScale={1}
          bounces={false}
          scrollEnabled={!isDragging}
        >
          <ScrollView horizontal scrollEnabled={!isDragging}>
            {board.length > 0 && (
              <NonogramBoard 
                width={puzzle.width}
                height={puzzle.height}
                solution={puzzle.solution}
                board={board}
                onCellInteract={handleCellInteract}
              />
            )}
          </ScrollView>
        </ScrollView>
      </View>

      <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          onPress={() => setMode('fill')}
          style={[styles.footerBtn, mode === 'fill' ? [styles.footerBtnActivePrimary, { backgroundColor: theme.primary }] : [styles.footerBtnInactive, { backgroundColor: theme.background }]]}
        >
          <CheckSquare size={24} color={mode === 'fill' ? theme.white : theme.subText} />
          <Text style={[styles.footerBtnText, { color: mode === 'fill' ? theme.white : theme.subText }]}>채우기</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setMode('x')}
          style={[styles.footerBtn, mode === 'x' ? [styles.footerBtnActiveSecondary, { backgroundColor: theme.slate[700] }] : [styles.footerBtnInactive, { backgroundColor: theme.background }]]}
        >
          <XSquare size={24} color={mode === 'x' ? theme.white : theme.subText} />
          <Text style={[styles.footerBtnText, { color: mode === 'x' ? theme.white : theme.subText }]}>X 표시</Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity 
          onPress={useHint}
          disabled={hintsLeft === 0 || isWon}
          style={[styles.footerBtn, { backgroundColor: theme.amber[50] }, (hintsLeft === 0 || isWon) && styles.opacity50]}
        >
          <View style={styles.hintIconContainer}>
            <Lightbulb size={24} color={theme.amber[600]} />
            <View style={styles.hintBadge}>
              <Text style={styles.hintBadgeText}>{hintsLeft}</Text>
            </View>
          </View>
          <Text style={[styles.footerBtnText, { color: theme.amber[600] }]}>힌트</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={resetBoard}
          disabled={isWon}
          style={[styles.footerBtn, { backgroundColor: theme.rose[50] }, isWon && styles.opacity50]}
        >
          <RotateCcw size={24} color={theme.rose[600]} />
          <Text style={[styles.footerBtnText, { color: theme.rose[600] }]}>초기화</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isWon} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={[styles.modalIcon, { backgroundColor: theme.indigo[100] }]}>
              <CheckSquare size={40} color={theme.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: theme.text }]}>퍼즐 완료!</Text>
            <Text style={[styles.modalDesc, { color: theme.subText }]}>축하합니다.{'\n'}새로운 컬렉션이 등록되었습니다.</Text>
            
            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtnSecondary, { backgroundColor: theme.background }]}
                onPress={() => navigation.navigate('Collection')}
              >
                <Text style={[styles.modalBtnSecondaryText, { color: theme.text }]}>컬렉션 보기</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtnPrimary, { backgroundColor: theme.primary }]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.modalBtnPrimaryText}>목록으로</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  boardScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
    justifyContent: 'center',
  },
  footerBtn: {
    flex: 1,
    maxWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 4,
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
    marginVertical: 8,
  },
  footerBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  hintIconContainer: {
    position: 'relative',
  },
  hintBadge: {
    position: 'absolute',
    top: -8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 32,
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalBtnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnSecondaryText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalBtnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
