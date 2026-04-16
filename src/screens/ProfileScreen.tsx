import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Athlete,
  DiscoverStackParamList,
  FootballStats,
  BasketballStats,
  AthleticsStats,
  Sport,
} from '../types';
import athletesData from '../data/athletes.json';
import ProgressBar from '../components/ProgressBar';
import { useShortlist } from '../hooks/useShortlist';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'Profile'>;

const athletes = athletesData as Athlete[];

const SPORT_COLORS: Record<Sport, string> = {
  Football: '#3b82f6',
  Basketball: '#f97316',
  Athletics: '#a855f7',
};

function getStatEntries(athlete: Athlete): Array<{ label: string; value: number }> {
  const { sport, stats } = athlete;
  if (sport === 'Football') {
    const s = stats as FootballStats;
    return [
      { label: 'Pace', value: s.pace },
      { label: 'Shooting', value: s.shooting },
      { label: 'Passing', value: s.passing },
      { label: 'Dribbling', value: s.dribbling },
      { label: 'Defending', value: s.defending },
      { label: 'Physical', value: s.physical },
    ];
  }
  if (sport === 'Basketball') {
    const s = stats as BasketballStats;
    return [
      { label: '3-Point', value: s.threePoint },
      { label: 'Mid Range', value: s.midRange },
      { label: 'Ball Handling', value: s.ballHandling },
      { label: 'Defense', value: s.defense },
      { label: 'Rebounding', value: s.rebounding },
      { label: 'Athleticism', value: s.athleticism },
    ];
  }
  const s = stats as AthleticsStats;
  return [
    { label: 'Speed', value: s.speed },
    { label: 'Stamina', value: s.stamina },
    { label: 'Strength', value: s.strength },
    { label: 'Agility', value: s.agility },
    { label: 'Technique', value: s.technique },
    { label: 'Consistency', value: s.consistency },
  ];
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarTrack}>
        <View style={[styles.statBarFill, { width: `${value}%` }]} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen({ route }: Props) {
  const { athleteId } = route.params;
  const athlete = athletes.find(a => a.id === athleteId);
  const { isShortlisted, toggleShortlist } = useShortlist();

  if (!athlete) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Athlete not found.</Text>
      </View>
    );
  }

  const shortlisted = isShortlisted(athlete.id);
  const sportColor = SPORT_COLORS[athlete.sport];
  const statEntries = getStatEntries(athlete);
  const initials = athlete.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: sportColor + '22' }]}>
          <Text style={[styles.initials, { color: sportColor }]}>{initials}</Text>
        </View>
        <Text style={styles.name}>{athlete.name}</Text>
        <View style={[styles.sportBadge, { backgroundColor: sportColor + '22', borderColor: sportColor }]}>
          <Text style={[styles.sportText, { color: sportColor }]}>{athlete.sport}</Text>
        </View>
        <Text style={styles.meta}>
          {athlete.position} · Age {athlete.age} · {athlete.nationality}
        </Text>
      </View>

      {/* Readiness Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Readiness Score</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreNumber}>{athlete.score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <ProgressBar value={athlete.score} />
      </View>

      {/* Performance Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Stats</Text>
        {statEntries.map(({ label, value }) => (
          <StatRow key={label} label={label} value={value} />
        ))}
      </View>

      {/* Shortlist Button */}
      <TouchableOpacity
        style={[styles.shortlistBtn, shortlisted && styles.shortlistBtnActive]}
        onPress={() => toggleShortlist(athlete.id)}
        activeOpacity={0.8}
      >
        <Text style={[styles.shortlistBtnText, shortlisted && styles.shortlistBtnTextActive]}>
          {shortlisted ? '★  Remove from Shortlist' : '☆  Add to Shortlist'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  errorText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  initials: {
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  sportBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  sportText: {
    fontSize: 13,
    fontWeight: '600',
  },
  meta: {
    color: '#94a3b8',
    fontSize: 13,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  scoreNumber: {
    color: '#f8fafc',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 52,
  },
  scoreMax: {
    color: '#64748b',
    fontSize: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 13,
    width: 100,
  },
  statBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '600',
    width: 28,
    textAlign: 'right',
  },
  shortlistBtn: {
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  shortlistBtnActive: {
    backgroundColor: '#10b981',
  },
  shortlistBtnText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '700',
  },
  shortlistBtnTextActive: {
    color: '#fff',
  },
});
