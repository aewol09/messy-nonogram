import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, useWindowDimensions } from 'react-native';
import { getRowHints, getColHints } from '../utils/nonogram';
import { getTheme } from '../styles/theme';
import { useGameStore } from '../store/useGameStore';

interface NonogramBoardProps {
  width: number;
  height: number;
  solution: number[][];
  board: number[][];
  onCellInteract: (r: number, c: number, type: 'start' | 'move' | 'end') => void;
}

export default function NonogramBoard({ width, height, solution, board, onCellInteract }: NonogramBoardProps) {
  const { settings } = useGameStore();
  const theme = getTheme(settings.darkMode);
  const { width: screenWidth } = useWindowDimensions();
  
  // Use a ref to keep track of the latest onCellInteract to avoid stale closures in PanResponder
  const onInteractRef = useRef(onCellInteract);
  useEffect(() => {
    onInteractRef.current = onCellInteract;
  }, [onCellInteract]);

  const rowHints = useMemo(() => getRowHints(solution), [solution]);
  const colHints = useMemo(() => getColHints(solution), [solution]);

  const maxRowHints = Math.max(...rowHints.map(h => h.length), 1);
  const maxColHints = Math.max(...colHints.map(h => h.length), 1);

  // Dynamically calculate cell size based on width and hints
  const cellSize = useMemo(() => {
    const availableWidth = Math.max(screenWidth - 64, 200); // Ensure at least 200px available width
    const horizontalCells = width + maxRowHints * 0.6; 
    return Math.max(Math.min(Math.floor(availableWidth / horizontalCells), 35), 10); // Min cell size 10
  }, [width, maxRowHints, screenWidth]);

  const hintSize = cellSize * 0.7;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const r = Math.floor(locationY / cellSize);
        const c = Math.floor(locationX / cellSize);
        if (r >= 0 && r < height && c >= 0 && c < width) {
          onInteractRef.current(r, c, 'start');
        }
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const r = Math.floor(locationY / cellSize);
        const c = Math.floor(locationX / cellSize);
        if (r >= 0 && r < height && c >= 0 && c < width) {
          onInteractRef.current(r, c, 'move');
        }
      },
      onPanResponderRelease: () => {
        onInteractRef.current(-1, -1, 'end');
      },
      onPanResponderTerminate: () => {
        onInteractRef.current(-1, -1, 'end');
      }
    })
  ).current;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.row}>
        {/* Top-Left Empty Space */}
        <View 
          style={[
            styles.emptySpace, 
            { 
              width: maxRowHints * (cellSize * 0.6) + 8, 
              height: maxColHints * hintSize + 8, 
              backgroundColor: theme.background, 
              borderColor: theme.border 
            }
          ]} 
        />
        
        {/* Top Column Hints */}
        <View style={[styles.colHintsContainer, { borderBottomColor: theme.border, backgroundColor: theme.background }]}>
          {colHints.map((hints, c) => (
            <View 
              key={`col-hint-${c}`} 
              style={[
                styles.colHintColumn, 
                { 
                  width: cellSize,
                  height: maxColHints * hintSize + 8, 
                  borderRightColor: theme.border 
                }
              ]}
            >
              {hints.map((hint, i) => (
                <Text key={i} style={[styles.hintText, { color: theme.text, fontSize: cellSize * 0.4 }]}>{hint}</Text>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        {/* Left Row Hints */}
        <View style={[styles.rowHintsContainer, { borderRightColor: theme.border, backgroundColor: theme.background }]}>
          {rowHints.map((hints, r) => (
            <View 
              key={`row-hint-${r}`} 
              style={[
                styles.rowHintRow, 
                { 
                  height: cellSize,
                  width: maxRowHints * (cellSize * 0.6) + 8, 
                  borderBottomColor: theme.border 
                }
              ]}
            >
              {hints.map((hint, i) => (
                <Text key={i} style={[styles.hintText, styles.hintTextRow, { color: theme.text, fontSize: cellSize * 0.4 }]}>{hint}</Text>
              ))}
            </View>
          ))}
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
                
                let cellStyle: any[] = [
                  styles.cell, 
                  { 
                    width: cellSize, 
                    height: cellSize,
                    borderColor: theme.border, 
                    backgroundColor: theme.card 
                  }
                ];
                
                if (isBorderBottom) cellStyle.push([styles.cellBorderBottomThick, { borderBottomColor: theme.subText }]);
                if (isBorderRight) cellStyle.push([styles.cellBorderRightThick, { borderRightColor: theme.subText }]);

                if (cell === 1) cellStyle.push({ backgroundColor: theme.text });
                else if (cell === 2) cellStyle.push({ backgroundColor: theme.background });

                return (
                  <View key={`cell-${r}-${c}`} style={cellStyle} pointerEvents="none">
                    {cell === 2 && <Text style={[styles.xText, { color: theme.subText, fontSize: cellSize * 0.5 }]}>✕</Text>}
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'center',
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
    paddingBottom: 4,
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
  },
  hintText: {
    fontWeight: 'bold',
  },
  hintTextRow: {
    marginLeft: 2,
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
  cellBorderBottomThick: {
    borderBottomWidth: 2,
  },
  cellBorderRightThick: {
    borderRightWidth: 2,
  },
  xText: {
    fontWeight: 'bold',
  },
});
