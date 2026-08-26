import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';

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

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Profile</Text>
            <Pressable style={styles.editButton}>
              <SymbolView name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }} size={11} tintColor="#7C3AED" />
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>SA</Text></View>
            <View style={styles.profileCopy}>
              <Text style={styles.name}>Super Admin</Text>
              <Text style={styles.company}>Cloud Adoption Solutions</Text>
              <View style={styles.roleBadge}>
                <SymbolView name={{ ios: 'shield.fill', android: 'shield', web: 'shield' }} size={9} tintColor="#7C3AED" />
                <Text style={styles.roleText}>Super Administrator</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
          <View style={styles.card}>
            <DetailRow label="Name" value="Super Admin" />
            <DetailRow label="Phone" value="+1 (415) 555-0100" />
            <DetailRow label="EMAIL ADDRESS" value="superadmin@cloudadoptionsolutions.com" emphasized icon={{ ios: 'lock', android: 'lock', web: 'lock' }} />
            <DetailRow label="ACCESS LEVEL" value="Full Super Admin Access" emphasized icon={{ ios: 'shield', android: 'shield', web: 'shield' }} />
          </View>

          <Text style={styles.sectionTitle}>SECURITY</Text>
          <View style={styles.card}>
            {['Change Password', 'Two-Factor Authentication'].map((label) => (
              <Pressable key={label} onPress={() => label === 'Change Password' && router.push('/superadmin-change-password')} style={styles.securityRow}>
                <Text style={styles.securityLink}>{label}</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>APP INFORMATION</Text>
          <View style={styles.card}><DetailRow label="Platform" value="iOS" /></View>

          <Pressable accessibilityLabel="Sign out" accessibilityRole="button" onPress={() => { router.dismissAll(); router.replace('/'); }} style={styles.signOutButton}><Text style={styles.signOutText}>Sign Out</Text></Pressable>
        </ScrollView>

        <SuperAdminTabBar activeTab="Profile" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' },
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
