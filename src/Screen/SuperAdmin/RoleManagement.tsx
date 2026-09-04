import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';
import { useAuth } from '../../context/AuthContext';
import { apiRequest, type RegistrationEntry } from '../../services/api';

type Role = 'Attendee' | 'Admin' | 'Super Admin';
type Person = { id: string; name: string; email: string; role: Role };
type AdminRecord = { id?: number | string; name?: string; email?: string; role?: string | { name?: string } };

const colors = ['#7C3AED', '#00A878', '#DF7800', '#8B5CF6', '#E52F50'];
const initials = (name: string) => name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';
const normalizeRole = (value: AdminRecord['role']): Role => {
  const role = (typeof value === 'string' ? value : value?.name || '').trim().toLowerCase();
  return role === 'super admin' || role === 'superadmin' ? 'Super Admin' : 'Admin';
};
const priority: Record<Role, number> = { 'Super Admin': 0, Admin: 1, Attendee: 2 };

export default function RoleManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPeople = useCallback(async () => {
    if (!user?.token) {
      setPeople([]);
      setError('Please sign in again to view roles.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const registrationsEndpoint = process.env.EXPO_PUBLIC_ADMIN_REGISTRATIONS_URL || '/admin/registrations';
    const adminsEndpoint = process.env.EXPO_PUBLIC_ADMIN_DETAILS_URL || process.env.EXPO_PUBLIC_ADMIN_ADMINS_URL || '/admin/admins';
    const [registrationsResult, adminsResult] = await Promise.allSettled([
      apiRequest<RegistrationEntry[] | { data?: RegistrationEntry[] }>(registrationsEndpoint, { token: user.token }),
      apiRequest<AdminRecord[] | { data?: AdminRecord[] }>(adminsEndpoint, { token: user.token }),
    ]);

    const attendees: Person[] = registrationsResult.status === 'fulfilled'
      ? (Array.isArray(registrationsResult.value.data) ? registrationsResult.value.data : registrationsResult.value.data?.data || []).map((entry) => ({ id: `attendee-${entry.user.id || entry.id}`, name: entry.user.name || 'Unnamed Attendee', email: entry.user.email || 'No email address', role: 'Attendee' }))
      : [];
    const admins: Person[] = adminsResult.status === 'fulfilled'
      ? (Array.isArray(adminsResult.value.data) ? adminsResult.value.data : adminsResult.value.data?.data || []).map((admin, index) => ({ id: `admin-${admin.id || admin.email || index}`, name: admin.name || 'Unnamed Admin', email: admin.email || 'No email address', role: normalizeRole(admin.role) }))
      : [];
    const isSignedInSuperAdmin = user.role?.trim().toLowerCase().replace(/\s+/g, '') === 'superadmin';
    const signedInSuperAdmin: Person[] = isSignedInSuperAdmin && user.email ? [{ id: `superadmin-${user.id || user.email}`, name: user.name || 'Super Admin', email: user.email, role: 'Super Admin' }] : [];
    const combined = [...signedInSuperAdmin, ...admins, ...attendees];
    const uniquePeople = Array.from(new Map(combined.map((person) => [person.email.toLowerCase(), person])).values()).sort((first, second) => priority[first.role] - priority[second.role] || first.name.localeCompare(second.name));

    setPeople(uniquePeople);
    if (registrationsResult.status === 'rejected' && adminsResult.status === 'rejected') setError('Unable to load attendees and admins.');
    setIsLoading(false);
  }, [user]);

  useFocusEffect(useCallback(() => { void loadPeople(); }, [loadPeople]));
  const visiblePeople = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search ? people.filter((person) => `${person.name} ${person.email} ${person.role}`.toLowerCase().includes(search)) : people;
  }, [people, query]);

  return <View style={styles.screen}><StatusBar style="dark" /><SafeAreaView style={styles.safe}>
    <View style={styles.header}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}><SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} size={19} tintColor="#253046" /></Pressable><Text style={styles.headerText}>Role Management</Text><View style={styles.backButton} /></View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.title}>Role Management</Text><Text style={styles.subtitle}>All attendees, admins, and super admins</Text><View style={styles.search}><SymbolView name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }} size={14} tintColor="#8A96A9" /><TextInput value={query} onChangeText={setQuery} placeholder="Search any user" placeholderTextColor="#8A96A9" style={styles.input} /></View>{isLoading ? <View style={styles.loader}><ActivityIndicator color="#7C3AED" /></View> : null}{error ? <Text style={styles.error}>{error}</Text> : null}{!isLoading && !error && !visiblePeople.length ? <Text style={styles.empty}>No people found.</Text> : null}{!isLoading && visiblePeople.length ? <View style={styles.card}>{visiblePeople.map((person, index) => <View style={styles.row} key={person.id}><View style={[styles.avatar, { backgroundColor: colors[index % colors.length] }]}><Text style={styles.avatarText}>{initials(person.name)}</Text></View><View style={styles.copy}><Text style={styles.name}>{person.name}</Text><Text style={styles.email}>{person.email}</Text></View><Text style={styles.role}>{person.role}</Text></View>)}</View> : null}</ScrollView><SuperAdminTabBar activeTab="Users" />
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safe: { flex: 1 }, header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' }, backButton: { width: 44, alignItems: 'center', justifyContent: 'center' }, headerText: { fontSize: 13, fontWeight: '800', color: '#1D2639' }, content: { padding: 12, paddingBottom: 95 }, title: { marginTop: 4, fontSize: 21, fontWeight: '800', color: '#1D2639' }, subtitle: { marginTop: 3, fontSize: 9, color: '#718098' }, search: { height: 38, marginTop: 12, paddingHorizontal: 10, borderRadius: 9, flexDirection: 'row', gap: 7, alignItems: 'center', backgroundColor: '#FFF' }, input: { flex: 1, height: '100%', padding: 0, fontSize: 11, color: '#253046' }, card: { marginTop: 9, borderRadius: 10, overflow: 'hidden', backgroundColor: '#FFF' }, row: { minHeight: 53, paddingHorizontal: 11, alignItems: 'center', flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' }, avatar: { width: 29, height: 29, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }, avatarText: { fontSize: 9, fontWeight: '800', color: '#FFF' }, copy: { flex: 1, marginLeft: 8 }, name: { fontSize: 10, fontWeight: '800', color: '#253046' }, email: { marginTop: 2, fontSize: 7, color: '#65758C' }, role: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, overflow: 'hidden', fontSize: 7, fontWeight: '800', color: '#7C3AED', backgroundColor: '#F0E9FF' }, loader: { padding: 30, alignItems: 'center' }, error: { marginTop: 10, padding: 10, borderRadius: 8, color: '#C62828', backgroundColor: '#FFF0F1', fontSize: 10 }, empty: { marginTop: 10, padding: 20, borderRadius: 10, color: '#718098', backgroundColor: '#FFF', textAlign: 'center', fontSize: 10 },
});
