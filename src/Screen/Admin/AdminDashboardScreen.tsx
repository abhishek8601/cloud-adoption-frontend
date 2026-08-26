import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { adminApi, registrationApi, type RegistrationEntry } from '../../services/api';
import AdminBottomNav from './AdminBottomNav';

type MetricCardProps = {
  icon: { ios: string; android: string; web: string };
  value: string;
  title: string;
  detail: string;
  backgroundColor: string;
  tintColor: string;
  onPress?: () => void;
};

function MetricCard({ icon, value, title, detail, backgroundColor, tintColor, onPress }: MetricCardProps) {
  return (
    <Pressable
      accessibilityLabel={onPress ? `View ${title.toLowerCase()}` : undefined}
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.metricCard, { backgroundColor }]}
    >
      <View style={styles.metricIcon}>
        <SymbolView name={icon as never} size={21} tintColor={tintColor} />
      </View>
      <View style={styles.metricCopy}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={styles.metricDetail}>{detail}</Text>
      </View>
      <Text style={[styles.chevron, { color: tintColor }]}>›</Text>
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeConferenceCount, setActiveConferenceCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [attendeeCount, setAttendeeCount] = useState<number | null>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<RegistrationEntry[]>([]);

  const loadDashboardData = useCallback(async () => {
    if (!user?.token) {
      setPendingCount(null);
      setRecentRegistrations([]);
      return;
    }

    try {
      const response = await registrationApi.list(user.token);
      const registrations = response.data || [];
      const pendingEntries = registrations.filter(
        (entry) => entry.approval_status === 'pending',
      );
      setPendingCount(pendingEntries.length);
      const newestFirst = [...registrations].sort(
        (first, second) =>
          new Date(second.created_at || 0).getTime() - new Date(first.created_at || 0).getTime(),
      );
      const priorityEntries = [
        newestFirst.find((entry) => entry.approval_status === 'pending'),
        newestFirst.find((entry) => entry.approval_status === 'approved'),
      ].filter((entry): entry is RegistrationEntry => Boolean(entry));
      const additionalEntries = newestFirst.filter(
        (entry) => !priorityEntries.some((priorityEntry) => priorityEntry.id === entry.id),
      );

      setRecentRegistrations([...priorityEntries, ...additionalEntries].slice(0, 2));
    } catch {
      setPendingCount(null);
      setRecentRegistrations([]);
    }
  }, [user?.token]);

  const loadActiveConferenceCount = useCallback(async () => {
    if (!user?.token) {
      setActiveConferenceCount(null);
      return;
    }

    try {
      const response = await adminApi.conferences(user.token);
      const conferences = response.data || [];
      setActiveConferenceCount(
        conferences.filter((conference) => conference.status === 'active').length,
      );
    } catch {
      setActiveConferenceCount(null);
    }
  }, [user?.token]);

  const loadAttendeeCount = useCallback(async () => {
    if (!user?.token) {
      setAttendeeCount(null);
      return;
    }

    try {
      const response = await adminApi.conferenceAttendees(user.token);
      setAttendeeCount(response.meta?.total ?? (Array.isArray(response.data) ? response.data.length : 0));
    } catch {
      setAttendeeCount(null);
    }
  }, [user?.token]);

  useFocusEffect(
    useCallback(() => {
      void loadDashboardData();
      void loadAttendeeCount();
      void loadActiveConferenceCount();
    }, [loadActiveConferenceCount, loadAttendeeCount, loadDashboardData]),
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text 
          style={styles.headerTitle}>
            Dashboard
            </Text></View>
        <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}>

          <Text 
          style={styles.title}>
            Dashboard
            </Text>
          <Text 
          style={styles.subtitle}>
            Cloud Adoption Solutions
            </Text>

          <MetricCard icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} 
          value={activeConferenceCount === null ? '–' : String(activeConferenceCount)} title="Active Conferences"
          detail="Currently running" backgroundColor="#F2ECFF" 
          tintColor="#7C3AED"
          onPress={() => router.push('/admin-events')} />

          <MetricCard icon={{ ios: 'clock', android: 'schedule', web: 'schedule' }} 
          value={pendingCount === null ? '–' : String(pendingCount)} title="Pending Approvals" detail="Require your attention"
          backgroundColor="#FFF3E5" tintColor="#E98200"
          onPress={() => router.push('/admin-people')} />

          <MetricCard icon={{ ios: 'person.2', android: 'group', web: 'group' }} 
          value={attendeeCount === null ? '–' : String(attendeeCount)} title="Total Users" detail="All registered"
          backgroundColor="#E5F8F3" tintColor="#00A878" />

         <Text style={styles.sectionTitle}>Quick Actions</Text>

<View style={styles.actionsGrid}>
  <Pressable
    accessibilityLabel="Create conference"
    accessibilityRole="button"
    onPress={() => router.push('/admin-events')}
    style={[styles.actionCard, styles.createCard]}
  >
    <View style={[styles.actionIcon, styles.createIcon]}>
      <SymbolView
        name={{
          ios: 'plus',
          android: 'add',
          web: 'add',
        }}
        size={30}
        tintColor="#7C3AED"
      />
    </View>

    <Text style={styles.actionText}>Create Conference</Text>
  </Pressable>

  <Pressable
    accessibilityLabel="Open watchlist"
    accessibilityRole="button"
    onPress={() => router.push('/admin-people')}
    style={[styles.actionCard, styles.watchlistCard]}
  >
    <View style={[styles.actionIcon, styles.watchlistIcon]}>
      <SymbolView
        name={{
          ios: 'clock',
          android: 'schedule',
          web: 'schedule',
        }}
        size={30}
        tintColor="#E98200"
      />
    </View>

    <Text style={styles.actionText}>Watchlist</Text>
  </Pressable>

  <Pressable style={[styles.actionCard, styles.notificationCard]}>
    <View style={[styles.actionIcon, styles.notificationIcon]}>
      <SymbolView
        name={{
          ios: 'bell',
          android: 'notifications_none',
          web: 'notifications_none',
        }}
        size={30}
        tintColor="#009BC2"
      />
    </View>

    <Text style={styles.actionText}>Notifications</Text>
  </Pressable>

  <Pressable style={[styles.actionCard, styles.exportCard]}>
    <View style={[styles.actionIcon, styles.exportIcon]}>
      <SymbolView
        name={{
          ios: 'arrow.down.to.line',
          android: 'file_download',
          web: 'download',
        }}
        size={30}
        tintColor="#00A878"
      />
    </View>

    <Text style={styles.actionText}>Export Data</Text>
  </Pressable>
</View>

          <Text style={styles.sectionTitle}>Recent Registrations</Text>
          {recentRegistrations.map((registration) => {
            const name = registration.user?.name || 'Attendee';
            const initials = name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            const status = registration.approval_status || 'pending';
            const registrationDetail = [registration.user?.company_name, registration.ticket_reference]
              .filter(Boolean)
              .join(' - ');

            return (
              <View key={registration.id} style={styles.userRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{name}</Text>
                  <Text style={styles.userDetail}>{registrationDetail || 'Registration pending'}</Text>
                </View>
                <Text
                  style={[
                    styles.pending,
                    status === 'approved' && styles.approvedRegistration,
                    status === 'rejected' && styles.rejectedRegistration,
                  ]}
                >
                  {status[0].toUpperCase() + status.slice(1)}
                </Text>
              </View>
            );
          })}
          {pendingCount !== null && recentRegistrations.length === 0 ? (
            <View style={styles.emptyRegistrations}>
              <Text style={styles.emptyRegistrationsText}>No registrations yet.</Text>
            </View>
          ) : null}
          {/* Legacy mock rows removed; registrations are rendered from the API above.
            <View key={name} style={styles.userRow}><View style={styles.avatar}><Text style={styles.avatarText}>{name.split(' ').map((part) => part[0]).join('')}</Text></View><View style={styles.userInfo}><Text style={styles.userName}>{name}</Text><Text style={styles.userDetail}>Capgemini · EB-2025-4821</Text></View><Text style={styles.pending}>Pending</Text></View>
          */}
        </ScrollView>

        <AdminBottomNav active="home" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: 
  { flex: 1, 
    backgroundColor: '#F7F8FC' }, 
    
  safeArea: { 
    flex: 1 

  }, 
  header: { 
    height: 52, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFFFFF' },

  headerTitle: { 
    color: '#1D2639', 
    fontSize: 13, 
    fontWeight: '800' }, 

  content: { 
    padding: 13, 
    paddingBottom: 78 },

  title: { 
    color: '#1D2639', 
    fontSize: 24, 
    fontWeight: '800' },

  subtitle: { 
    color: '#718098', 
    fontSize: 10, 
    marginBottom: 10 }, 
  metricCard: { 
    height: 68, 
    marginBottom: 9, 
    borderRadius: 12, 
    padding: 11, 
    flexDirection: 'row', 
    alignItems: 'center' }, 

  metricIcon: { 
    width: 37, 
    height: 37, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFFFFF' }, 
  metricCopy: { 
    flex: 1, 
    marginLeft: 10 },

  metricValue: { 
    color: '#1E273B', 
    fontSize: 21, 
    fontWeight: '800' }, 

  metricTitle: { 
    color: '#263147', 
    fontSize: 11, 
    fontWeight: '800' },

  metricDetail: { 
    color: '#708098', 
    fontSize: 9 }, 

  chevron: { 
    fontSize: 27
     },

  sectionTitle: { 
    color: '#62718A', 
    fontSize: 10, 
    fontWeight: '800', 
    textTransform: 'uppercase', 
    letterSpacing: 0.7, 
    marginTop: 13, 
    marginBottom: 8 },

  actionsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  rowGap: 16,
},

actionCard: {
  width: '48.5%',
  height: 152,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 3,
},

actionIcon: {
  width: 66,
  height: 66,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
},

actionText: {
  color: '#161C2E',
  fontSize: 10,
  fontWeight: '800',
  textAlign: 'center',
},

createCard: {
  backgroundColor: '#F8F6FF',
},

createIcon: {
  backgroundColor: '#EDE5FF',
},

watchlistCard: {
  backgroundColor: '#FAF7F2',
},

watchlistIcon: {
  backgroundColor: '#F8ECDF',
},

notificationCard: {
  backgroundColor: '#F0FAFC',
},

notificationIcon: {
  backgroundColor: '#DDF2F7',
},

exportCard: {
  backgroundColor: '#F0FAF7',
},

exportIcon: {
  backgroundColor: '#DDF2ED',
},
  
  
  userRow: { 
    height: 51, 
    marginBottom: 2, 
    paddingHorizontal: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF' }, 

  avatar: { 
    width: 27, 
    height: 27, 
    borderRadius: 7, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#00A878' }, 

  avatarText: { 
    color: '#FFFFFF', 
    fontSize: 8, 
    fontWeight: '800' },

  userInfo: { 
    flex: 1, 
    marginLeft: 8 }, 

  userName: { 
    color: '#253046', 
    fontSize: 11, 
    fontWeight: '800' },

  userDetail: { 
    color: '#738198', 
    fontSize: 8 }, 

  pending: { 
    overflow: 'hidden', 
    borderRadius: 8, 
    padding: 5, 
    color: '#FFFFFF', 
    fontSize: 8, 
    fontWeight: '800', 
    backgroundColor: '#E98200' }, 

  approvedRegistration: { backgroundColor: '#00A878' },
  rejectedRegistration: { backgroundColor: '#E92A2A' },
  emptyRegistrations: { paddingVertical: 18, alignItems: 'center', backgroundColor: '#FFFFFF' },
  emptyRegistrationsText: { color: '#738198', fontSize: 11 },

  tabBar: { 
    height: 62, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    backgroundColor: '#000000' },

  activeTab: { 
    minWidth: 43, 
    borderRadius: 17, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    alignItems: 'center', 
    backgroundColor: '#7C3AED' },

  activeTabText: { color: '#FFFFFF', fontSize: 8 }, 
  tabText: { color: '#FFFFFF', fontSize: 9 },
});
