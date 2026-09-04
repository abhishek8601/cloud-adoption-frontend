import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';
import { useAuth } from '../../context/AuthContext';
import { apiRequest, type RegistrationEntry } from '../../services/api';

type Filter = 'pending' | 'approved' | 'rejected';
const colors = ['#7C3AED', '#00A878', '#E98200', '#8B5CF6', '#E52F50'];
const initial = (name?: string) => (name || 'User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
const submitted = (value?: string) => {
  if (!value) return 'Recently submitted';
  const hours = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 3600000));
  return hours < 1 ? 'Submitted just now' : hours < 24 ? `Submitted ${hours} hour${hours === 1 ? '' : 's'} ago` : `Submitted ${Math.floor(hours / 24)} days ago`;
};

export default function SuperAdminPeopleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<RegistrationEntry[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const load = useCallback(async () => {
    if (!user?.token) { setRegistrations([]); setError('Please sign in again to view registrations.'); setIsLoading(false); return; }
    setIsLoading(true); setError(null);
    try {
      const endpoint = process.env.EXPO_PUBLIC_ADMIN_REGISTRATIONS_URL || '/admin/registrations';
      const response = await apiRequest<RegistrationEntry[] | { data?: RegistrationEntry[] }>(endpoint, { token: user.token });
      setRegistrations(Array.isArray(response.data) ? response.data : response.data?.data || []);
    } catch (requestError) { setRegistrations([]); setError(requestError instanceof Error ? requestError.message : 'Unable to load registrations.'); }
    finally { setIsLoading(false); }
  }, [user?.token]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  const update = async (id: number, approval_status: 'approved' | 'rejected') => {
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
  return <View style={s.screen}><StatusBar style="dark" /><SafeAreaView style={s.safe}>
    <View style={s.header}><Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.replace('/superadmin-dashboard')} hitSlop={10} style={s.back}><SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} size={19} tintColor="#253046" /></Pressable><Text style={s.headerTitle}>Watchlist</Text><View style={s.spacer} /></View>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void load()} tintColor="#7C3AED" colors={["#7C3AED"]} />}>
      <View><Text style={s.title}>Watchlist</Text><Text style={s.subtitle}>{registrations.length} total entries</Text></View>
      <View style={s.filters}>{(['pending', 'approved', 'rejected'] as Filter[]).map((status) => <Pressable key={status} onPress={() => setFilter(status)} style={[s.filter, filter === status && s.activeFilter]}><Text style={[s.filterText, filter === status && s.activeFilterText]}>{`${status[0].toUpperCase()}${status.slice(1)} (${counts[status]})`}</Text></Pressable>)}</View>
      {isLoading ? <View style={s.loader}><ActivityIndicator color="#7C3AED" /></View> : null}{error ? <Text style={s.error}>{error}</Text> : null}{!isLoading && !error && !visible.length ? <Text style={s.empty}>No {filter} registrations.</Text> : null}
      {visible.map((entry, index) => <View key={entry.id} style={s.card}><View style={s.personHeader}><View style={[s.avatar, { backgroundColor: colors[index % colors.length] }]}><Text style={s.avatarText}>{initial(entry.user.name)}</Text></View><View style={s.personInfo}><View style={s.nameRow}><Text style={s.name}>{entry.user.name || 'Unnamed User'}</Text><Text style={[s.badge, entry.approval_status === 'approved' ? s.approved : entry.approval_status === 'rejected' ? s.rejected : s.pending]}>{entry.approval_status}</Text></View><Text style={s.role}>{[entry.user.designation, entry.user.company_name].filter(Boolean).join(' · ') || 'Registered attendee'}</Text></View></View><View style={s.divider} /><Text style={s.detail}>Email: {entry.user.email || '—'}</Text><Text style={s.detail}>Ticket: {entry.ticket_reference || '—'}</Text><Text style={s.detail}>Conference: {entry.conference?.title || '—'}</Text><Text style={s.detail}>Phone: {entry.user.phone || '—'}</Text><Text style={s.submitted}>{submitted(entry.created_at)}</Text>{entry.approval_status === 'pending' ? <View style={s.actions}><Pressable disabled={updatingId === entry.id} onPress={() => void update(entry.id, 'approved')} style={[s.approve, updatingId === entry.id && s.disabled]}><Text style={s.actionText}>Approve</Text></Pressable><Pressable disabled={updatingId === entry.id} onPress={() => void update(entry.id, 'rejected')} style={[s.reject, updatingId === entry.id && s.disabled]}><Text style={s.actionText}>Reject</Text></Pressable></View> : null}</View>)}
    </ScrollView><SuperAdminTabBar activeTab="People" />
  </SafeAreaView></View>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safe: { flex: 1 }, header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' }, back: { width: 44, alignItems: 'center', justifyContent: 'center' }, spacer: { width: 44 }, headerTitle: { color: '#1D2639', fontSize: 13, fontWeight: '800' }, content: { padding: 12, paddingBottom: 20 }, title: { fontSize: 23, fontWeight: '800', color: '#1D2639' }, subtitle: { marginTop: 3, fontSize: 10, color: '#718098' }, filters: { marginVertical: 10, padding: 3, borderRadius: 8, backgroundColor: '#E9EDF3', flexDirection: 'row' }, filter: { flex: 1, paddingVertical: 7, borderRadius: 6, alignItems: 'center' }, activeFilter: { backgroundColor: '#FFF' }, filterText: { fontSize: 8, color: '#60718A' }, activeFilterText: { fontWeight: '800', color: '#253046' }, loader: { padding: 35, alignItems: 'center' }, error: { padding: 12, borderRadius: 8, color: '#C62828', backgroundColor: '#FFF0F1', fontSize: 10 }, empty: { padding: 24, borderRadius: 12, color: '#718098', backgroundColor: '#FFF', textAlign: 'center', fontSize: 10 }, card: { marginBottom: 10, padding: 12, borderRadius: 13, backgroundColor: '#FFF', elevation: 2 }, personHeader: { flexDirection: 'row', alignItems: 'center' }, avatar: { width: 38, height: 38, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#FFF', fontSize: 12, fontWeight: '800' }, personInfo: { flex: 1, marginLeft: 9 }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, name: { fontSize: 11, fontWeight: '800', color: '#253046' }, badge: { borderRadius: 7, paddingHorizontal: 6, paddingVertical: 3, color: '#FFF', fontSize: 7, fontWeight: '800', overflow: 'hidden', textTransform: 'capitalize' }, pending: { backgroundColor: '#E98200' }, approved: { backgroundColor: '#00A878' }, rejected: { backgroundColor: '#E92A2A' }, role: { marginTop: 3, fontSize: 8, color: '#65758C' }, divider: { height: StyleSheet.hairlineWidth, marginVertical: 10, backgroundColor: '#E5E9F0' }, detail: { marginBottom: 5, fontSize: 8, color: '#44536A' }, submitted: { fontSize: 8, color: '#708098' }, actions: { flexDirection: 'row', gap: 8, marginTop: 10 }, approve: { flex: 1, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00A878' }, reject: { flex: 1, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E92A2A' }, disabled: { opacity: 0.55 }, actionText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
});
