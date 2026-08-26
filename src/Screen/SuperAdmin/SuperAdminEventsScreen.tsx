import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';

type Conference = {
  active: boolean;
  attendees: number;
  date: string;
  location: string;
  sessions: number;
  title: string;
};

const conferences: Conference[] = [
  { active: true, attendees: 247, date: 'Sep 15–17, 2025', location: 'Hyatt Regency San Francisco · San Francisco, CA', sessions: 12, title: 'Cloud Adoption Summit 2025' },
  { active: false, attendees: 0, date: 'Dec 1–3, 2025', location: 'Venetian Expo · Las Vegas, NV', sessions: 0, title: 'AWS re:Invent Partner Day 2025' },
];

function ConferenceCard({ conference }: { conference: Conference }) {
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conference.title);

  if (deleted) return null;

  const statusColor = conference.active ? '#00A878' : '#718098';
  return (
    <View style={[styles.card, { borderTopColor: statusColor }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.status, { backgroundColor: statusColor }]}>{conference.active ? 'Active' : 'Inactive'}</Text>
        <View style={styles.cardActions}>
          <Pressable accessibilityLabel={`Edit ${title}`} onPress={() => setEditing((value) => !value)} style={styles.editButton}>
            <SymbolView name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }} size={14} tintColor="#7C3AED" />
          </Pressable>
          <Pressable accessibilityLabel={`Delete ${title}`} onPress={() => setDeleted(true)} style={styles.deleteButton}>
            <SymbolView name={{ ios: 'trash', android: 'delete', web: 'delete' }} size={14} tintColor="#F05262" />
          </Pressable>
        </View>
      </View>
      {editing ? <TextInput accessibilityLabel="Conference title" autoFocus value={title} onChangeText={setTitle} style={styles.titleInput} /> : <Text style={styles.cardTitle}>{title}</Text>}
      <View style={styles.detailRow}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={11} tintColor="#65758C" /><Text style={styles.detailText}>{conference.date}</Text></View>
      <View style={styles.detailRow}><SymbolView name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} size={11} tintColor="#65758C" /><Text style={styles.detailText}>{conference.location}</Text></View>
      <View style={styles.divider} />
      <View style={styles.stats}><Text style={styles.statValue}>{conference.attendees} <Text style={styles.statLabel}>Attendees</Text></Text><Text style={styles.statValue}>{conference.sessions} <Text style={styles.statLabel}>Sessions</Text></Text></View>
    </View>
  );
}

export default function SuperAdminEventsScreen() {
  const router = useRouter();
  const [newConferenceVisible, setNewConferenceVisible] = useState(false);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}><Text style={styles.headerTitle}>Conferences</Text></View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View><Text style={styles.title}>Conferences</Text><Text style={styles.subtitle}>2 conferences</Text></View>
            <View style={styles.topActions}>
              <Pressable accessibilityLabel="View agenda" style={styles.agendaButton}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={10} tintColor="#7040DF" /><Text style={styles.agendaText}>Agenda</Text></Pressable>
              <Pressable accessibilityLabel="Create new conference" onPress={() => setNewConferenceVisible(true)} style={styles.newButton}><Text style={styles.newText}>+ New</Text></Pressable>
            </View>
          </View>
          {newConferenceVisible && <ConferenceCard conference={{ active: false, attendees: 0, date: 'Choose event dates', location: 'Choose a venue', sessions: 0, title: 'New Conference' }} />}
          {conferences.map((conference) => <ConferenceCard conference={conference} key={conference.title} />)}
        </View>
        <SuperAdminTabBar activeTab="Events" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 },
  header: { height: 52, alignItems: 'center', justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF', backgroundColor: '#FFF' }, headerTitle: { color: '#1E273B', fontSize: 13, fontWeight: '800' },
  content: { flex: 1, padding: 12 }, titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }, title: { color: '#1D2639', fontSize: 23, fontWeight: '800' }, subtitle: { marginTop: 3, color: '#718098', fontSize: 10 }, topActions: { flexDirection: 'row', gap: 7 },
  agendaButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#F0E9FF' }, agendaText: { color: '#7040DF', fontSize: 10, fontWeight: '700' }, newButton: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#6D2DE6' }, newText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  card: { marginBottom: 11, borderTopWidth: 4, borderRadius: 12, padding: 11, backgroundColor: '#FFF', shadowColor: '#34425D', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, status: { overflow: 'hidden', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, color: '#FFF', fontSize: 8, fontWeight: '800' }, cardActions: { flexDirection: 'row', gap: 7 }, editButton: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#F0E9FF' }, deleteButton: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#FFF0F1' }, cardTitle: { marginTop: 8, color: '#202B40', fontSize: 11, fontWeight: '800' }, titleInput: { height: 31, marginTop: 7, paddingHorizontal: 8, borderWidth: 1, borderRadius: 6, borderColor: '#7C3AED', color: '#202B40', fontSize: 11, fontWeight: '800' }, detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 }, detailText: { color: '#65758C', fontSize: 9 }, divider: { height: StyleSheet.hairlineWidth, marginVertical: 9, backgroundColor: '#E5E9F0' }, stats: { flexDirection: 'row', gap: 18 }, statValue: { color: '#1F2A40', fontSize: 17, fontWeight: '800' }, statLabel: { color: '#65758C', fontSize: 8, fontWeight: '400' },
  tabBar: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#000' }, tab: { flex: 1, alignItems: 'center', paddingVertical: 5 }, activeTab: { marginHorizontal: 2, borderRadius: 17, backgroundColor: '#7C3AED' }, tabText: { marginTop: 2, color: '#FFF', fontSize: 7, fontWeight: '700' },
});
