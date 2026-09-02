import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

interface PixelArtPreviewProps {
  solution: number[][];
  size?: number;
  primaryColor?: string;
  backgroundColor?: string;
  gridBorder?: boolean;
}

export default function PixelArtPreview({
  solution,
  size = 160,
  primaryColor = colors.primary,
  backgroundColor = 'transparent',
  gridBorder = false,
}: PixelArtPreviewProps) {
  if (!solution || solution.length === 0) return null;

  const rows = solution.length;
  const cols = solution[0].length;
  const cellSize = size / Math.max(rows, cols);

  return (
    <View
      style={[
        styles.container,
        {
          width: cols * cellSize,
          height: rows * cellSize,
          backgroundColor,
        },
      ]}
    >
      {solution.map((row, r) => (
        <View key={`r-${r}`} style={styles.row}>
          {row.map((cell, c) => (
            <View
              key={`c-${r}-${c}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell === 1 ? primaryColor : 'transparent',
                borderWidth: gridBorder ? 0.5 : 0,
                borderColor: gridBorder ? 'rgba(0,0,0,0.05)' : 'transparent',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
});
