import { useState, useRef } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Athlete, DiscoverStackParamList, Sport } from '../types';
import athletesData from '../data/athletes.json';
import AthleteCard from '../components/AthleteCard';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<DiscoverStackParamList, 'DiscoverFeed'>;

const SPORTS: Array<'All' | Sport> = ['All', 'Football', 'Basketball', 'Athletics'];
const athletes = athletesData as Athlete[];

export default function DiscoverScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | Sport>('All');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(text.trim()), 300);
  };

  const filtered = athletes.filter(a => {
    const matchesSport = activeFilter === 'All' || a.sport === activeFilter;
    const matchesSearch =
      debouncedQuery === '' ||
      a.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const emptyMessage =
    activeFilter !== 'All'
      ? `No ${activeFilter} players match your search`
      : 'No athletes match your search';

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search athletes..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filterRow}>
        {SPORTS.map(sport => (
          <TouchableOpacity
            key={sport}
            style={[styles.chip, activeFilter === sport && styles.chipActive]}
            onPress={() => setActiveFilter(sport)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, activeFilter === sport && styles.chipTextActive]}>
              {sport}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.resultCount}>
        {filtered.length} athlete{filtered.length !== 1 ? 's' : ''} found
      </Text>

      {filtered.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <EmptyState
            message={emptyMessage}
            hint="Try a different name or switch the sport filter above."
          />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AthleteCard
              athlete={item}
              onPress={() => navigation.navigate('Profile', { athleteId: item.id })}
            />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  resultCount: {
    color: '#64748b',
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  emptyWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
