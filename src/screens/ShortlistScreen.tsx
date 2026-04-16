import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useShortlist } from '../hooks/useShortlist';
import { Athlete } from '../types';
import athletesData from '../data/athletes.json';
import AthleteCard from '../components/AthleteCard';
import EmptyState from '../components/EmptyState';

const athletes = athletesData as Athlete[];

export default function ShortlistScreen() {
  const { shortlist, removeFromShortlist } = useShortlist();

  const shortlistedAthletes = shortlist
    .map(id => athletes.find(a => a.id === id))
    .filter((a): a is Athlete => a !== undefined)
    .sort((a, b) => b.score - a.score);

  const avgScore =
    shortlistedAthletes.length > 0
      ? Math.round(
          shortlistedAthletes.reduce((sum, a) => sum + a.score, 0) /
            shortlistedAthletes.length,
        )
      : 0;

  return (
    <View style={styles.container}>
      {shortlistedAthletes.length > 0 && (
        <View style={styles.statsHeader}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{shortlistedAthletes.length}</Text>
            <Text style={styles.statLabel}>Athletes</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{avgScore}</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>
      )}

      <FlatList
        data={shortlistedAthletes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AthleteCard
            athlete={item}
            onPress={() => {}}
            onRemove={() => removeFromShortlist(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="⭐"
            message={'No athletes shortlisted yet.\nDiscover athletes and add them here.'}
          />
        }
        contentContainerStyle={
          shortlistedAthletes.length === 0 ? styles.emptyContainer : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
