import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';
import { useAuth } from '../../context/AuthContext';

const tools = [
  { title: 'Configure Fields', detail: 'Manage sign-up form fields and interests', icon: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }, color: '#7C3AED', background: '#F2ECFF' },
  { title: 'Send Notifications', detail: 'Broadcast messages to attendees', icon: { ios: 'bell', android: 'notifications', web: 'notifications' }, color: '#7C3AED', background: '#F5F0FF' },
  { title: 'Export Data', detail: 'Download attendee records as CSV', icon: { ios: 'square.and.arrow.down', android: 'download', web: 'download' }, color: '#00A878', background: '#E8FBF5' },
] as const;

export default function SuperAdminToolsScreen() {
  const { user } = useAuth();

  const exportData = async () => {
    if (!user?.token) { Alert.alert('Authentication Error', 'Please sign in again.'); return; }
    try {
      const endpoint = process.env.EXPO_PUBLIC_ADMIN_ATTENDEES_EXPORT_URL || 'https://api.lifesciencesdreamin.com/api/admin/reports/attendees/export';
      const response = await fetch(endpoint, { headers: { Accept: 'text/csv', Authorization: `Bearer ${user.token}` } });
      if (!response.ok) throw new Error(`Export failed (${response.status})`);
      const csvText = await response.text();
      if (!csvText) throw new Error('Export returned empty data.');
      if (Platform.OS === 'web') {
        const url = window.URL.createObjectURL(new Blob([csvText], { type: 'text/csv;charset=utf-8;' }));
        const link = document.createElement('a');
        link.href = url; link.download = 'attendees-report.csv'; document.body.appendChild(link); link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(url);
        Alert.alert('Success', 'Attendee report downloaded.');
        return;
      }
      const FileSystem = await import('expo-file-system/legacy');
      const Sharing = await import('expo-sharing');
      const fileUri = `${FileSystem.cacheDirectory}attendees-report.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvText, { encoding: 'utf8' });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export Attendee Report', UTI: 'public.comma-separated-values-text' });
      else Alert.alert('Export Complete', `File saved at:\n${fileUri}`);
    } catch (error) {
      Alert.alert('Export Failed', error instanceof Error ? error.message : 'Unable to export attendee data.');
    }
  };

  const pressTool = (title: string) => {
    if (title === 'Export Data') { void exportData(); return; }
    Alert.alert(title, 'This tool will be available soon.');
  };

  return <View style={styles.screen}><StatusBar style="dark" /><SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><Text style={styles.headerTitle}>Tools</Text></View>
    <View style={styles.content}><Text style={styles.title}>Tools</Text><Text style={styles.subtitle}>Admin tools & configuration</Text>
      {tools.map((tool) => <Pressable key={tool.title} accessibilityRole="button" accessibilityLabel={tool.title} onPress={() => pressTool(tool.title)} style={styles.card}><View style={[styles.iconBox, { backgroundColor: tool.background }]}><SymbolView name={tool.icon} size={19} tintColor={tool.color} /></View><View style={styles.copy}><Text style={styles.cardTitle}>{tool.title}</Text><Text style={styles.detail}>{tool.detail}</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}
    </View>
    <SuperAdminTabBar activeTab="Tools" />
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' }, headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' }, content: { flex: 1, padding: 12 }, title: { fontSize: 24, fontWeight: '800', color: '#1D2639' }, subtitle: { marginTop: 3, marginBottom: 10, fontSize: 10, color: '#718098' }, card: { minHeight: 62, marginBottom: 9, padding: 10, borderRadius: 12, alignItems: 'center', flexDirection: 'row', backgroundColor: '#FFF', shadowColor: '#34425D', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1, marginLeft: 11 }, cardTitle: { fontSize: 10, fontWeight: '800', color: '#253046' }, detail: { marginTop: 3, fontSize: 8, color: '#65758C' }, chevron: { fontSize: 20, color: '#B2BDCE' },
});
