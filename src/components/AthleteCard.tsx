import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Athlete, Sport } from '../types';

const SPORT_COLORS: Record<Sport, string> = {
  Football: '#3b82f6',
  Basketball: '#f97316',
  Athletics: '#a855f7',
};

type Props = {
  athlete: Athlete;
  onPress: () => void;
  onRemove?: () => void;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export default function AthleteCard({ athlete, onPress, onRemove }: Props) {
  const sportColor = SPORT_COLORS[athlete.sport];
  const scoreColor = getScoreColor(athlete.score);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.avatar, { backgroundColor: sportColor + '33' }]}>
        <Text style={[styles.initials, { color: sportColor }]}>
          {getInitials(athlete.name)}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{athlete.name}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.sportBadge, { backgroundColor: sportColor + '22', borderColor: sportColor }]}>
            <Text style={[styles.sportText, { color: sportColor }]}>{athlete.sport}</Text>
          </View>
          <Text style={styles.meta}>{athlete.position} · {athlete.age}y</Text>
        </View>
      </View>

      <View style={styles.rightSide}>
        {onRemove && (
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={onRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        )}
        <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
          <Text style={[styles.score, { color: scoreColor }]}>{athlete.score}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  sportText: {
    fontSize: 11,
    fontWeight: '600',
  },
  meta: {
    color: '#94a3b8',
    fontSize: 12,
  },
  rightSide: {
    alignItems: 'center',
    gap: 6,
  },
  scoreBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 15,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 2,
  },
  removeText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
});
