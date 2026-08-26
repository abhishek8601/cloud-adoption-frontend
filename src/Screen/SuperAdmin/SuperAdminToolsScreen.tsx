import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';

type ManagementOption = {
  title: string;
  detail: string;
  icon: { ios: string; android: string; web: string };
  color: string;
  background: string;
};

const managementOptions: ManagementOption[] = [
  {
    title: 'Users List',
    detail: 'All registered end users',
    icon: { ios: 'person.2', android: 'group', web: 'group' },
    color: '#7C3AED',
    background: '#F2ECFF',
  },
  {
    title: 'Admin Users',
    detail: 'Manage admin accounts',
    icon: { ios: 'shield', android: 'shield', web: 'shield' },
    color: '#7C3AED',
    background: '#F5F0FF',
  },
  {
    title: 'Role Management',
    detail: 'Assign and change user roles',
    icon: { ios: 'person.badge.key', android: 'manage_accounts', web: 'manage_accounts' },
    color: '#0095C8',
    background: '#E9F8FD',
  },
];

const tabs = [
  { label: 'Home', icon: { ios: 'house', android: 'home', web: 'home' } },
  { label: 'Events', icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' } },
  { label: 'People', icon: { ios: 'person.2', android: 'group', web: 'group' } },
  { label: 'Tools', icon: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' } },
  { label: 'Users', icon: { ios: 'person.2.fill', android: 'group', web: 'group' } },
  { label: 'Profile', icon: { ios: 'person', android: 'person', web: 'person' } },
] as const;

export default function SuperAdminToolsScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Management</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>Super Admin controls</Text>

          {managementOptions.map((option) => (
            <Pressable key={option.title} style={styles.optionCard}>
              <View style={[styles.iconBox, { backgroundColor: option.background }]}>
                <SymbolView name={option.icon as never} size={21} tintColor={option.color} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.detail}>{option.detail}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <SuperAdminTabBar activeTab="Tools" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  header: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E8EF',
  },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' },
  content: { flex: 1, padding: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#1D2639' },
  subtitle: { marginTop: 3, marginBottom: 10, fontSize: 10, color: '#718098' },
  optionCard: {
    minHeight: 57,
    marginBottom: 9,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    shadowColor: '#34425D',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, marginLeft: 11 },
  optionTitle: { fontSize: 10, fontWeight: '800', color: '#253046' },
  detail: { marginTop: 3, fontSize: 8, color: '#65758C' },
  chevron: { fontSize: 20, color: '#B2BDCE' },
  tabBar: {
    height: 62,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: { minWidth: 34, alignItems: 'center', paddingVertical: 5 },
  activeTab: { borderRadius: 17, backgroundColor: '#7C3AED', paddingHorizontal: 10 },
  tabLabel: { marginTop: 2, color: '#FFFFFF', fontSize: 8 },
});
