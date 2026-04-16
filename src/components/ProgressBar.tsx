import { View, StyleSheet } from 'react-native';

type Props = {
  value: number; // 0–100
};

function getColor(value: number): string {
  if (value >= 70) return '#22c55e';
  if (value >= 40) return '#f59e0b';
  return '#ef4444';
}

export default function ProgressBar({ value }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  const color = getColor(clamped);

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    backgroundColor: '#334155',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
