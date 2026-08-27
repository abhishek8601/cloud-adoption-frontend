import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';

const options = [
  { title: 'Users List', detail: 'All registered end users', route: '/superadmin-user-list', icon: { ios: 'person.2', android: 'group', web: 'group' }, color: '#7C3AED', background: '#F2ECFF' },
  { title: 'Admin Users', detail: 'Manage admin accounts', route: '/superadmin-admin-users', icon: { ios: 'shield', android: 'shield', web: 'shield' }, color: '#7C3AED', background: '#F5F0FF' },
  { title: 'Role Management', detail: 'Assign and change user roles', route: '/superadmin-role-management', icon: { ios: 'person.badge.key', android: 'manage_accounts', web: 'manage_accounts' }, color: '#0095C8', background: '#E9F8FD' },
] as const;

export default function SuperAdminUserManagementScreen() {
  const router = useRouter();
  return <View style={styles.screen}><StatusBar style="dark" /><SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><Text style={styles.headerTitle}>User Management</Text></View>
    <View style={styles.content}><Text style={styles.title}>User Management</Text><Text style={styles.subtitle}>Super Admin controls</Text>
      {options.map((option) => <Pressable key={option.title} accessibilityRole="button" onPress={() => router.push(option.route as never)} style={styles.optionCard}><View style={[styles.iconBox, { backgroundColor: option.background }]}><SymbolView name={option.icon} size={21} tintColor={option.color} /></View><View style={styles.copy}><Text style={styles.optionTitle}>{option.title}</Text><Text style={styles.detail}>{option.detail}</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}
    </View>
    <SuperAdminTabBar activeTab="Users" />
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' }, headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' }, content: { flex: 1, padding: 12 }, title: { fontSize: 24, fontWeight: '800', color: '#1D2639' }, subtitle: { marginTop: 3, marginBottom: 10, fontSize: 10, color: '#718098' }, optionCard: { minHeight: 57, marginBottom: 9, padding: 10, borderRadius: 12, alignItems: 'center', flexDirection: 'row', backgroundColor: '#FFF', shadowColor: '#34425D', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, marginLeft: 11 }, optionTitle: { fontSize: 10, fontWeight: '800', color: '#253046' }, detail: { marginTop: 3, fontSize: 8, color: '#65758C' }, chevron: { fontSize: 20, color: '#B2BDCE' },
});
