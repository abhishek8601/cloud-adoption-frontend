import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminBottomNav from './AdminBottomNav';

type Tool = {
  title: string;
  detail: string;
  icon: { ios: string; android: string; web: string };
  color: string;
  background: string;
};

const tools: Tool[] = [
  { title: 'Configure Fields', detail: 'Manage sign-up form fields and interests', icon: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }, color: '#7C3AED', background: '#F2ECFF' },
  { title: 'Send Notifications', detail: 'Broadcast messages to attendees', icon: { ios: 'bell', android: 'notifications', web: 'notifications' }, color: '#7C3AED', background: '#F5F0FF' },
  { title: 'Export Data', detail: 'Download attendee records as CSV', icon: { ios: 'square.and.arrow.down', android: 'download', web: 'download' }, color: '#00A878', background: '#E7F8F3' },
];

export default function AdminToolsScreen() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tools</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Tools</Text>
          <Text style={styles.subtitle}>Admin tools & configuration</Text>
          {tools.map((tool) => (
            <Pressable key={tool.title} style={styles.toolCard}>
              <View style={[styles.iconBox, { backgroundColor: tool.background }]}>
                <SymbolView
                  name={tool.icon as never}
                  size={23}
                  tintColor={tool.color}
                />
              </View>
              <View style={styles.copy}>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.detail}>{tool.detail}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
        <AdminBottomNav active="tools" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' }, headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' }, content: { flex: 1, padding: 12 }, title: { fontSize: 24, fontWeight: '800', color: '#1D2639' }, subtitle: { fontSize: 10, color: '#718098', marginTop: 3, marginBottom: 10 }, toolCard: { minHeight: 67, marginBottom: 10, padding: 12, borderRadius: 13, alignItems: 'center', flexDirection: 'row', backgroundColor: '#FFF', shadowColor: '#34425D', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, iconBox: { height: 40, width: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, marginLeft: 12 }, toolTitle: { fontSize: 12, fontWeight: '800', color: '#253046' }, detail: { fontSize: 10, color: '#65758C', marginTop: 4 }, chevron: { fontSize: 23, color: '#B2BDCE' }, tabBar: { height: 62, backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, tabText: { color: '#FFF', fontSize: 9 }, activeTab: { borderRadius: 17, paddingHorizontal: 10, paddingVertical: 5, alignItems: 'center', backgroundColor: '#7C3AED' }, activeText: { fontSize: 8, color: '#FFF' },
});
