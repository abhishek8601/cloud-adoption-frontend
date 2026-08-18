import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

type ExploreCardProps = {
  title: string;
  detail: string;
  symbol: ComponentProps<typeof SymbolView>['name'];
  tint: string;
};

function ExploreCard({ title, detail, symbol, tint }: ExploreCardProps) {
  return (
    <Pressable style={styles.exploreCard}>
      <View style={[styles.exploreIcon, { backgroundColor: tint }]}>
        <SymbolView name={symbol} size={19} tintColor="#7C3AED" />
      </View>
      <View style={styles.exploreCopy}>
        <Text style={styles.exploreTitle}>{title}</Text>
        <Text style={styles.exploreDetail}>{detail}</Text>
      </View>
      <View style={styles.arrowCircle}>
        <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }} size={15} tintColor="#8754ED" />
      </View>
    </Pressable>
  );
}

function Stat({ value, label, symbol }: { value: string; label: string; symbol: ComponentProps<typeof SymbolView>['name'] }) {
  return (
    <View style={styles.statCard}>
      <SymbolView name={symbol} size={17} tintColor="#8150E9" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function UserDashboardScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const userName = user?.name || 'User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Show loading state while user data is being restored
  if (isLoading) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.content, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={styles.sectionTitle}>Loading...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.eventCard}>
            <View style={styles.eventCopy}>
              <Text style={styles.eventEyebrow}>CLOUD ADOPTION SOLUTIONS</Text>
              <Text style={styles.eventTitle}>Cloud Adoption{`\n`}Summit 2026</Text>
            </View>
            <View style={styles.logoBox}>
              <Image contentFit="contain" source={require('../../../assets/images/icon.png')} style={styles.logo} />
            </View>
            <View style={styles.divider} />
            <View style={styles.eventDetails}>
              <View style={styles.detailLine}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={13} tintColor="#FFFFFF" /><Text style={styles.eventDetailText}>September 15–17, 2026</Text></View>
              <View style={styles.detailLine}><SymbolView name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} size={13} tintColor="#FFFFFF" /><Text style={styles.eventDetailText}>Hingewy, San Francisco, CA</Text></View>
              <View 
              style={styles.detailLine}>
                <SymbolView name={{ ios: 'globe', android: 'language', web: 'language' }} size={13} tintColor="#FFFFFF" /><Text 
              style={styles.eventDetailText}>5 Embarcadero Center</Text>
              </View>
            </View>
          </View>

          <View style={styles.welcomeCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{userInitials}</Text></View>
            <View style={styles.welcomeCopy}><Text style={styles.welcomeTitle}>Welcome back, {userName}</Text><Text style={styles.welcomeRole}>Microsoft · Cloud Architect</Text></View>
            <View style={styles.verified}><SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={10} tintColor="#FFFFFF" /><Text style={styles.verifiedText}>Verified</Text></View>
          </View>

          <Text style={styles.sectionTitle}>Explore</Text>
          <ExploreCard title="Agenda" detail="12 sessions across 3 days" symbol={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} tint="#F2ECFF" />
          <ExploreCard title="Attendees" detail="247 registered professionals" symbol={{ ios: 'person.2', android: 'group', web: 'group' }} tint="#E8FBF6" />
          <ExploreCard title="Infographics" detail="Live attendance & interest data" symbol={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }} tint="#F5EFFF" />

          <View style={styles.statsRow}>
            <Stat value="247" label="Attendees" symbol={{ ios: 'person.2', android: 'group', web: 'group' }} />
            <Stat value="12" label="Sessions" symbol={{ ios: 'book', android: 'menu_book', web: 'menu_book' }} />
            <Stat value="3" label="Days" symbol={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} />
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          <View style={styles.tabActive}><SymbolView name={{ ios: 'house.fill', android: 'home', web: 'home' }} size={18} tintColor="#7B3FF0" /><Text style={styles.tabActiveText}>Home</Text></View>
          <Pressable accessibilityRole="link" onPress={() => router.push('/agenda')} style={styles.tab}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Agenda</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/charts')} style={styles.tab}><SymbolView name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Charts</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/people')} style={styles.tab}><SymbolView name={{ ios: 'person.2', android: 'group', web: 'group' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>People</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/saved')} style={styles.tab}><SymbolView name={{ ios: 'bookmark', android: 'bookmark', web: 'bookmark' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Saved</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/profile')} style={styles.tab}><SymbolView name={{ ios: 'person', android: 'person', web: 'person' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Profile</Text></Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, content: { padding: 16, paddingBottom: 100 },
  eventCard: { minHeight: 182, overflow: 'hidden', borderRadius: 16, padding: 16, backgroundColor: '#7337ED', shadowColor: '#6331D5', shadowOpacity: 0.28, shadowRadius: 11, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  eventCopy: { paddingRight: 83 }, eventEyebrow: { color: '#DED0FF', fontSize: 9, fontWeight: '800', letterSpacing: 1.1 }, eventTitle: { color: '#FFFFFF', fontSize: 21, lineHeight: 24, fontWeight: '800', marginTop: 8 },
  logoBox: { position: 'absolute', top: 14, right: 14, width: 62, height: 62, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }, logo: { width: 53, height: 53 }, divider: { height: StyleSheet.hairlineWidth, marginTop: 12, backgroundColor: 'rgba(255,255,255,0.35)' },
  eventDetails: { gap: 7, marginTop: 11 }, detailLine: { flexDirection: 'row', alignItems: 'center', gap: 8 }, eventDetailText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  welcomeCard: { marginTop: 15, minHeight: 68, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', shadowColor: '#30415D', shadowOpacity: 0.08, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, avatar: { width: 38, height: 38, borderRadius: 9, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' }, welcomeCopy: { flex: 1, marginLeft: 10 }, welcomeTitle: { color: '#182239', fontSize: 13, fontWeight: '800' }, welcomeRole: { color: '#718097', fontSize: 11, marginTop: 3 }, verified: { gap: 3, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 13, backgroundColor: '#07A86C' }, verifiedText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  sectionTitle: { color: '#62718A', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 20, marginBottom: 10 },
  exploreCard: { minHeight: 58, padding: 10, marginBottom: 9, borderRadius: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBF9FF' }, exploreIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, exploreCopy: { flex: 1, marginLeft: 10 }, exploreTitle: { color: '#1E2940', fontSize: 13, fontWeight: '800' }, exploreDetail: { color: '#718097', fontSize: 10, marginTop: 3 }, arrowCircle: { width: 27, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE4FF' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 4 }, statCard: { flex: 1, minHeight: 83, padding: 11, borderRadius: 12, backgroundColor: '#FFFFFF', shadowColor: '#30415D', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 }, statValue: { color: '#222D45', fontSize: 19, fontWeight: '800', marginTop: 7 }, statLabel: { color: '#758399', fontSize: 10, marginTop: 1 },
  tabBar: { height: 71, paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E3E8F0', backgroundColor: '#FFFFFF' }, tab: { flex: 1, alignItems: 'center', gap: 3 }, tabActive: { flex: 1, alignItems: 'center', gap: 3 }, tabText: { color: '#64748B', fontSize: 8, fontWeight: '600' }, tabActiveText: { color: '#7B3FF0', fontSize: 8, fontWeight: '800' },
});
