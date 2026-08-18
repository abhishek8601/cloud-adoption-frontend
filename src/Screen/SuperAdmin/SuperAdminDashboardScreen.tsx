import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const stats = [
  { label: 'Active Conferences', detail: 'Currently running', value: '1', icon: 'calendar', color: '#7C3AED' },
  { label: 'Pending Approvals', detail: 'Require your attention', value: '3', icon: 'clock', color: '#F28B00' },
  { label: 'Total Users', detail: 'All registered', value: '17', icon: 'person.2', color: '#00A878' },
] as const;

export default function SuperAdminDashboardScreen() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}><Text style={styles.headerTitle}>Dashboard</Text></View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Cloud Adoption Solutions</Text>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: `${stat.color}12` }]}>
              <View style={[styles.iconBox, { backgroundColor: `${stat.color}18` }]}>
                <SymbolView name={{ ios: stat.icon, android: stat.icon === 'person.2' ? 'group' : stat.icon, web: stat.icon } as never} size={17} tintColor={stat.color} />
              </View>
              <View style={styles.statCopy}><Text style={styles.statValue}>{stat.value}</Text><Text style={styles.statLabel}>{stat.label}</Text><Text style={styles.statDetail}>{stat.detail}</Text></View>
              <Text style={[styles.chevron, { color: stat.color }]}>›</Text>
            </View>
          ))}
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.actions}><Pressable style={styles.action}><Text style={styles.actionIcon}>＋</Text><Text style={styles.actionText}>Create Conference</Text></Pressable><Pressable style={styles.action}><Text style={styles.actionIcon}>◷</Text><Text style={styles.actionText}>Watchlist</Text></Pressable><Pressable style={styles.action}><Text style={styles.actionIcon}>♧</Text><Text style={styles.actionText}>Notifications</Text></Pressable><Pressable style={styles.action}><Text style={styles.actionIcon}>⇩</Text><Text style={styles.actionText}>Export Data</Text></Pressable></View>
          <Text style={styles.sectionTitle}>RECENT USER ACTIVITY</Text>
          <View style={styles.activityCard}>{[['AJ','Alex Johnson','Accenture · EB-2025-4821','#7C3AED'],['NS','Nina Shah','Oracle · EB-2025-4822','#00A878'],['CT','Chris Taylor','Capgemini · EB-2025-4823','#D97706']].map(([initials,name,detail,color]) => <View key={name} style={styles.activityRow}><View style={[styles.activityAvatar,{backgroundColor:color}]}><Text style={styles.activityAvatarText}>{initials}</Text></View><View style={styles.activityCopy}><Text style={styles.activityName}>{name}</Text><Text style={styles.activityDetail}>{detail}</Text></View><Text style={styles.pending}>Pending</Text></View>)}</View>
        </ScrollView>
        <View style={styles.footer}>{[['Home','house',''],['Events','calendar','/superadmin-events'],['People','person.2','/admin-people'],['Tools','slider.horizontal.3','/admin-tools'],['Users','person.2','/admin-all-people'],['Profile','person','/admin-profile']].map(([label,icon,route]) => <Pressable key={label} accessibilityLabel={label} onPress={() => route && router.replace(route as never)} style={[styles.footerTab, label === 'Home' && styles.footerActive]}><SymbolView name={{ ios: icon, android: icon === 'calendar' ? 'calendar_month' : icon === 'person.2' ? 'group' : icon === 'slider.horizontal.3' ? 'tune' : icon, web: icon === 'calendar' ? 'calendar_month' : icon === 'person.2' ? 'group' : icon === 'slider.horizontal.3' ? 'tune' : icon } as never} size={15} tintColor="#FFFFFF" /><Text style={styles.footerText}>{label}</Text></Pressable>)}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }, headerTitle: { fontSize: 13, fontWeight: '800' }, content: { padding: 12 }, title: { fontSize: 24, fontWeight: '800', color: '#1D2639' }, subtitle: { marginTop: 3, marginBottom: 10, fontSize: 10, color: '#718098' }, statCard: { minHeight: 56, marginBottom: 8, padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }, iconBox: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, statCopy: { flex: 1, marginLeft: 10 }, statValue: { fontSize: 18, fontWeight: '800', color: '#1D2639' }, statLabel: { fontSize: 8, fontWeight: '800', color: '#1D2639' }, statDetail: { fontSize: 7, color: '#718098' }, chevron: { fontSize: 22 }, sectionTitle: { marginTop: 8, marginBottom: 7, fontSize: 7, fontWeight: '800', color: '#60718A' }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, action: { width: '48%', height: 56, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }, actionIcon: { fontSize: 18, color: '#7C3AED' }, actionText: { marginTop: 3, fontSize: 7, fontWeight: '700', color: '#354057' },
  activityCard: { overflow: 'hidden', borderRadius: 10, backgroundColor: '#FFF' }, activityRow: { minHeight: 48, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' }, activityAvatar: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }, activityAvatarText: { color: '#FFF', fontSize: 8, fontWeight: '800' }, activityCopy: { flex: 1, marginLeft: 8 }, activityName: { fontSize: 9, fontWeight: '800', color: '#253046' }, activityDetail: { marginTop: 2, fontSize: 7, color: '#718098' }, pending: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 7, fontSize: 7, fontWeight: '800', color: '#FFF', backgroundColor: '#E98200' },
  footer: { height: 62, paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#000' }, footerTab: { flex: 1, alignItems: 'center', paddingVertical: 5 }, footerActive: { marginHorizontal: 2, borderRadius: 15, backgroundColor: '#7C3AED' }, footerText: { marginTop: 2, color: '#FFF', fontSize: 7, fontWeight: '700' },
});
