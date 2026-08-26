import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const tabs = [
  { label: 'Home', route: '/superadmin-dashboard', icon: { ios: 'house', android: 'home', web: 'home' } },
  { label: 'Events', route: '/superadmin-events', icon: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' } },
  { label: 'People', route: '/superadmin-people', icon: { ios: 'person.2', android: 'group', web: 'group' } },
  { label: 'Tools', route: '/superadmin-tools', icon: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' } },
  { label: 'Users', route: '/superadmin-users', icon: { ios: 'person.2.fill', android: 'group', web: 'group' } },
  { label: 'Profile', route: '/superadmin-profile', icon: { ios: 'person', android: 'person', web: 'person' } },
] as const;

type SuperAdminTabBarProps = { activeTab: (typeof tabs)[number]['label'] };

export default function SuperAdminTabBar({ activeTab }: SuperAdminTabBarProps) {
  const router = useRouter();

  return <View style={styles.tabBar}>{tabs.map((tab) => {
    const active = tab.label === activeTab;
    return <Pressable key={tab.label} accessibilityLabel={tab.label} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={() => !active && router.replace(tab.route as never)} style={[styles.tab, active && styles.activeTab]}><SymbolView name={tab.icon} size={15} tintColor="#FFFFFF" /><Text style={styles.tabLabel}>{tab.label}</Text></Pressable>;
  })}</View>;
}

const styles = StyleSheet.create({
  tabBar: { height: 62, paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#000000' },
  tab: { flex: 1, minWidth: 34, alignItems: 'center', paddingVertical: 5 },
  activeTab: { marginHorizontal: 2, borderRadius: 17, backgroundColor: '#7C3AED' },
  tabLabel: { marginTop: 2, color: '#FFFFFF', fontSize: 7, fontWeight: '700' },
});
