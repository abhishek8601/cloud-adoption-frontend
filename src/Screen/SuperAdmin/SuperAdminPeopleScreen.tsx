import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';
import { useAuth } from '../../context/AuthContext';
import { apiRequest, type RegistrationEntry } from '../../services/api';

type Filter = 'pending' | 'approved' | 'rejected';
const colors = ['#7C3AED', '#00A878', '#E98200', '#8B5CF6', '#E52F50'];

function initials(name?: string) { return (name || 'User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }
function relativeDate(value?: string) {
  if (!value) return 'Recently submitted';
  const hours = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 3600000));
  return hours < 1 ? 'Submitted just now' : hours < 24 ? `Submitted ${hours} hour${hours === 1 ? '' : 's'} ago` : `Submitted ${Math.floor(hours / 24)} day${Math.floor(hours / 24) === 1 ? '' : 's'} ago`;
}

export default function SuperAdminPeopleScreen() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<RegistrationEntry[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadRegistrations = useCallback(async () => {
    if (!user?.token) { setRegistrations([]); setError('Please sign in again to view registrations.'); setIsLoading(false); return; }
    setIsLoading(true); setError(null);
    try {
      const endpoint = process.env.EXPO_PUBLIC_ADMIN_REGISTRATIONS_URL || '/admin/registrations';
      const response = await apiRequest<RegistrationEntry[] | { data?: RegistrationEntry[] }>(endpoint, { token: user.token });
      const payload = response.data;
      setRegistrations(Array.isArray(payload) ? payload : payload?.data || []);
    } catch (requestError) {
      setRegistrations([]); setError(requestError instanceof Error ? requestError.message : 'Unable to load registrations.');
    } finally { setIsLoading(false); }
  }, [user?.token]);

  useFocusEffect(useCallback(() => { void loadRegistrations(); }, [loadRegistrations]));

  const updateApproval = async (id: number, approval_status: 'approved' | 'rejected') => {
    if (!user?.token) return;
    setUpdatingId(id);
    try {
      const endpoint = process.env.EXPO_PUBLIC_ADMIN_REGISTRATIONS_URL || '/admin/registrations';
      await apiRequest(`${endpoint}/${id}/approval`, { method: 'PATCH', token: user.token, body: { approval_status } });
      setRegistrations((current) => current.map((entry) => entry.id === id ? { ...entry, approval_status } : entry));
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to update registration.'); }
    finally { setUpdatingId(null); }
  };

  const counts = { pending: registrations.filter((entry) => entry.approval_status === 'pending').length, approved: registrations.filter((entry) => entry.approval_status === 'approved').length, rejected: registrations.filter((entry) => entry.approval_status === 'rejected').length };
  const visible = registrations.filter((entry) => entry.approval_status === filter);

  return <View style={styles.screen}><StatusBar style="dark" /><SafeAreaView style={styles.safe}><View style={styles.header}><Text style={styles.headerTitle}>Watchlist</Text></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.titleRow}><View><Text style={styles.title}>Watchlist</Text><Text style={styles.subtitle}>{registrations.length} total entries</Text></View><Pressable onPress={() => void loadRegistrations()} style={styles.allPeople}><Text style={styles.allPeopleText}>All People</Text></Pressable></View><View style={styles.filters}>{(['pending', 'approved', 'rejected'] as Filter[]).map((status) => <Pressable key={status} onPress={() => setFilter(status)} style={[styles.filter, filter === status && styles.activeFilter]}><Text style={[styles.filterText, filter === status && styles.activeFilterText]}>{`${status[0].toUpperCase()}${status.slice(1)} (${counts[status]})`}</Text></Pressable>)}</View>{isLoading ? <View style={styles.loader}><ActivityIndicator color="#7C3AED" /></View> : error ? <Text style={styles.error}>{error}</Text> : visible.length === 0 ? <Text style={styles.empty}>No {filter} registrations.</Text> : visible.map((entry, index) => <View key={entry.id} style={styles.card}><View style={styles.personHeader}><View style={[styles.avatar, { backgroundColor: colors[index % colors.length] }]}><Text style={styles.avatarText}>{initials(entry.user.name)}</Text></View><View style={styles.personInfo}><View style={styles.nameRow}><Text style={styles.name}>{entry.user.name || 'Unnamed User'}</Text><Text style={[styles.badge, entry.approval_status === 'approved' ? styles.approvedBadge : entry.approval_status === 'rejected' ? styles.rejectedBadge : styles.pendingBadge]}>{entry.approval_status}</Text></View><Text style={styles.role}>{[entry.user.designation, entry.user.company_name].filter(Boolean).join(' · ') || 'Registered attendee'}</Text></View></View><View style={styles.divider} /><Text style={styles.detail}>Email: {entry.user.email || '—'}</Text><Text style={styles.detail}>Ticket: {entry.ticket_reference || '—'}</Text><Text style={styles.detail}>Conference: {entry.conference?.title || '—'}</Text><Text style={styles.detail}>Phone: {entry.user.phone || '—'}</Text>{entry.user.linkedin_url ? <Text style={styles.link}>LinkedIn Profile ↗</Text> : null}<Text style={styles.submitted}>{relativeDate(entry.created_at)}</Text>{entry.approval_status === 'pending' ? <View style={styles.actions}><Pressable disabled={updatingId === entry.id} onPress={() => void updateApproval(entry.id, 'approved')} style={[styles.approve, updatingId === entry.id && styles.disabled]}><Text style={styles.actionText}>Approve</Text></Pressable><Pressable disabled={updatingId === entry.id} onPress={() => void updateApproval(entry.id, 'rejected')} style={[styles.reject, updatingId === entry.id && styles.disabled]}><Text style={styles.actionText}>Reject</Text></Pressable></View> : null}</View>)}</ScrollView><SuperAdminTabBar activeTab="People" /></SafeAreaView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safe: { flex: 1 }, header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' }, headerTitle: { color: '#1D2639', fontSize: 13, fontWeight: '800' }, content: { padding: 12, paddingBottom: 20 }, titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, title: { fontSize: 23, fontWeight: '800', color: '#1D2639' }, subtitle: { marginTop: 3, fontSize: 10, color: '#718098' }, allPeople: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F0E9FF' }, allPeopleText: { fontSize: 9, fontWeight: '700', color: '#7C3AED' }, filters: { marginVertical: 10, padding: 3, borderRadius: 8, backgroundColor: '#E9EDF3', flexDirection: 'row' }, filter: { flex: 1, paddingVertical: 7, borderRadius: 6, alignItems: 'center' }, activeFilter: { backgroundColor: '#FFF' }, filterText: { fontSize: 8, color: '#60718A' }, activeFilterText: { fontWeight: '800', color: '#253046' }, loader: { padding: 35, alignItems: 'center' }, error: { padding: 12, borderRadius: 8, color: '#C62828', backgroundColor: '#FFF0F1', fontSize: 10 }, empty: { padding: 24, borderRadius: 12, color: '#718098', backgroundColor: '#FFF', textAlign: 'center', fontSize: 10 }, card: { marginBottom: 10, padding: 12, borderRadius: 13, backgroundColor: '#FFF', elevation: 2 }, personHeader: { flexDirection: 'row', alignItems: 'center' }, avatar: { width: 38, height: 38, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#FFF', fontSize: 12, fontWeight: '800' }, personInfo: { flex: 1, marginLeft: 9 }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, name: { fontSize: 11, fontWeight: '800', color: '#253046' }, badge: { borderRadius: 7, paddingHorizontal: 6, paddingVertical: 3, color: '#FFF', fontSize: 7, fontWeight: '800', overflow: 'hidden', textTransform: 'capitalize' }, pendingBadge: { backgroundColor: '#E98200' }, approvedBadge: { backgroundColor: '#00A878' }, rejectedBadge: { backgroundColor: '#E92A2A' }, role: { marginTop: 3, fontSize: 8, color: '#65758C' }, divider: { height: StyleSheet.hairlineWidth, marginVertical: 10, backgroundColor: '#E5E9F0' }, detail: { marginBottom: 5, fontSize: 8, color: '#44536A' }, link: { marginBottom: 7, fontSize: 8, color: '#7140E5' }, submitted: { fontSize: 8, color: '#708098' }, actions: { flexDirection: 'row', gap: 8, marginTop: 10 }, approve: { flex: 1, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00A878' }, reject: { flex: 1, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E92A2A' }, disabled: { opacity: .55 }, actionText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
});
