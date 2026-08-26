import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';
import { apiRequest } from '../../services/api';

type Conference = { id: number; active: boolean; date: string; location: string; title: string };
type ConferenceResponse = { id: number; title?: string; conference_date?: string; venue_name?: string; venue_address?: string; venue_city?: string; venue_state?: string; status?: string };

function toConference(event: ConferenceResponse): Conference {
  const date = event.conference_date ? new Date(`${event.conference_date}T00:00:00`) : null;
  const location = [event.venue_name, event.venue_address, [event.venue_city, event.venue_state].filter(Boolean).join(', ')].filter(Boolean).join(' · ') || 'Venue not available';
  return { id: event.id, title: event.title || 'Untitled conference', date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : event.conference_date || 'Date not available', location, active: event.status?.toLowerCase() === 'active' };
}

function ConferenceCard({ conference, onView }: { conference: Conference; onView: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conference.title);
  const statusColor = conference.active ? '#00A878' : '#718098';
  return <View style={[styles.card, { borderTopColor: statusColor }]}>
    <View style={styles.cardHeader}><Text style={[styles.status, { backgroundColor: statusColor }]}>{conference.active ? 'Active' : 'Inactive'}</Text><View style={styles.cardActions}><Pressable accessibilityLabel={`View ${title} details`} onPress={onView} style={styles.viewButton}><SymbolView name={{ ios: 'eye', android: 'visibility', web: 'visibility' }} size={13} tintColor="#2563EB" /></Pressable><Pressable accessibilityLabel={`Edit ${title}`} onPress={() => setEditing((value) => !value)} style={styles.editButton}><SymbolView name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }} size={14} tintColor="#7C3AED" /></Pressable></View></View>
    {editing ? <TextInput accessibilityLabel="Conference title" autoFocus value={title} onChangeText={setTitle} style={styles.titleInput} /> : <Text style={styles.cardTitle}>{title}</Text>}
    <View style={styles.detailRow}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={11} tintColor="#65758C" /><Text style={styles.detailText}>{conference.date}</Text></View>
    <View style={styles.detailRow}><SymbolView name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} size={11} tintColor="#65758C" /><Text style={styles.detailText}>{conference.location}</Text></View>
  </View>;
}

export default function SuperAdminEventsScreen() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  useEffect(() => {
    const loadConferences = async () => {
      setIsLoading(true); setError(null);
      try {
        const response = await apiRequest<ConferenceResponse[]>(process.env.EXPO_PUBLIC_CONFERENCES_URL || '/conferences');
        setConferences(Array.isArray(response.data) ? response.data.map(toConference) : []);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load conferences.');
      } finally { setIsLoading(false); }
    };
    void loadConferences();
  }, []);

  return <View style={styles.screen}><StatusBar style="dark" /><SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><Text style={styles.headerTitle}>Conferences</Text></View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.titleRow}><Text style={styles.title}>Conferences</Text><Text style={styles.subtitle}>{isLoading ? 'Loading conferences...' : `${conferences.length} conferences`}</Text></View>
      {isLoading ? <View style={styles.loader}><ActivityIndicator color="#7C3AED" /></View> : error ? <Text style={styles.error}>{error}</Text> : conferences.length === 0 ? <Text style={styles.empty}>No active or inactive conferences found.</Text> : conferences.map((conference) => <ConferenceCard conference={conference} onView={() => setSelectedConference(conference)} key={conference.id} />)}
    </ScrollView>
    <Modal visible={Boolean(selectedConference)} transparent animationType="fade" onRequestClose={() => setSelectedConference(null)}><View style={styles.modalOverlay}><View style={styles.modal}><Text style={styles.modalTitle}>Conference Details</Text>{selectedConference ? <View style={styles.details}><Text style={styles.detailLabel}>NAME</Text><Text style={styles.detailValue}>{selectedConference.title}</Text><Text style={styles.detailLabel}>STATUS</Text><Text style={styles.detailValue}>{selectedConference.active ? 'Active' : 'Inactive'}</Text><Text style={styles.detailLabel}>DATE</Text><Text style={styles.detailValue}>{selectedConference.date}</Text><Text style={styles.detailLabel}>VENUE</Text><Text style={styles.detailValue}>{selectedConference.location}</Text></View> : null}<Pressable onPress={() => setSelectedConference(null)} style={styles.closeButton}><Text style={styles.closeButtonText}>Close</Text></Pressable></View></View></Modal>
    <SuperAdminTabBar activeTab="Events" />
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 },
  header: { height: 52, alignItems: 'center', justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF', backgroundColor: '#FFF' }, headerTitle: { color: '#1E273B', fontSize: 13, fontWeight: '800' },
  content: { flexGrow: 1, padding: 12, paddingBottom: 20 }, titleRow: { marginBottom: 10 }, title: { color: '#1D2639', fontSize: 23, fontWeight: '800' }, subtitle: { marginTop: 3, color: '#718098', fontSize: 10 },
  card: { marginBottom: 11, borderTopWidth: 4, borderRadius: 12, padding: 11, backgroundColor: '#FFF', shadowColor: '#34425D', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, status: { overflow: 'hidden', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, color: '#FFF', fontSize: 8, fontWeight: '800' }, cardActions: { flexDirection: 'row', gap: 6 }, viewButton: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#EAF2FF' }, editButton: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#F0E9FF' }, cardTitle: { marginTop: 8, color: '#202B40', fontSize: 11, fontWeight: '800' }, titleInput: { height: 31, marginTop: 7, paddingHorizontal: 8, borderWidth: 1, borderRadius: 6, borderColor: '#7C3AED', color: '#202B40', fontSize: 11, fontWeight: '800' }, detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 }, detailText: { flex: 1, color: '#65758C', fontSize: 9 },
  loader: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center' }, error: { marginTop: 12, color: '#C62828', fontSize: 11 }, empty: { paddingVertical: 28, color: '#65758C', fontSize: 11, textAlign: 'center' },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22, backgroundColor: 'rgba(0,0,0,.48)' }, modal: { width: '100%', maxWidth: 330, padding: 16, borderRadius: 12, backgroundColor: '#FFF' }, modalTitle: { color: '#1D2639', fontSize: 14, fontWeight: '800' }, details: { marginTop: 12 }, detailLabel: { marginTop: 10, color: '#65758C', fontSize: 8, fontWeight: '800' }, detailValue: { marginTop: 3, color: '#253046', fontSize: 11 }, closeButton: { height: 34, marginTop: 18, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' }, closeButtonText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
});
