import { View, Text, StyleSheet } from 'react-native';

type Props = {
  message: string;
  hint?: string;
  icon?: string;
};

export default function EmptyState({ message, hint, icon = '🔍' }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 32,
  },
  message: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  hint: {
    color: '#475569',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
