import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';
import { useAuth } from '../../context/AuthContext';
import { adminApi, apiRequest, type RegistrationEntry } from '../../services/api';

type Metric = { label: string; detail: string; value: string; icon: 'calendar' | 'clock' | 'person.2'; color: string; route: string };
const actionItems = [
  { label: 'Create Conference', icon: { ios: 'plus', android: 'add', web: 'add' }, route: '/superadmin-events', background: '#FAF7FF', iconBackground: '#EBDDFF', iconColor: '#7C3AED' },
  { label: 'Watchlist', icon: { ios: 'clock', android: 'schedule', web: 'schedule' }, route: '/superadmin-people', background: '#FFFCF7', iconBackground: '#FBEFDF', iconColor: '#EF8600' },
  { label: 'Notifications', icon: { ios: 'bell', android: 'notifications', web: 'notifications' }, route: '/superadmin-profile', background: '#F2FCFF', iconBackground: '#D9F4FB', iconColor: '#00A5C8' },
  {
    label: 'Export Data',
    icon: { ios: 'square.and.arrow.down', android: 'download', web: 'download' },
    route: 'export',
    background: '#F2FDF9',
    iconBackground: '#DCF6ED',
    iconColor: '#00A878',
  },
] as const;

function initials(name?: string) { return (name || 'User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }

export default function SuperAdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [recent, setRecent] = useState<RegistrationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const exportData = async () => {
  if (!user?.token) {
    Alert.alert(
      'Authentication Error',
      'Please sign in again.'
    );
    return;
  }

  try {
    const endpoint =
      process.env.EXPO_PUBLIC_ADMIN_ATTENDEES_EXPORT_URL ||
      'https://api.lifesciencesdreamin.com/api/admin/reports/attendees/export';

    console.log('EXPORT URL:', endpoint);
    console.log('TOKEN EXISTS:', !!user.token);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
        Authorization: `Bearer ${user.token}`,
      },
    });

    console.log('EXPORT STATUS:', response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.log(
        'EXPORT ERROR RESPONSE:',
        errorText
      );

      throw new Error(
        `Export failed (${response.status})`
      );
    }

    const csvText = await response.text();

    console.log(
      'CSV RECEIVED:',
      csvText.substring(0, 300)
    );

    if (!csvText) {
      throw new Error(
        'Export returned empty data.'
      );
    }

    // WEB
    if (Platform.OS === 'web') {
      const blob = new Blob(
        [csvText],
        {
          type: 'text/csv;charset=utf-8;',
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;
      link.download =
        'attendees-report.csv';

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      Alert.alert(
        'Success',
        'Attendee report downloaded.'
      );

      return;
    }

    // ANDROID / IOS
    const FileSystem =
      await import('expo-file-system/legacy');

    const Sharing =
      await import('expo-sharing');

    const fileUri =
      `${FileSystem.cacheDirectory}attendees-report.csv`;

    await FileSystem.writeAsStringAsync(
  fileUri,
  csvText
);

    const canShare =
      await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(
        fileUri,
        {
          mimeType: 'text/csv',
          dialogTitle:
            'Export Attendee Report',
          UTI: 'public.comma-separated-values-text',
        }
      );
    } else {
      Alert.alert(
        'Export Complete',
        `File saved at:\n${fileUri}`
      );
    }
  } catch (requestError) {
    console.log(
      'EXPORT ERROR:',
      requestError
    );

    Alert.alert(
      'Export Failed',
      requestError instanceof Error
        ? requestError.message
        : 'Unable to export attendee data.'
    );
  }
};

  const loadDashboard = useCallback(async () => {
    if (!user?.token) { setError('Please sign in again to view the dashboard.'); setIsLoading(false); return; }
    setIsLoading(true); setError(null);
    try {
      const registrationsEndpoint = process.env.EXPO_PUBLIC_ADMIN_REGISTRATIONS_URL || '/admin/registrations';
      const [conferenceResponse, registrationResponse] = await Promise.all([
        adminApi.conferences(user.token),
        apiRequest<RegistrationEntry[] | { data?: RegistrationEntry[] }>(registrationsEndpoint, { token: user.token }),
      ]);
      const conferences = conferenceResponse.data || [];
      const registrationsPayload = registrationResponse.data;
      const registrations = Array.isArray(registrationsPayload) ? registrationsPayload : registrationsPayload?.data || [];
      const pending = registrations.filter((entry) => entry.approval_status === 'pending');
      setMetrics([
        { label: 'Active Conferences', detail: 'Currently running', value: String(conferences.filter((conference) => conference.status === 'active').length), icon: 'calendar', color: '#7C3AED', route: '/superadmin-events' },
        { label: 'Pending Approvals', detail: 'Require your attention', value: String(pending.length), icon: 'clock', color: '#F28B00', route: '/superadmin-people' },
        { label: 'Total Users', detail: 'All registered', value: String(registrations.length), icon: 'person.2', color: '#00A878', route: '/superadmin-users' },
      ]);
      setRecent([...pending, ...registrations.filter((entry) => entry.approval_status !== 'pending')].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 3));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard data.');
      setMetrics([]); setRecent([]);
    } finally { setIsLoading(false); }
  }, [user?.token]);

  useFocusEffect(useCallback(() => { void loadDashboard(); }, [loadDashboard]));

  return <View style={styles.screen}><StatusBar style="dark" /><SafeAreaView style={styles.safe}><View style={styles.header}><Text style={styles.headerTitle}>Dashboard</Text></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><Text style={styles.title}>Dashboard</Text><Text style={styles.subtitle}>Cloud Adoption Solutions</Text>{isLoading ? <View style={styles.loader}><ActivityIndicator color="#7C3AED" /></View> : error ? <Text style={styles.error}>{error}</Text> : <><View>{metrics.map((metric) => <Pressable key={metric.label} onPress={() => router.push(metric.route as never)} style={[styles.metricCard, { backgroundColor: `${metric.color}12` }]}><View style={[styles.iconBox, { backgroundColor: `${metric.color}18` }]}><SymbolView name={{ ios: metric.icon, android: metric.icon === 'person.2' ? 'group' : metric.icon, web: metric.icon === 'person.2' ? 'group' : metric.icon } as never} size={17} tintColor={metric.color} /></View><View style={styles.metricCopy}><Text style={styles.metricValue}>{metric.value}</Text><Text style={styles.metricLabel}>{metric.label}</Text><Text style={styles.metricDetail}>{metric.detail}</Text></View><Text style={[styles.chevron, { color: metric.color }]}>›</Text></Pressable>)}
  </View>
  <Text 
  style={styles.sectionTitle}>
    QUICK ACTIONS
    </Text>
    <View 
    style={styles.actions}>{actionItems.map((action) => 
    <Pressable
     key={action.label} 
     onPress={() => {
  if (action.route === 'export') {
    void exportData();
  } else {
    router.push(action.route as never);
  }
}}
     style={[styles.action, { backgroundColor: action.background }]}>
      <View style={[styles.actionIcon, { backgroundColor: action.iconBackground }]}>
        <SymbolView name={action.icon} size={27} tintColor={action.iconColor} />
      </View>
       <Text style={styles.actionText}>{action.label}</Text></Pressable>)}
       </View>
       <Text style={styles.sectionTitle}>RECENT USER ACTIVITY</Text><View style={styles.activityCard}>{recent.length === 0 ? <Text style={styles.empty}>No recent registration activity.</Text> : recent.map((entry, index) => <Pressable key={entry.id} onPress={() => router.push('/superadmin-people')} style={styles.activityRow}><View style={[styles.activityAvatar, { backgroundColor: ['#7C3AED', '#00A878', '#D97706'][index % 3] }]}><Text style={styles.activityAvatarText}>{initials(entry.user.name)}</Text></View><View style={styles.activityCopy}><Text style={styles.activityName}>{entry.user.name || 'Unnamed User'}</Text><Text style={styles.activityDetail}>{[entry.user.company_name, entry.ticket_reference].filter(Boolean).join(' · ') || entry.user.email || 'Registration submitted'}</Text></View><Text style={[styles.status, entry.approval_status === 'approved' ? styles.approved : entry.approval_status === 'rejected' ? styles.rejected : styles.pending]}>{entry.approval_status}</Text></Pressable>)}</View></>}</ScrollView><SuperAdminTabBar activeTab="Home" /></SafeAreaView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safe: { flex: 1 }, header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' }, headerTitle: { color: '#1D2639', fontSize: 13, fontWeight: '800' }, content: { padding: 12, paddingBottom: 20 }, title: { fontSize: 24, fontWeight: '800', color: '#1D2639' }, subtitle: { marginTop: 3, marginBottom: 10, fontSize: 10, color: '#718098' }, loader: { paddingVertical: 48, alignItems: 'center' }, error: { padding: 12, borderRadius: 8, color: '#C62828', backgroundColor: '#FFF0F1', fontSize: 10 }, metricCard: { minHeight: 62, marginBottom: 9, padding: 10, borderRadius: 11, flexDirection: 'row', alignItems: 'center' }, iconBox: { width: 33, height: 33, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, metricCopy: { flex: 1, marginLeft: 10 }, metricValue: { fontSize: 19, fontWeight: '800', color: '#1D2639' }, metricLabel: { fontSize: 8, fontWeight: '800', color: '#1D2639' }, metricDetail: { fontSize: 7, color: '#718098' }, chevron: { fontSize: 22 }, sectionTitle: { marginTop: 9, marginBottom: 7, fontSize: 8, fontWeight: '800', color: '#60718A' }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, action: { width: '48%', height: 170, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#34425D', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, actionIcon: { width: 74, height: 74, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, actionText: { marginTop: 17, fontSize: 11, fontWeight: '800', color: '#172238' }, activityCard: { overflow: 'hidden', borderRadius: 11, backgroundColor: '#FFF' }, empty: { padding: 17, color: '#718098', fontSize: 9, textAlign: 'center' }, activityRow: { minHeight: 52, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' }, activityAvatar: { width: 27, height: 27, borderRadius: 7, alignItems: 'center', justifyContent: 'center' }, activityAvatarText: { color: '#FFF', fontSize: 9, fontWeight: '800' }, activityCopy: { flex: 1, marginLeft: 8 }, activityName: { fontSize: 9, fontWeight: '800', color: '#253046' }, activityDetail: { marginTop: 2, fontSize: 7, color: '#718098' }, status: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 7, overflow: 'hidden', fontSize: 7, fontWeight: '800', color: '#FFF', textTransform: 'capitalize' }, pending: { backgroundColor: '#E98200' }, approved: { backgroundColor: '#00A878' }, rejected: { backgroundColor: '#E92A2A' },
});
