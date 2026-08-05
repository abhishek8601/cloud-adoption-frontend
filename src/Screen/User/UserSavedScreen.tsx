import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const people = [
  ['JR', 'James Rodriguez', 'DevOps Lead', 'Amazon Web Services', '#00A878'],
  ['MW', 'Michael Wong', 'Solutions Architect', 'Google Cloud', '#8B55ED'],
  ['DK', 'David Kim', 'Security Engineer', 'Palo Alto Networks', '#E3302D'],
  ['AT', 'Aiko Tanaka', 'Cloud Solutions Lead', 'Fujitsu', '#0B98B5'],
  ['TH', 'Tom Henderson', 'Senior Cloud Consultant', 'Accenture', '#8B55ED'],
];

export default function UserSavedScreen() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Bookmarks</Text>
          <Text style={styles.count}>5 saved attendees</Text>
          <Text style={styles.tip}>Tap bookmark to remove</Text>
          <View style={styles.card}>
            {people.map(([initials, name, role, company, color], index) => (
              <View key={name} style={[styles.personRow, index !== people.length - 1 && styles.personDivider]}>
                <View style={[styles.avatar, { backgroundColor: color }]}><Text style={styles.avatarText}>{initials}</Text></View>
                <View style={styles.personInfo}><Text style={styles.name}>{name}</Text><Text style={styles.role}>{role}</Text><Text style={styles.company}>{company}</Text></View>
                <Pressable accessibilityLabel={`View ${name} LinkedIn`} style={styles.socialButton}><Text style={styles.linkedin}>in</Text></Pressable>
                <Pressable accessibilityLabel={`Remove ${name} from bookmarks`} style={styles.bookmarkButton}><SymbolView name={{ ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }} size={16} tintColor="#7B3FF0" /></Pressable>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.tabBar}>
          <Pressable accessibilityRole="link" onPress={() => router.replace('/dashboard')} style={styles.tab}><SymbolView name={{ ios: 'house', android: 'home', web: 'home' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Home</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.replace('/agenda')} style={styles.tab}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Agenda</Text></Pressable>
          <View style={styles.tab}><SymbolView name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Charts</Text></View>
          <Pressable accessibilityRole="link" onPress={() => router.push('/people')} style={styles.tab}><SymbolView name={{ ios: 'person.2', android: 'group', web: 'group' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>People</Text></Pressable>
          <View style={styles.tabActive}><SymbolView name={{ ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }} size={18} tintColor="#7B3FF0" /><Text style={styles.tabActiveText}>Saved</Text></View>
          <Pressable accessibilityRole="link" onPress={() => router.push('/profile')} style={styles.tab}><SymbolView name={{ ios: 'person', android: 'person', web: 'person' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Profile</Text></Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, content: { flex: 1, paddingHorizontal: 17, paddingTop: 16 }, title: { color: '#1D2639', fontSize: 25, fontWeight: '800' }, count: { color: '#738198', fontSize: 12, marginTop: 4 }, tip: { color: '#53647D', fontSize: 10, marginTop: 15, marginBottom: 8 }, card: { borderRadius: 14, overflow: 'hidden', backgroundColor: '#FFFFFF', shadowColor: '#334360', shadowOpacity: 0.08, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, personRow: { minHeight: 59, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }, personDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E9F0' }, avatar: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' }, personInfo: { flex: 1, marginLeft: 9 }, name: { color: '#202B40', fontSize: 11, fontWeight: '800' }, role: { color: '#62718A', fontSize: 9, marginTop: 2 }, company: { color: '#62718A', fontSize: 9, marginTop: 1 }, socialButton: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0EAFE', marginRight: 6 }, linkedin: { color: '#6E43DC', fontSize: 12, fontWeight: '900' }, bookmarkButton: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0EAFE' }, tabBar: { height: 67, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E3E8F0', backgroundColor: '#FFFFFF' }, tab: { flex: 1, alignItems: 'center', gap: 3 }, tabActive: { flex: 1, alignItems: 'center', gap: 3 }, tabText: { color: '#64748B', fontSize: 8, fontWeight: '600' }, tabActiveText: { color: '#7B3FF0', fontSize: 8, fontWeight: '800' },
});
