import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminBottomNav from './AdminBottomNav';

type MetricCardProps = {
  icon: { ios: string; android: string; web: string };
  value: string;
  title: string;
  detail: string;
  backgroundColor: string;
  tintColor: string;
};

function MetricCard({ icon, value, title, detail, backgroundColor, tintColor }: MetricCardProps) {
  return (
    <View style={[styles.metricCard, { backgroundColor }]}>
      <View style={styles.metricIcon}>
        <SymbolView name={icon as never} size={21} tintColor={tintColor} />
      </View>
      <View style={styles.metricCopy}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={styles.metricDetail}>{detail}</Text>
      </View>
      <Text style={[styles.chevron, { color: tintColor }]}>›</Text>
    </View>
  );
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}><Text style={styles.headerTitle}>Dashboard</Text></View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Cloud Adoption Solutions</Text>

          <MetricCard icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} value="1" title="Active Conferences" detail="Currently running" backgroundColor="#F2ECFF" tintColor="#7C3AED" />
          <MetricCard icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }} value="3" title="Pending Approvals" detail="Require your attention" backgroundColor="#FFF3E5" tintColor="#E98200" />
          <MetricCard icon={{ ios: 'person.2', android: 'group', web: 'group' }} value="17" title="Total Users" detail="All registered" backgroundColor="#E5F8F3" tintColor="#00A878" />

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {['Create Conference', 'Watchlist', 'Notifications', 'Import Data'].map((action) => (
              <Pressable key={action} style={styles.actionCard}><Text style={styles.actionText}>{action}</Text></Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recent Registrations</Text>
          {['Nina Shah', 'Chris Taylor'].map((name) => (
            <View key={name} style={styles.userRow}><View style={styles.avatar}><Text style={styles.avatarText}>{name.split(' ').map((part) => part[0]).join('')}</Text></View><View style={styles.userInfo}><Text style={styles.userName}>{name}</Text><Text style={styles.userDetail}>Capgemini · EB-2025-4821</Text></View><Text style={styles.pending}>Pending</Text></View>
          ))}
        </ScrollView>

        <AdminBottomNav active="home" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }, headerTitle: { color: '#1D2639', fontSize: 13, fontWeight: '800' }, content: { padding: 13, paddingBottom: 78 }, title: { color: '#1D2639', fontSize: 24, fontWeight: '800' }, subtitle: { color: '#718098', fontSize: 10, marginBottom: 10 }, metricCard: { height: 68, marginBottom: 9, borderRadius: 12, padding: 11, flexDirection: 'row', alignItems: 'center' }, metricIcon: { width: 37, height: 37, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }, metricCopy: { flex: 1, marginLeft: 10 }, metricValue: { color: '#1E273B', fontSize: 21, fontWeight: '800' }, metricTitle: { color: '#263147', fontSize: 11, fontWeight: '800' }, metricDetail: { color: '#708098', fontSize: 9 }, chevron: { fontSize: 27 }, sectionTitle: { color: '#62718A', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7, marginTop: 13, marginBottom: 8 }, actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, actionCard: { width: '48%', height: 62, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }, actionText: { color: '#253046', fontSize: 10, fontWeight: '700' }, userRow: { height: 51, marginBottom: 2, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF' }, avatar: { width: 27, height: 27, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00A878' }, avatarText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' }, userInfo: { flex: 1, marginLeft: 8 }, userName: { color: '#253046', fontSize: 11, fontWeight: '800' }, userDetail: { color: '#738198', fontSize: 8 }, pending: { overflow: 'hidden', borderRadius: 8, padding: 5, color: '#FFFFFF', fontSize: 8, fontWeight: '800', backgroundColor: '#E98200' }, tabBar: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#000000' }, activeTab: { minWidth: 43, borderRadius: 17, paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center', backgroundColor: '#7C3AED' }, activeTabText: { color: '#FFFFFF', fontSize: 8 }, tabText: { color: '#FFFFFF', fontSize: 9 },
});
