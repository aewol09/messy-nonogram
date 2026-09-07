import React, { useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, useWindowDimensions } from 'react-native';
import { getRowHints, getColHints } from '../utils/nonogram';
import { getTheme } from '../styles/theme';
import { useGameStore } from '../store/useGameStore';

interface NonogramBoardProps {
  width: number;
  height: number;
  solution: number[][];
  colorSolution?: string[][];
  board: number[][];
  onCellInteract: (r: number, c: number, type: 'start' | 'move' | 'end') => void;
  maxAvailableWidth?: number;
  maxAvailableHeight?: number;
  isWon?: boolean;
  isAnimatingWin?: boolean;
  revealProgress?: number;
}

export default function NonogramBoard({
  width,
  height,
  solution,
  colorSolution,
  board,
  onCellInteract,
  maxAvailableWidth,
  maxAvailableHeight,
  isWon = false,
  isAnimatingWin = false,
  revealProgress = 0,
}: NonogramBoardProps) {
  const { settings } = useGameStore();
  const theme = getTheme(settings.darkMode);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const availWidth = maxAvailableWidth || (windowWidth - 32);
  const availHeight = maxAvailableHeight || (windowHeight - 200);

  const onInteractRef = useRef(onCellInteract);
  useEffect(() => {
    onInteractRef.current = onCellInteract;
  }, [onCellInteract]);

  const rowHints = useMemo(() => getRowHints(solution), [solution]);
  const colHints = useMemo(() => getColHints(solution), [solution]);

  const maxRowHints = Math.max(...rowHints.map((h) => h.length), 1);
  const maxColHints = Math.max(...colHints.map((h) => h.length), 1);

  const cellSize = useMemo(() => {
    const hintFactor = 0.65;
    const horizontalFactor = maxRowHints * hintFactor + width;
    const verticalFactor = maxColHints * hintFactor + height;

    const maxCellW = Math.floor((availWidth - 30) / horizontalFactor);
    const maxCellH = Math.floor((availHeight - 30) / verticalFactor);

    const calculated = Math.min(maxCellW, maxCellH);
    return Math.max(11, Math.min(38, calculated));
  }, [width, height, maxRowHints, maxColHints, availWidth, availHeight]);

  const rowHintWidth = Math.round(maxRowHints * (cellSize * 0.65) + 4);
  const colHintHeight = Math.round(maxColHints * (cellSize * 0.65) + 4);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isWon && !isAnimatingWin,
      onMoveShouldSetPanResponder: () => !isWon && !isAnimatingWin,
      onPanResponderGrant: (evt) => {
        if (isWon || isAnimatingWin) return;
        const { locationX, locationY } = evt.nativeEvent;
        const r = Math.floor(locationY / cellSize);
        const c = Math.floor(locationX / cellSize);
        if (r >= 0 && r < height && c >= 0 && c < width) {
          onInteractRef.current(r, c, 'start');
        }
      },
      onPanResponderMove: (evt) => {
        if (isWon || isAnimatingWin) return;
        const { locationX, locationY } = evt.nativeEvent;
        const r = Math.floor(locationY / cellSize);
        const c = Math.floor(locationX / cellSize);
        if (r >= 0 && r < height && c >= 0 && c < width) {
          onInteractRef.current(r, c, 'move');
        }
      },
      onPanResponderRelease: () => {
        if (isWon || isAnimatingWin) return;
        onInteractRef.current(-1, -1, 'end');
      },
      onPanResponderTerminate: () => {
        if (isWon || isAnimatingWin) return;
        onInteractRef.current(-1, -1, 'end');
      },
    })
  ).current;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.row}>
        {/* Top-Left Empty Corner */}
        <View
          style={[
            styles.emptySpace,
            {
              width: rowHintWidth,
              height: colHintHeight,
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        />

        {/* Top Column Hints */}
        <View
          style={[
            styles.colHintsContainer,
            {
              borderBottomColor: theme.subText,
              backgroundColor: theme.background,
            },
          ]}
        >
          {colHints.map((hints, c) => {
            const isThickRight = (c + 1) % 5 === 0 && c + 1 !== width;
            return (
              <View
                key={`col-hint-${c}`}
                style={[
                  styles.colHintColumn,
                  {
                    width: cellSize,
                    height: colHintHeight,
                    borderRightColor: isThickRight ? theme.subText : theme.border,
                    borderRightWidth: isThickRight ? 2 : 1,
                  },
                ]}
              >
                {hints.map((hint, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.hintText,
                      {
                        color: theme.text,
                        fontSize: Math.max(9, Math.floor(cellSize * 0.42)),
                      },
                    ]}
                  >
                    {hint}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.row}>
        {/* Left Row Hints */}
        <View
          style={[
            styles.rowHintsContainer,
            {
              borderRightColor: theme.subText,
              backgroundColor: theme.background,
            },
          ]}
        >
          {rowHints.map((hints, r) => {
            const isThickBottom = (r + 1) % 5 === 0 && r + 1 !== height;
            return (
              <View
                key={`row-hint-${r}`}
                style={[
                  styles.rowHintRow,
                  {
                    height: cellSize,
                    width: rowHintWidth,
                    borderBottomColor: isThickBottom ? theme.subText : theme.border,
                    borderBottomWidth: isThickBottom ? 2 : 1,
                  },
                ]}
              >
                {hints.map((hint, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.hintText,
                      styles.hintTextRow,
                      {
                        color: theme.text,
                        fontSize: Math.max(9, Math.floor(cellSize * 0.42)),
                      },
                    ]}
                  >
                    {hint}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>

        {/* Board Grid */}
        <View
          style={[styles.boardGrid, { borderColor: theme.subText }]}
          {...panResponder.panHandlers}
        >
          {board.map((row, r) => (
            <View key={`row-${r}`} style={styles.gridRow}>
              {row.map((cell, c) => {
                const isBorderBottom = (r + 1) % 5 === 0 && r + 1 !== height;
                const isBorderRight = (c + 1) % 5 === 0 && c + 1 !== width;

                let cellBg = theme.card;
                if (cell === 1) {
                  const hex = colorSolution && colorSolution[r] && colorSolution[r][c];
                  if (hex && hex !== '0' && hex !== '') {
                    if (isWon) {
                      cellBg = hex;
                    } else if (isAnimatingWin && revealProgress !== undefined) {
                      const maxDist = Math.max(1, height - 1 + width - 1);
                      const normPos = (r + c) / maxDist;
                      if (normPos <= revealProgress) {
                        cellBg = hex;
                      } else {
                        cellBg = theme.primary;
                      }
                    } else {
                      cellBg = theme.primary;
                    }
                  } else {
                    cellBg = theme.primary;
                  }
                } else if (cell === 2) {
                  cellBg = theme.background;
                }

                const cellStyle: any[] = [
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    borderColor: theme.border,
                    backgroundColor: cellBg,
                  },
                ];

                if (isBorderBottom) {
                  cellStyle.push({ borderBottomWidth: 2, borderBottomColor: theme.subText });
                }
                if (isBorderRight) {
                  cellStyle.push({ borderRightWidth: 2, borderRightColor: theme.subText });
                }

                return (
                  <View key={`cell-${r}-${c}`} style={cellStyle} pointerEvents="none">
                    {cell === 2 && !isWon && !isAnimatingWin && (
                      <Text
                        style={[
                          styles.xText,
                          {
                            color: theme.rose ? theme.rose[600] : '#E11D48',
                            fontSize: Math.max(10, Math.floor(cellSize * 0.55)),
                          },
                        ]}
                      >
                        ✕
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  row: {
    flexDirection: 'row',
  },
  emptySpace: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  colHintsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
  },
  colHintColumn: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 2,
    borderRightWidth: 1,
  },
  rowHintsContainer: {
    borderRightWidth: 2,
  },
  rowHintRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 4,
    borderBottomWidth: 1,
    gap: 2,
  },
  hintText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintTextRow: {
    marginHorizontal: 1,
  },
  boardGrid: {
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xText: {
    fontWeight: '900',
  },
});
