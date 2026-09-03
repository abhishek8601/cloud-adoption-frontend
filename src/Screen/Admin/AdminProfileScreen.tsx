import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import AdminBottomNav from './AdminBottomNav';

const LOGOUT_ENDPOINT = process.env.EXPO_PUBLIC_USER_LOGOUT_URL;

function Row({
  label,
  value,
  shaded,
}: {
  label: string;
  value: string;
  shaded?: boolean;
}) {
  return (
    <View style={[styles.row, shaded && styles.shaded]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function AdminProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const name = user?.name || '—';
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'A';
  const role = typeof user?.role === 'string' ? user.role : 'Administrator';
  const roleLabel = role.replace(/\b\w/g, (letter) => letter.toUpperCase());

  const handleSignOut = async () => {
    try {
      if (LOGOUT_ENDPOINT && user?.email) {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

        // Add authorization header if token is available
        if (user?.token) {
          headers.Authorization = `Bearer ${user.token}`;
        }

        await fetch(LOGOUT_ENDPOINT, {
          method: 'POST',
          headers,
          body: JSON.stringify({ email: user.email }),
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear user data regardless of API success
      await logout();
      router.dismissAll();
      router.replace('/');
    }
  };
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Profile</Text>
            <Pressable accessibilityLabel="Edit profile" accessibilityRole="button" onPress={() => router.push('/admin-profile-edit')} style={styles.edit}>
              <Text style={styles.editText}>♧ Edit</Text>
            </Pressable>
          </View>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.company}>{user?.company_name || '—'}</Text>
              <Text style={styles.role}>♧ {roleLabel}</Text>
            </View>
          </View>
          <Text style={styles.section}>Account Details</Text>
          <View style={styles.card}>
            <Row label="Name" value={name} />
            <Row label="Phone" value={user?.phone || '—'} />
            <Row label="Email Address" value={user?.email || '—'} shaded />
            <Row label="Access Level" value={roleLabel} shaded />
          </View>
          <Text style={styles.section}>Security</Text>
          <View style={styles.card}>
            <Pressable
              accessibilityLabel="Change password"
              accessibilityRole="button"
              onPress={() => router.push('/admin-change-password')}
              style={styles.security}
            >
              <Text style={styles.link}>Change Password</Text>
              <Text>›</Text>
            </Pressable>
            {/* <Pressable style={styles.security}>
              <Text style={styles.link}>Two-Factor Authentication</Text>
              <Text>›</Text>
            </Pressable> */}
          </View>
          <Text style={styles.section}>App Information</Text>
          <View style={styles.card}>
            <Row label="Platform" value={Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'} />
          </View>
          <Pressable accessibilityLabel="Sign out" accessibilityRole="button" onPress={handleSignOut} style={styles.signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
        <AdminBottomNav active="profile" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  headerTitle: { fontSize: 13, fontWeight: '800' },
  content: { flex: 1, padding: 12 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 23, fontWeight: '800' },
  edit: { backgroundColor: '#F0E9FF', padding: 7, borderRadius: 10 },
  editText: { color: '#7C3AED', fontSize: 10 },
  profileCard: { marginTop: 10, padding: 14, borderRadius: 12, backgroundColor: '#FFF', flexDirection: 'row', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' },
  avatarText: { color: '#FFF', fontWeight: '800' },
  name: { fontSize: 12, fontWeight: '800' },
  company: { fontSize: 9, color: '#65758C', marginTop: 3 },
  role: { fontSize: 8, color: '#7C3AED', marginTop: 5 },
  section: { fontSize: 9, fontWeight: '800', color: '#62718A', marginTop: 15, marginBottom: 7 },
  card: { overflow: 'hidden', borderRadius: 12, backgroundColor: '#FFF' },
  row: { minHeight: 43, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' },
  shaded: { backgroundColor: '#EEF3F9' },
  rowLabel: { fontSize: 10, fontWeight: '700' },
  rowValue: { fontSize: 10, color: '#65758C' },
  security: { height: 43, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' },
  link: { fontSize: 10, color: '#6F32E5' },
  signOut: { height: 34, marginTop: 13, borderRadius: 7, borderWidth: 1, borderColor: '#F1C4C8', alignItems: 'center', justifyContent: 'center' },
  signOutText: { fontSize: 10, color: '#E22F42', fontWeight: '800' },
  tabBar: { height: 62, backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  tabText: { fontSize: 9, color: '#FFF' },
  active: { alignItems: 'center', backgroundColor: '#7C3AED', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  activeText: { fontSize: 8, color: '#FFF' },
});
