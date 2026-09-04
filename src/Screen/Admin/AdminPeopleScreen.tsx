

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { registrationApi, type RegistrationEntry } from '../../services/api';
import AdminBottomNav from './AdminBottomNav';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

const AVATAR_COLORS = ['#7C3AED', '#00A878', '#E98200', '#8B55ED', '#E51D47', '#0B98B5'];

// Alert.alert is a no-op on react-native-web, so route through browser dialogs there.
function notify(title: string, message: string) {
  if (Platform.OS === 'web') {
    (globalThis as any).alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function submittedLabel(createdAt?: string) {
  if (!createdAt) return '';
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return '';
  const hours = Math.floor((Date.now() - created.getTime()) / 3600000);
  if (hours < 1) return 'Submitted just now';
  if (hours < 24) return `Submitted ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `Submitted ${days} day${days === 1 ? '' : 's'} ago`;
}

function WatchlistCard({
  entry,
  color,
  onReview,
  busy,
}: {
  entry: RegistrationEntry;
  color: string;
  onReview: (status: 'approved' | 'rejected') => void;
  busy: boolean;
}) {
  const name = entry.user?.name || 'Attendee';
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const roleLine = [entry.user?.designation, entry.user?.company_name].filter(Boolean).join(' · ');

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.personInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            <Text
              style={[
                styles.statusBadge,
                entry.approval_status === 'pending' && styles.pending,
                entry.approval_status === 'approved' && styles.approved,
                entry.approval_status === 'rejected' && styles.rejected,
              ]}
            >
              {entry.approval_status}
            </Text>
          </View>
          {roleLine ? <Text style={styles.role}>{roleLine}</Text> : null}
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.detail}>✉ {entry.user?.email || '-'}</Text>
      <Text style={styles.detail}># {entry.ticket_reference || '-'}</Text>
      <Text style={styles.detail}>▣ {entry.conference?.title || '-'}</Text>
      {entry.user?.phone ? <Text style={styles.detail}>⌕ {entry.user.phone}</Text> : null}
      {entry.user?.linkedin_url ? (
        <Pressable onPress={() => Linking.openURL(entry.user.linkedin_url as string)}>
          <Text style={styles.link}>♧ LinkedIn Profile ↗</Text>
        </Pressable>
      ) : null}
      <Text style={styles.submitted}>{submittedLabel(entry.created_at)}</Text>
      <View style={styles.actionRow}>
        {entry.approval_status !== 'approved' ? (
          <Pressable
            accessibilityLabel={`Approve ${name}`}
            accessibilityRole="button"
            disabled={busy}
            onPress={() => onReview('approved')}
            style={[styles.approve, busy && styles.busy]}
          >
            <Text style={styles.actionText}>{busy ? '...' : '✓ Approve'}</Text>
          </Pressable>
        ) : null}
        {entry.approval_status !== 'rejected' ? (
          <Pressable
            accessibilityLabel={`Reject ${name}`}
            accessibilityRole="button"
            disabled={busy}
            onPress={() => onReview('rejected')}
            style={[styles.reject, busy && styles.busy]}
          >
            <Text style={styles.actionText}>{busy ? '...' : '✕ Reject'}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function AdminPeopleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [entries, setEntries] = useState<RegistrationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [activeFilter, setActiveFilter] = useState<ReviewStatus>('pending');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await registrationApi.list(user.token);
      setEntries(res.data || []);
      setListError('');
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = entries.reduce<Record<ReviewStatus, number>>(
    (result, entry) => {
      const key = (entry.approval_status || 'pending') as ReviewStatus;
      result[key] = (result[key] || 0) + 1;
      return result;
    },
    { pending: 0, approved: 0, rejected: 0 },
  );

  const visibleEntries = entries.filter((entry) => entry.approval_status === activeFilter);

  const review = async (entry: RegistrationEntry, status: 'approved' | 'rejected') => {
    if (!user?.token) return;
    setBusyId(entry.id);
    try {
      await registrationApi.updateApproval(user.token, entry.id, status);
      setEntries((current) =>
        current.map((item) => (item.id === entry.id ? { ...item, approval_status: status } : item)),
      );
      notify(
        status === 'approved' ? 'Approved' : 'Rejected',
        status === 'approved'
          ? `${entry.user?.name || 'User'} can now log in to the app.`
          : `${entry.user?.name || 'User'} has been rejected and cannot log in.`,
      );
    } catch (e) {
      notify('Error', e instanceof Error ? e.message : 'Failed to update registration.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={() => router.replace('/admin-dashboard')}
            hitSlop={10}
            style={styles.backButton}
          >
            <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} size={19} tintColor="#253046" />
          </Pressable>
          <Text style={styles.headerTitle}>Watchlist</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor="#7C3AED" colors={["#7C3AED"]} />}
        >
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Watchlist</Text>
              <Text style={styles.subtitle}>
                {entries.length} total entr{entries.length === 1 ? 'y' : 'ies'}
              </Text>
            </View>
          </View>
          <View style={styles.filterRow}>
            {(['pending', 'approved', 'rejected'] as ReviewStatus[]).map((filter) => (
              <Pressable
                key={filter}
                accessibilityRole="button"
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterButton, activeFilter === filter && styles.activeFilter]}
              >
                <Text style={[styles.filter, activeFilter === filter && styles.activeFilterText]}>
                  {filter[0].toUpperCase() + filter.slice(1)} ({counts[filter]})
                </Text>
              </Pressable>
            ))}
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Loading registrations...</Text>
            </View>
          ) : null}
          {listError ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: '#D92D3A' }]}>{listError}</Text>
            </View>
          ) : null}

          {visibleEntries.map((entry, index) => (
            <WatchlistCard
              key={entry.id}
              entry={entry}
              color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
              busy={busyId === entry.id}
              onReview={(status) => review(entry, status)}
            />
          ))}
          {!loading && !listError && visibleEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No {activeFilter} entries.</Text>
            </View>
          ) : null}
        </ScrollView>
        <AdminBottomNav active="people" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' },
  backButton: { width: 44, alignItems: 'center', justifyContent: 'center' },
  headerSpacer: { width: 44 },
  content: { padding: 12, paddingBottom: 72 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 23, fontWeight: '800', color: '#1D2639' },
  subtitle: { fontSize: 10, color: '#718098', marginTop: 3 },
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
  busy: { opacity: 0.6 },
  actionText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  emptyState: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { fontSize: 11, color: '#718098' },
});
