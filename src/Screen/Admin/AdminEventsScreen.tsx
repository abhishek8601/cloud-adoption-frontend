import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminBottomNav from './AdminBottomNav';

type ConferenceCardProps = {
  active: boolean;
  title: string;
  date: string;
  location: string;
  attendeeCount: number;
  sessionCount: number;
};

function ConferenceCard({
  active,
  title,
  date,
  location,
  attendeeCount,
  sessionCount,
}: ConferenceCardProps) {
  const accentColor = active ? '#00A878' : '#718098';

  return (
    <View style={[styles.card, { borderTopColor: accentColor }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.statusPill, { backgroundColor: accentColor }]}>
          {active ? 'Active' : 'Inactive'}
        </Text>
        <View style={styles.cardActions}>
          <Pressable
            accessibilityLabel={`Edit ${title}`}
            style={styles.iconAction}
          >
            <SymbolView
              name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
              size={14}
              tintColor="#7C3AED"
            />
          </Pressable>
          <Pressable
            accessibilityLabel={`Delete ${title}`}
            style={styles.deleteAction}
          >
            <SymbolView
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              size={14}
              tintColor="#F05262"
            />
          </Pressable>
        </View>
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.detailRow}>
        <SymbolView
          name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
          size={11}
          tintColor="#65758C"
        />
        <Text style={styles.detailText}>{date}</Text>
      </View>
      <View style={styles.detailRow}>
        <SymbolView
          name={{
            ios: 'mappin.and.ellipse',
            android: 'location_on',
            web: 'location_on',
          }}
          size={11}
          tintColor="#65758C"
        />
        <Text style={styles.detailText}>{location}</Text>
      </View>

      <View style={styles.divider} />
      <View style={styles.stats}>
        <Text style={styles.statValue}>
          {attendeeCount} <Text style={styles.statLabel}>Attendees</Text>
        </Text>
        <Text style={styles.statValue}>
          {sessionCount} <Text style={styles.statLabel}>Sessions</Text>
        </Text>
      </View>
    </View>
  );
}

export default function AdminEventsScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Conferences</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Conferences</Text>
              <Text style={styles.subtitle}>2 conferences</Text>
            </View>
            <View style={styles.topActions}>
              <Pressable style={styles.agendaButton}>
                <Text style={styles.agendaText}>▦ Agenda</Text>
              </Pressable>
              <Pressable style={styles.newButton}>
                <Text style={styles.newText}>＋ New</Text>
              </Pressable>
            </View>
          </View>

          <ConferenceCard
            active
            attendeeCount={247}
            date="Sep 15–17, 2025"
            location="Hyatt Regency San Francisco · San Francisco, CA"
            sessionCount={12}
            title="Cloud Adoption Summit 2025"
          />
          <ConferenceCard
            active={false}
            attendeeCount={0}
            date="Dec 1–3, 2025"
            location="Venetian Expo · Las Vegas, NV"
            sessionCount={0}
            title="AWS re:Invent Partner Day 2025"
          />
        </View>

        <AdminBottomNav active="events" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  safeArea: { flex: 1 },
  header: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E8EF',
  },
  headerTitle: { color: '#1E273B', fontSize: 13, fontWeight: '800' },
  content: { flex: 1, padding: 12 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { color: '#1D2639', fontSize: 23, fontWeight: '800' },
  subtitle: { color: '#718098', fontSize: 10, marginTop: 3 },
  topActions: { flexDirection: 'row', gap: 7 },
  agendaButton: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F0E9FF',
  },
  agendaText: { color: '#7040DF', fontSize: 10, fontWeight: '700' },
  newButton: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#6D2DE6',
  },
  newText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  card: {
    marginBottom: 11,
    borderTopWidth: 4,
    borderRadius: 12,
    padding: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#34425D',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  cardActions: { flexDirection: 'row', gap: 7 },
  iconAction: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#F0E9FF',
  },
  deleteAction: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#FFF0F1',
  },
  cardTitle: { color: '#202B40', fontSize: 11, fontWeight: '800', marginTop: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 },
  detailText: { color: '#65758C', fontSize: 9 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 9,
    backgroundColor: '#E5E9F0',
  },
  stats: { flexDirection: 'row', gap: 18 },
  statValue: { color: '#1F2A40', fontSize: 17, fontWeight: '800' },
  statLabel: { color: '#65758C', fontSize: 8, fontWeight: '400' },
  tabBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#000000',
  },
  tab: { paddingHorizontal: 7, paddingVertical: 7 },
  activeTab: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#7C3AED',
  },
  tabText: { color: '#FFFFFF', fontSize: 9 },
  activeTabText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
});
