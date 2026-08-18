import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminBottomNav from './AdminBottomNav';

type Person = {
  initials: string;
  name: string;
  role: string;
  company: string;
  email: string;
  ticket: string;
  phone: string;
  color: string;
  submitted: string;
};

type ReviewStatus = 'pending' | 'approved' | 'rejected';

const pendingPeople: Person[] = [
  {
    initials: 'AJ',
    name: 'Alex Johnson',
    role: 'Senior Cloud Consultant',
    company: 'Accenture',
    email: 'alex.j@accenture.com',
    ticket: 'EB-2025-4821',
    phone: '+1 (617) 555-0142',
    color: '#7C3AED',
    submitted: 'Submitted 2 hours ago',
  },
  {
    initials: 'NS',
    name: 'Nina Shah',
    role: 'Database Cloud Architect',
    company: 'Oracle',
    email: 'nina.shah@oracle.com',
    ticket: 'EB-2025-4822',
    phone: '+1 (650) 555-0196',
    color: '#00A878',
    submitted: 'Submitted 5 hours ago',
  },
  {
    initials: 'CT',
    name: 'Chris Taylor',
    role: 'Cloud Engineer',
    company: 'Capgemini',
    email: 'c.taylor@capgemini.com',
    ticket: 'EB-2025-4823',
    phone: '+1 (214) 555-0177',
    color: '#E98200',
    submitted: 'Submitted 1 day ago',
  },
];

const initialStatuses: Record<string, ReviewStatus> = {
  'EB-2025-4821': 'pending',
  'EB-2025-4822': 'pending',
  'EB-2025-4823': 'pending',
};

function WatchlistCard({ person, status, onReview }: { person: Person; status: ReviewStatus; onReview: (status: ReviewStatus) => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: person.color }]}>
          <Text style={styles.avatarText}>{person.initials}</Text>
        </View>
        <View style={styles.personInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{person.name}</Text>
            <Text style={[styles.statusBadge, status === 'pending' && styles.pending, status === 'approved' && styles.approved, status === 'rejected' && styles.rejected]}>{status}</Text>
          </View>
          <Text style={styles.role}>{person.role} · {person.company}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.detail}>✉ {person.email}</Text>
      <Text style={styles.detail}># {person.ticket}</Text>
      <Text style={styles.detail}>▣ Cloud Adoption Summit 2025</Text>
      <Text style={styles.detail}>⌕ {person.phone}</Text>
      <Text style={styles.link}>♧ LinkedIn Profile ↗</Text>
      <Text style={styles.submitted}>{person.submitted}</Text>
      <View style={styles.actionRow}>
        <Pressable accessibilityLabel={`Approve ${person.name}`} accessibilityRole="button" onPress={() => onReview('approved')} style={styles.approve}>
          <Text style={styles.actionText}>♧ Approve</Text>
        </Pressable>
        <Pressable accessibilityLabel={`Reject ${person.name}`} accessibilityRole="button" onPress={() => onReview('rejected')} style={styles.reject}>
          <Text style={styles.actionText}>♧ Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AdminPeopleScreen() {
  const router = useRouter();
  const [statuses, setStatuses] = useState(initialStatuses);
  const [activeFilter, setActiveFilter] = useState<ReviewStatus>('pending');
  const counts = (Object.values(statuses) as ReviewStatus[]).reduce<Record<ReviewStatus, number>>((result, status) => ({ ...result, [status]: result[status] + 1 }), { pending: 0, approved: 0, rejected: 0 });
  const visiblePeople = pendingPeople.filter((person) => statuses[person.ticket] === activeFilter);

  const reviewPerson = (ticket: string, status: ReviewStatus) => {
    setStatuses((current) => ({ ...current, [ticket]: status }));
    setActiveFilter(status);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Watchlist</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Watchlist</Text>
              <Text style={styles.subtitle}>6 total entries</Text>
            </View>
            <Pressable accessibilityLabel="View all people" accessibilityRole="button" onPress={() => router.push('/admin-all-people')} style={styles.allPeople}>
              <SymbolView
                name={{ ios: 'person.2', android: 'group', web: 'group' }}
                size={14}
                tintColor="#7C3AED"
              />
              <Text style={styles.allPeopleText}>All People</Text>
            </Pressable>
          </View>
          <View style={styles.filterRow}>
            {(['pending', 'approved', 'rejected'] as ReviewStatus[]).map((filter) => <Pressable key={filter} accessibilityRole="button" onPress={() => setActiveFilter(filter)} style={[styles.filterButton, activeFilter === filter && styles.activeFilter]}><Text style={[styles.filter, activeFilter === filter && styles.activeFilterText]}>{filter[0].toUpperCase() + filter.slice(1)} ({counts[filter]})</Text></Pressable>)}
          </View>
          {visiblePeople.map((person) => (
            <WatchlistCard key={person.ticket} person={person} status={statuses[person.ticket]} onReview={(status) => reviewPerson(person.ticket, status)} />
          ))}
          {visiblePeople.length === 0 ? <View style={styles.emptyState}><Text style={styles.emptyText}>No {activeFilter} entries.</Text></View> : null}
        </ScrollView>
        <AdminBottomNav active="people" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' },
  content: { padding: 12, paddingBottom: 72 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 23, fontWeight: '800', color: '#1D2639' },
  subtitle: { fontSize: 10, color: '#718098', marginTop: 3 },
  allPeople: { flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: '#F0E9FF', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 16 },
  allPeopleText: { fontSize: 10, fontWeight: '700', color: '#7C3AED' },
  filterRow: { height: 31, marginTop: 10, marginBottom: 10, padding: 3, borderRadius: 8, backgroundColor: '#E9EDF3', flexDirection: 'row', justifyContent: 'space-between' },
  filterButton: { flex: 1, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  activeFilter: { backgroundColor: '#FFF' },
  activeFilterText: { color: '#253046', fontWeight: '800' },
  filter: { fontSize: 9, color: '#60718A' },
  card: { marginBottom: 11, borderRadius: 13, padding: 12, backgroundColor: '#FFF', shadowColor: '#34425D', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { height: 34, width: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  personInfo: { marginLeft: 9, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { fontSize: 11, fontWeight: '800', color: '#253046' },
  statusBadge: { fontSize: 8, textTransform: 'capitalize', fontWeight: '800', color: '#FFF', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 7, overflow: 'hidden' },
  pending: { backgroundColor: '#E98200' },
  approved: { backgroundColor: '#00A878' },
  rejected: { backgroundColor: '#E92A2A' },
  role: { fontSize: 9, color: '#65758C', marginTop: 3 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E9F0', marginVertical: 10 },
  detail: { fontSize: 9, color: '#44536A', marginBottom: 6 },
  link: { fontSize: 9, color: '#7140E5', marginBottom: 8 },
  submitted: { fontSize: 8, color: '#708098' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  approve: { flex: 1, height: 30, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00A878' },
  reject: { flex: 1, height: 30, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E92A2A' },
  actionText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  emptyState: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { fontSize: 11, color: '#718098' },
  tabBar: { height: 62, backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  tabText: { color: '#FFF', fontSize: 9 },
  activeTab: { alignItems: 'center', borderRadius: 17, backgroundColor: '#7C3AED', paddingHorizontal: 10, paddingVertical: 5 },
  activeText: { fontSize: 8, color: '#FFF' },
});
