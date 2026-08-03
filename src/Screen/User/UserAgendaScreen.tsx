import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SessionProps = { track: string; title: string; speaker: string; role: string; initials: string; time: string; duration: string; room: string; color: string; bookmarked?: boolean };

function SessionCard({ track, title, speaker, role, initials, time, duration, room, color, bookmarked }: SessionProps) {
  return (
    <View style={[styles.sessionCard, { borderTopColor: color }]}>
      <View style={styles.sessionTop}><View style={[styles.trackPill, { backgroundColor: `${color}20` }]}><Text style={[styles.trackText, { color }]}>{track}</Text></View><SymbolView name={{ ios: bookmarked ? 'bookmark.fill' : 'bookmark', android: bookmarked ? 'bookmark' : 'bookmark_border', web: bookmarked ? 'bookmark' : 'bookmark_border' }} size={16} tintColor={bookmarked ? '#7C3AED' : '#B6C0D1'} /></View>
      <Text style={styles.sessionTitle}>{title}</Text>
      <View style={styles.speakerRow}><View style={[styles.initials, { backgroundColor: color }]}><Text style={styles.initialsText}>{initials}</Text></View><View><Text style={styles.speakerName}>{speaker}</Text><Text style={styles.speakerRole}>{role}</Text></View></View>
      <View style={styles.line} />
      <View style={styles.metaRow}><SymbolView name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} size={12} tintColor="#728099" /><Text style={styles.metaMain}>{time}</Text><Text style={styles.metaText}>· {duration}</Text></View>
      <View style={styles.metaRow}><SymbolView name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} size={12} tintColor="#7C3AED" /><Text style={styles.location}>{room}</Text><SymbolView name={{ ios: 'arrow.up.right.square', android: 'open_in_new', web: 'open_in_new' }} size={10} tintColor="#7C3AED" /></View>
    </View>
  );
}

export default function UserAgendaScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}><View><Text style={styles.title}>Agenda</Text><Text style={styles.eventName}>Cloud Adoption Summit 2025</Text><Text style={styles.date}>Monday, 15 Sep 2025 · 6 sessions</Text></View><View style={styles.dateButton}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={19} tintColor="#7C3AED" /><Text style={styles.dateButtonText}>Choose Date</Text></View></View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.scroll}>
          <SessionCard track="Keynote" title="Opening Keynote: The Cloud-Native Enterprise" speaker="Dr. Angela Morrison" role="VP Engineering, AWS" initials="DA" time="9:00 AM" duration="90 min" room="Hyatt Regency SF · Main Hall" color="#7C3AED" bookmarked />
          <SessionCard track="Infrastructure" title="Workshop: Kubernetes Platform Engineering at Scale" speaker="Kevin Park" role="Staff Engineer, Stripe" initials="KP" time="10:30 AM" duration="60 min" room="Hyatt Regency SF · Room A" color="#00A878" />
          <SessionCard track="Strategy" title="Panel: Multi-Cloud Strategy in 2025" speaker="Lisa Chen (Moderator)" role="CTO, CloudNative Inc." initials="LC" time="12:00 PM" duration="60 min" room="Hyatt Regency SF · Main Hall" color="#F49A00" bookmarked />
          <SessionCard track="FinOps" title="Deep Dive: Cost Optimisation at Scale" speaker="Marcus Williams" role="Platform Lead, Netflix" initials="MW" time="1:30 PM" duration="45 min" room="Hyatt Regency SF · Main Hall" color="#7C3AED" />
          <SessionCard track="Infrastructure" title="Workshop: Infrastructure as Code Best Practices" speaker="Aisha Patel" role="Platform Architect, HashiCorp" initials="AP" time="3:00 PM" duration="60 min" room="Hyatt Regency SF · Room A" color="#00A878" />
          <SessionCard track="Keynote" title="Keynote: AI/ML on Cloud Infrastructure" speaker="Dr. James Chen" role="Director, Google DeepMind" initials="DJ" time="4:30 PM" duration="60 min" room="Hyatt Regency SF · Main Hall" color="#7C3AED" bookmarked />
        </ScrollView>
        <View style={styles.tabBar}>
          <Pressable accessibilityRole="link" onPress={() => router.replace('/dashboard')} style={styles.tab}><SymbolView name={{ ios: 'house', android: 'home', web: 'home' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Home</Text></Pressable>
          <View style={styles.tabActive}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={18} tintColor="#7B3FF0" /><Text style={styles.tabActiveText}>Agenda</Text></View>
          <View style={styles.tab}><SymbolView name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Charts</Text></View>
          <View style={styles.tab}><SymbolView name={{ ios: 'person.2', android: 'group', web: 'group' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>People</Text></View>
          <View style={styles.tab}><SymbolView name={{ ios: 'bookmark', android: 'bookmark', web: 'bookmark' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Saved</Text></View>
          <View style={styles.tab}><SymbolView name={{ ios: 'person', android: 'person', web: 'person' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Profile</Text></View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, scroll: { flex: 1 }, header: { paddingHorizontal: 17, paddingTop: 15, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }, title: { color: '#1E273B', fontSize: 25, fontWeight: '800' }, eventName: { color: '#69809C', fontSize: 12, marginTop: 6 }, date: { color: '#51627B', fontSize: 11, fontWeight: '600', marginTop: 5 }, dateButton: { width: 62, height: 52, borderRadius: 9, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: '#F0E9FF' }, dateButtonText: { color: '#7A46DB', fontSize: 8, fontWeight: '700' }, content: { padding: 12, paddingBottom: 24, gap: 10 }, sessionCard: { overflow: 'hidden', padding: 13, borderRadius: 13, borderTopWidth: 4, backgroundColor: '#FFFFFF', shadowColor: '#334360', shadowOpacity: 0.08, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, sessionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, trackPill: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4 }, trackText: { fontSize: 9, fontWeight: '800' }, sessionTitle: { color: '#1E273B', fontSize: 13, lineHeight: 18, fontWeight: '800', marginTop: 9 }, speakerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 }, initials: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, initialsText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' }, speakerName: { color: '#28344A', fontSize: 11, fontWeight: '800', marginLeft: 8 }, speakerRole: { color: '#77849A', fontSize: 9, marginLeft: 8, marginTop: 2 }, line: { height: StyleSheet.hairlineWidth, backgroundColor: '#E4E8F0', marginTop: 12, marginBottom: 9 }, metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }, metaMain: { color: '#354057', fontSize: 10, fontWeight: '700' }, metaText: { color: '#7C879A', fontSize: 10 }, location: { color: '#6F3CE1', fontSize: 10, fontWeight: '600' }, tabBar: { height: 67, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E3E8F0', backgroundColor: '#FFFFFF' }, tab: { flex: 1, alignItems: 'center', gap: 3 }, tabActive: { flex: 1, alignItems: 'center', gap: 3 }, tabText: { color: '#64748B', fontSize: 8, fontWeight: '600' }, tabActiveText: { color: '#7B3FF0', fontSize: 8, fontWeight: '800' },
});
