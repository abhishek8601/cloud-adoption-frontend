import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

type DetailRowProps = {
  label: string;
  value: string;
  emphasized?: boolean;
  icon?: { ios: string; android: string; web: string };
};

function DetailRow({ label, value, emphasized, icon }: DetailRowProps) {
  return (
    <View style={[styles.detailRow, emphasized && styles.emphasizedRow]}>
      <View style={styles.detailCopy}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
      {icon && <SymbolView name={icon as never} size={12} tintColor="#718098" />}
    </View>
  );
}

const tabs = [
  { label: 'Home', icon: { ios: 'house', android: 'home', web: 'home' } },
  { label: 'Events', icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' } },
  { label: 'People', icon: { ios: 'person.2', android: 'group', web: 'group' } },
  { label: 'Tools', icon: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' } },
  { label: 'Users', icon: { ios: 'person.2.fill', android: 'group', web: 'group' } },
  { label: 'Profile', icon: { ios: 'person', android: 'person', web: 'person' } },
] as const;

export default function SuperAdminProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser, isLoading } = useAuth();
  const [isRefreshingProfile, setIsRefreshingProfile] = useState(false);

  useEffect(() => {
    const token = user?.token;
    if (!token) return;

    const refreshProfile = async () => {
      setIsRefreshingProfile(true);
      try {
        const response = await api.me(token);
        const profile = (response.data as { user?: Record<string, unknown> } | undefined)?.user
          ?? (response.data as Record<string, unknown> | undefined);

        if (profile && typeof profile === 'object') {
          await updateUser(profile);
        }
      } catch (error) {
        // Keep showing the saved authenticated-user data if the profile refresh fails.
        console.error('Failed to refresh super admin profile:', error);
      } finally {
        setIsRefreshingProfile(false);
      }
    };

    void refreshProfile();
  }, [user?.token]);

  const name = user?.name?.trim() || '—';
  const initials = name === '—'
    ? 'SA'
    : name.split(/\s+/).map((part) => part[0]).join('').toUpperCase().slice(0, 2);
  const rawRole = user?.role as unknown;
  const role = typeof rawRole === 'string'
    ? rawRole.trim()
    : rawRole && typeof rawRole === 'object'
      ? ((rawRole as { name?: unknown; label?: unknown; title?: unknown }).name
        ?? (rawRole as { label?: unknown }).label
        ?? (rawRole as { title?: unknown }).title) as string
      : 'super admin';
  const normalizedRole = typeof role === 'string' && role.trim() ? role.trim() : 'super admin';
  const roleLabel = normalizedRole.replace(/\b\w/g, (letter) => letter.toUpperCase());
  const accessLevel = normalizedRole.toLowerCase().includes('super')
    ? 'Full Super Admin Access'
    : `${roleLabel} Access`;
  const platform = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web';

  const handleSignOut = async () => {
    try {
      if (user?.token) await api.logout(user.token);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      await logout();
      router.dismissAll();
      router.replace('/');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
          <ActivityIndicator color="#7C3AED" />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.replace('/superadmin-dashboard')} hitSlop={10} style={styles.backButton}>
            <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} size={19} tintColor="#253046" />
          </Pressable>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Profile</Text>
            {/* <Pressable accessibilityLabel="Edit profile" accessibilityRole="button" style={styles.editButton}>
              <SymbolView name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }} size={11} tintColor="#7C3AED" />
              <Text style={styles.editText}>Edit</Text>
            </Pressable> */}
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
            <View style={styles.profileCopy}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.company}>{user?.company_name?.trim() || '—'}</Text>
              <View style={styles.roleBadge}>
                <SymbolView name={{ ios: 'shield.fill', android: 'shield', web: 'shield' }} size={9} tintColor="#7C3AED" />
                <Text style={styles.roleText}>{roleLabel}</Text>
              </View>
            </View>
            {isRefreshingProfile ? <ActivityIndicator size="small" color="#7C3AED" /> : null}
          </View>

          <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
          <View style={styles.card}>
            <DetailRow label="Name" value={name} />
            <DetailRow label="Phone" value={user?.phone?.trim() || '—'} />
            <DetailRow label="EMAIL ADDRESS" value={user?.email?.trim() || '—'} emphasized icon={{ ios: 'lock', android: 'lock', web: 'lock' }} />
            <DetailRow label="ACCESS LEVEL" value={accessLevel} emphasized icon={{ ios: 'shield', android: 'shield', web: 'shield' }} />
          </View>

          <Text style={styles.sectionTitle}>SECURITY</Text>
          <View style={styles.card}>
            {['Change Password'].map((label) => (
              <Pressable key={label} onPress={() => label === 'Change Password' && router.push('/superadmin-change-password')} style={styles.securityRow}>
                <Text style={styles.securityLink}>{label}</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>APP INFORMATION</Text>
          <View style={styles.card}><DetailRow label="Platform" value={platform} /></View>

          <Pressable accessibilityLabel="Sign out" accessibilityRole="button" onPress={handleSignOut} style={styles.signOutButton}><Text style={styles.signOutText}>Sign Out</Text></Pressable>
        </ScrollView>

        <SuperAdminTabBar activeTab="Profile" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' },
  backButton: { width: 44, alignItems: 'center', justifyContent: 'center' },
  headerSpacer: { width: 44 },
  content: { padding: 12, paddingBottom: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 23, fontWeight: '800', color: '#1D2639' },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: '#F0E9FF' },
  editText: { fontSize: 9, fontWeight: '700', color: '#7C3AED' },
  profileCard: { marginTop: 10, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  avatar: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' },
  avatarText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  profileCopy: { marginLeft: 10 },
  name: { fontSize: 12, fontWeight: '800', color: '#253046' },
  company: { marginTop: 3, fontSize: 9, color: '#65758C' },
  roleBadge: { alignSelf: 'flex-start', marginTop: 5, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F0E9FF' },
  roleText: { fontSize: 7, fontWeight: '700', color: '#7C3AED' },
  sectionTitle: { marginTop: 15, marginBottom: 7, fontSize: 8, fontWeight: '800', color: '#62718A' },
  card: { overflow: 'hidden', borderRadius: 10, backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  detailRow: { minHeight: 43, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' },
  emphasizedRow: { backgroundColor: '#EEF3F9' },
  detailCopy: { flex: 1 },
  detailLabel: { fontSize: 8, fontWeight: '800', color: '#62718A' },
  detailValue: { marginTop: 3, fontSize: 9, color: '#65758C' },
  securityRow: { height: 43, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' },
  securityLink: { fontSize: 9, color: '#6F32E5' },
  chevron: { fontSize: 19, color: '#B2BDCE' },
  signOutButton: { height: 34, marginTop: 13, borderRadius: 7, borderWidth: 1, borderColor: '#F1C4C8', alignItems: 'center', justifyContent: 'center' },
  signOutText: { fontSize: 10, fontWeight: '800', color: '#E22F42' },
  tabBar: { height: 62, backgroundColor: '#000000', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  tab: { minWidth: 34, alignItems: 'center', paddingVertical: 5 },
  activeTab: { borderRadius: 17, backgroundColor: '#7C3AED', paddingHorizontal: 10 },
  tabLabel: { marginTop: 2, color: '#FFFFFF', fontSize: 8 },
});
