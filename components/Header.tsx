import { Settings } from 'lucide-react-native';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSegments } from 'expo-router';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const segments = useSegments() as string[];
  const isSettingsPage = segments.includes('settings');
  return (
    <View style={styles.container}>
      <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {!isSettingsPage && <Settings size={30} onPress={() => router.push('/settings')}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },
});