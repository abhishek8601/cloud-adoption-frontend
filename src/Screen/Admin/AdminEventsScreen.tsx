// import { SymbolView } from 'expo-symbols';
// import { StatusBar } from 'expo-status-bar';
// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AdminBottomNav from './AdminBottomNav';

// type ConferenceCardProps = {
//   active: boolean;
//   title: string;
//   date: string;
//   location: string;
//   attendeeCount: number;
//   sessionCount: number;
// };

// function ConferenceCard({
//   active,
//   title,
//   date,
//   location,
//   attendeeCount,
//   sessionCount,
// }: ConferenceCardProps) {
//   const [deleted, setDeleted] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [editableTitle, setEditableTitle] = useState(title);
//   const accentColor = active ? '#00A878' : '#718098';

//   if (deleted) return null;

//   return (
//     <View style={[styles.card, { borderTopColor: accentColor }]}>
//       <View style={styles.cardHeader}>
//         <Text style={[styles.statusPill, { backgroundColor: accentColor }]}>
//           {active ? 'Active' : 'Inactive'}
//         </Text>
//         <View style={styles.cardActions}>
//           <Pressable
//             accessibilityLabel={`Edit ${title}`}
//             accessibilityRole="button"
//             onPress={() => setEditing((current) => !current)}
//             style={styles.iconAction}
//           >
//             <SymbolView
//               name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
//               size={14}
//               tintColor="#7C3AED"
//             />
//           </Pressable>
//           <Pressable
//             accessibilityLabel={`Delete ${title}`}
//             accessibilityRole="button"
//             onPress={() => setDeleted(true)}
//             style={styles.deleteAction}
//           >
//             <SymbolView
//               name={{ ios: 'trash', android: 'delete', web: 'delete' }}
//               size={14}
//               tintColor="#F05262"
//             />
//           </Pressable>
//         </View>
//       </View>

//       {editing ? <TextInput accessibilityLabel={`Conference title for ${title}`} value={editableTitle} onChangeText={setEditableTitle} autoFocus style={styles.editTitleInput} /> : <Text style={styles.cardTitle}>{editableTitle}</Text>}
//       <View style={styles.detailRow}>
//         <SymbolView
//           name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
//           size={11}
//           tintColor="#65758C"
//         />
//         <Text style={styles.detailText}>{date}</Text>
//       </View>
//       <View style={styles.detailRow}>
//         <SymbolView
//           name={{
//             ios: 'mappin.and.ellipse',
//             android: 'location_on',
//             web: 'location_on',
//           }}
//           size={11}
//           tintColor="#65758C"
//         />
//         <Text style={styles.detailText}>{location}</Text>
//       </View>

//       <View style={styles.divider} />
//       <View style={styles.stats}>
//         <Text style={styles.statValue}>
//           {attendeeCount} <Text style={styles.statLabel}>Attendees</Text>
//         </Text>
//         <Text style={styles.statValue}>
//           {sessionCount} <Text style={styles.statLabel}>Sessions</Text>
//         </Text>
//       </View>
//     </View>
//   );
// }

// export default function AdminEventsScreen() {
//   const router = useRouter();
//   const [newConferenceVisible, setNewConferenceVisible] = useState(false);

//   return (
//     <View style={styles.screen}>
//       <StatusBar style="dark" />
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Conferences</Text>
//         </View>

//         <View style={styles.content}>
//           <View style={styles.titleRow}>
//             <View>
//               <Text style={styles.title}>Conferences</Text>
//               <Text style={styles.subtitle}>2 conferences</Text>
//             </View>
//             <View style={styles.topActions}>
//               <Pressable style={styles.agendaButton}>
//                 <Text style={styles.agendaText}>▦ Agenda</Text>
//               </Pressable>
//               <Pressable accessibilityLabel="Create new conference" accessibilityRole="button" onPress={() => setNewConferenceVisible(true)} style={styles.newButton}>
//                 <Text style={styles.newText}>＋ New</Text>
//               </Pressable>
//             </View>
//           </View>

//           {newConferenceVisible ? <ConferenceCard active={false} attendeeCount={0} date="Choose event dates" location="Choose a venue" sessionCount={0} title="New Conference" /> : null}
//           <ConferenceCard
//             active
//             attendeeCount={247}
//             date="Sep 15–17, 2025"
//             location="Hyatt Regency San Francisco · San Francisco, CA"
//             sessionCount={12}
//             title="Cloud Adoption Summit 2025"
//           />
//           <ConferenceCard
//             active={false}
//             attendeeCount={0}
//             date="Dec 1–3, 2025"
//             location="Venetian Expo · Las Vegas, NV"
//             sessionCount={0}
//             title="AWS re:Invent Partner Day 2025"
//           />
//         </View>

//         <AdminBottomNav active="events" />
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#F7F8FC',
//   },
//   safeArea: { flex: 1 },
//   header: {
//     height: 52,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#E4E8EF',
//   },
//   headerTitle: { color: '#1E273B', fontSize: 13, fontWeight: '800' },
//   content: { flex: 1, padding: 12 },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   title: { color: '#1D2639', fontSize: 23, fontWeight: '800' },
//   subtitle: { color: '#718098', fontSize: 10, marginTop: 3 },
//   topActions: { flexDirection: 'row', gap: 7 },
//   agendaButton: {
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: '#F0E9FF',
//   },
//   agendaText: { color: '#7040DF', fontSize: 10, fontWeight: '700' },
//   newButton: {
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: '#6D2DE6',
//   },
//   newText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
//   card: {
//     marginBottom: 11,
//     borderTopWidth: 4,
//     borderRadius: 12,
//     padding: 11,
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#34425D',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   statusPill: {
//     overflow: 'hidden',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     color: '#FFFFFF',
//     fontSize: 8,
//     fontWeight: '800',
//   },
//   cardActions: { flexDirection: 'row', gap: 7 },
//   iconAction: {
//     width: 25,
//     height: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 7,
//     backgroundColor: '#F0E9FF',
//   },
//   deleteAction: {
//     width: 25,
//     height: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 7,
//     backgroundColor: '#FFF0F1',
//   },
//   cardTitle: { color: '#202B40', fontSize: 11, fontWeight: '800', marginTop: 8 },
//   editTitleInput: { height: 31, marginTop: 7, paddingHorizontal: 8, borderWidth: 1, borderRadius: 6, borderColor: '#7C3AED', color: '#202B40', fontSize: 11, fontWeight: '800' },
//   detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 },
//   detailText: { color: '#65758C', fontSize: 9 },
//   divider: {
//     height: StyleSheet.hairlineWidth,
//     marginVertical: 9,
//     backgroundColor: '#E5E9F0',
//   },
//   stats: { flexDirection: 'row', gap: 18 },
//   statValue: { color: '#1F2A40', fontSize: 17, fontWeight: '800' },
//   statLabel: { color: '#65758C', fontSize: 8, fontWeight: '400' },
//   tabBar: {
//     height: 56,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     backgroundColor: '#000000',
//   },
//   tab: { paddingHorizontal: 7, paddingVertical: 7 },
//   activeTab: {
//     borderRadius: 16,
//     paddingHorizontal: 12,
//     paddingVertical: 7,
//     backgroundColor: '#7C3AED',
//   },
//   tabText: { color: '#FFFFFF', fontSize: 9 },
//   activeTabText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
// }); 




// import * as DocumentPicker from 'expo-document-picker';
// import { useRouter } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { SymbolView } from 'expo-symbols';
// import { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '../../context/AuthContext';
// import { adminApi, agendaApi, type AgendaItem, type AgendaPayload, type ConferenceInfo, type ConferencePayload } from '../../services/api';
// import AdminBottomNav from './AdminBottomNav';

// const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// const EMPTY_FORM = {
//   title: '',
//   conference_date: '',
//   venue_name: '',
//   venue_address: '',
//   venue_city: '',
//   venue_state: '',
//   active_start_date: '',
//   active_end_date: '',
//   google_map_url: '',
//   status: 'active' as 'active' | 'inactive',
// };

// const EMPTY_AGENDA_FORM: AgendaPayload = {
//   session_name: '',
//   presenter: '',
//   session_date: '',
//   duration: '',
//   place: '',
//   room: '',
// };

// type ConferenceCardProps = {
//   conference: ConferenceInfo;
//   onEdit: () => void;
//   onDelete: () => void;
//   onToggleStatus: () => void;
//   onUploadTickets: () => void;
//   onManageAgenda: () => void;
//   uploading: boolean;
// };

// function ConferenceCard({ conference, onEdit, onDelete, onToggleStatus, onUploadTickets, onManageAgenda, uploading }: ConferenceCardProps) {
//   const active = conference.status === 'active';
//   const accentColor = active ? '#00A878' : '#718098';
//   const dateLabel = conference.conference_date
//     ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
//       new Date(`${conference.conference_date}T00:00:00`),
//     )
//     : '—';
//   const location = [conference.venue_name, conference.venue_city, conference.venue_state].filter(Boolean).join(' · ') || '—';

//   return (
//     <View style={[styles.card, { borderTopColor: accentColor }]}>
//       <View style={styles.cardHeader}>
//         <Pressable accessibilityLabel={`Toggle status for ${conference.title}`} onPress={onToggleStatus}>
//           <Text style={[styles.statusPill, { backgroundColor: accentColor }]}>
//             {active ? 'Active' : 'Inactive'}
//           </Text>
//         </Pressable>
//         <View style={styles.cardActions}>
//           <Pressable
//             accessibilityLabel={`Manage agenda for ${conference.title}`}
//             accessibilityRole="button"
//             onPress={onManageAgenda}
//             style={styles.iconAction}
//           >
//             <SymbolView
//               name={{ ios: 'list.bullet', android: 'list', web: 'list' }}
//               size={14}
//               tintColor="#7C3AED"
//             />
//           </Pressable>
//           <Pressable
//             accessibilityLabel={`Upload tickets for ${conference.title}`}
//             accessibilityRole="button"
//             onPress={onUploadTickets}
//             style={styles.iconAction}
//           >
//             {uploading ? (
//               <ActivityIndicator size="small" color="#7C3AED" />
//             ) : (
//               <SymbolView
//                 name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
//                 size={14}
//                 tintColor="#7C3AED"
//               />
//             )}
//           </Pressable>
//           <Pressable
//             accessibilityLabel={`Edit ${conference.title}`}
//             accessibilityRole="button"
//             onPress={onEdit}
//             style={styles.iconAction}
//           >
//             <SymbolView
//               name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
//               size={14}
//               tintColor="#7C3AED"
//             />
//           </Pressable>
//           <Pressable
//             accessibilityLabel={`Delete ${conference.title}`}
//             accessibilityRole="button"
//             onPress={onDelete}
//             style={styles.deleteAction}
//           >
//             <SymbolView
//               name={{ ios: 'trash', android: 'delete', web: 'delete' }}
//               size={14}
//               tintColor="#F05262"
//             />
//           </Pressable>
//         </View>
//       </View>

//       <Text style={styles.cardTitle}>{conference.title}</Text>
//       <View style={styles.detailRow}>
//         <SymbolView
//           name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
//           size={11}
//           tintColor="#65758C"
//         />
//         <Text style={styles.detailText}>{dateLabel}</Text>
//       </View>
//       <View style={styles.detailRow}>
//         <SymbolView
//           name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
//           size={11}
//           tintColor="#65758C"
//         />
//         <Text style={styles.detailText}>{location}</Text>
//       </View>

//       <View style={styles.divider} />
//       <View style={styles.stats}>
//         <Text style={styles.statValue}>
//           {conference.active_start_date || '—'} <Text style={styles.statLabel}>Active From</Text>
//         </Text>
//         <Text style={styles.statValue}>
//           {conference.active_end_date || '—'} <Text style={styles.statLabel}>Active Until</Text>
//         </Text>
//       </View>
//     </View>
//   );
// }

// function FormField({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   multiline,
// }: {
//   label: string;
//   value: string;
//   onChangeText: (v: string) => void;
//   placeholder?: string;
//   multiline?: boolean;
// }) {
//   return (
//     <View style={styles.formField}>
//       <Text style={styles.formLabel}>{label}</Text>
//       <TextInput
//         autoCapitalize="none"
//         multiline={multiline}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         placeholderTextColor="#9CA5B5"
//         style={[styles.formInput, multiline && styles.formInputMultiline]}
//         value={value}
//       />
//     </View>
//   );
// }

// export default function AdminEventsScreen() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [conferences, setConferences] = useState<ConferenceInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [listError, setListError] = useState('');

//   const [formVisible, setFormVisible] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [form, setForm] = useState({ ...EMPTY_FORM });
//   const [formError, setFormError] = useState('');
//   const [saving, setSaving] = useState(false);
//   const [uploadingId, setUploadingId] = useState<number | null>(null);

//   // Agenda management state
//   const [agendaConference, setAgendaConference] = useState<ConferenceInfo | null>(null);
//   const [agendas, setAgendas] = useState<AgendaItem[]>([]);
//   const [agendaLoading, setAgendaLoading] = useState(false);
//   const [agendaListError, setAgendaListError] = useState('');
//   const [agendaFormVisible, setAgendaFormVisible] = useState(false);
//   const [editingAgendaId, setEditingAgendaId] = useState<number | null>(null);
//   const [agendaForm, setAgendaForm] = useState<AgendaPayload>({ ...EMPTY_AGENDA_FORM });
//   const [agendaFormError, setAgendaFormError] = useState('');
//   const [agendaSaving, setAgendaSaving] = useState(false);

//   const setAgendaField = (key: keyof AgendaPayload) => (value: string) =>
//     setAgendaForm((current) => ({ ...current, [key]: value }));

//   const setField = (key: keyof typeof EMPTY_FORM) => (value: string) =>
//     setForm((current) => ({ ...current, [key]: value }));

//   const load = useCallback(async () => {
//     if (!user?.token) return;
//     setLoading(true);
//     try {
//       const res = await adminApi.conferences(user.token);
//       setConferences(res.data || []);
//       setListError('');
//     } catch (e) {
//       setListError(e instanceof Error ? e.message : 'Failed to load conferences.');
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.token]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const openCreate = () => {
//     setEditingId(null);
//     setForm({ ...EMPTY_FORM });
//     setFormError('');
//     setFormVisible(true);
//   };

//   const openEdit = (conference: ConferenceInfo) => {
//     setEditingId(conference.id);
//     setForm({
//       title: conference.title || '',
//       conference_date: conference.conference_date || '',
//       venue_name: conference.venue_name || '',
//       venue_address: conference.venue_address || '',
//       venue_city: conference.venue_city || '',
//       venue_state: conference.venue_state || '',
//       active_start_date: conference.active_start_date || '',
//       active_end_date: conference.active_end_date || '',
//       google_map_url: conference.google_map_url || '',
//       status: conference.status === 'inactive' ? 'inactive' : 'active',
//     });
//     setFormError('');
//     setFormVisible(true);
//   };

//   const validateForm = (): string => {
//     if (
//       !form.title || !form.conference_date || !form.venue_name || !form.venue_address ||
//       !form.venue_city || !form.venue_state || !form.active_start_date ||
//       !form.active_end_date || !form.google_map_url
//     ) {
//       return 'Please fill in all fields — every field is required.';
//     }
//     if (
//       !DATE_PATTERN.test(form.conference_date) ||
//       !DATE_PATTERN.test(form.active_start_date) ||
//       !DATE_PATTERN.test(form.active_end_date)
//     ) {
//       return 'Dates must be in YYYY-MM-DD format (e.g. 2026-09-15).';
//     }
//     if (form.active_end_date < form.active_start_date) {
//       return 'Active End Date cannot be before Active Start Date.';
//     }
//     if (form.conference_date < form.active_start_date) {
//       return 'Conference Date cannot be before Active Start Date.';
//     }
//     if (!/^https?:\/\//.test(form.google_map_url)) {
//       return 'Google Maps link must be a full URL starting with https://';
//     }
//     return '';
//   };

//   const saveConference = async () => {
//     if (!user?.token) return;
//     const validationError = validateForm();
//     if (validationError) {
//       setFormError(validationError);
//       return;
//     }
//     setFormError('');
//     setSaving(true);
//     try {
//       const payload: ConferencePayload = { ...form };
//       if (editingId) {
//         await adminApi.updateConference(user.token, editingId, payload);
//       } else {
//         await adminApi.createConference(user.token, payload);
//       }
//       setFormVisible(false);
//       await load();
//     } catch (e) {
//       setFormError(e instanceof Error ? e.message : 'Failed to save conference.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const confirmDelete = (conference: ConferenceInfo) => {
//     Alert.alert(
//       'Delete Conference',
//       `Delete "${conference.title}"? This cannot be undone.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             if (!user?.token) return;
//             try {
//               await adminApi.deleteConference(user.token, conference.id);
//               await load();
//             } catch (e) {
//               Alert.alert('Error', e instanceof Error ? e.message : 'Failed to delete.');
//             }
//           },
//         },
//       ],
//     );
//   };

//   const toggleStatus = async (conference: ConferenceInfo) => {
//     if (!user?.token) return;
//     const next = conference.status === 'active' ? 'inactive' : 'active';
//     try {
//       await adminApi.updateConferenceStatus(user.token, conference.id, next);
//       await load();
//     } catch (e) {
//       Alert.alert('Error', e instanceof Error ? e.message : 'Failed to update status.');
//     }
//   };

//   const uploadTickets = async (conference: ConferenceInfo) => {
//     if (!user?.token) return;
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: [
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//           'application/vnd.ms-excel',
//           'text/csv',
//           'text/comma-separated-values',
//         ],
//         copyToCacheDirectory: true,
//       });
//       if (result.canceled || !result.assets?.length) return;
//       const asset = result.assets[0];

//       setUploadingId(conference.id);
//       const res = await adminApi.importTickets(user.token, conference.id, {
//         uri: asset.uri,
//         name: asset.name || 'tickets.xlsx',
//         mimeType: asset.mimeType,
//       });
//       Alert.alert('Success', res.message || 'Tickets imported successfully.');
//     } catch (e) {
//       Alert.alert('Upload Failed', e instanceof Error ? e.message : 'Could not import tickets.');
//     } finally {
//       setUploadingId(null);
//     }
//   };

//   const openAgenda = async (conference: ConferenceInfo) => {
//     setAgendaConference(conference);
//     setAgendaFormVisible(false);
//     setAgendas([]);
//     if (!user?.token) return;
//     setAgendaLoading(true);
//     try {
//       const res = await agendaApi.list(user.token, conference.id);
//       setAgendas(res.data || []);
//       setAgendaListError('');
//     } catch (e) {
//       setAgendaListError(e instanceof Error ? e.message : 'Failed to load agenda.');
//     } finally {
//       setAgendaLoading(false);
//     }
//   };

//   const openAgendaCreate = () => {
//     setEditingAgendaId(null);
//     setAgendaForm({ ...EMPTY_AGENDA_FORM });
//     setAgendaFormError('');
//     setAgendaFormVisible(true);
//   };

//   const openAgendaEdit = (agenda: AgendaItem) => {
//     setEditingAgendaId(agenda.id);
//     setAgendaForm({
//       session_name: agenda.session_name || '',
//       presenter: agenda.presenter || '',
//       session_date: agenda.session_date || '',
//       duration: String(agenda.duration || ''),
//       place: agenda.place || '',
//       room: agenda.room || '',
//     });
//     setAgendaFormError('');
//     setAgendaFormVisible(true);
//   };

//   const saveAgenda = async () => {
//     if (!user?.token || !agendaConference) return;
//     if (
//       !agendaForm.session_name || !agendaForm.presenter || !agendaForm.session_date ||
//       !agendaForm.duration || !agendaForm.place || !agendaForm.room
//     ) {
//       setAgendaFormError('Please fill in all fields — every field is required.');
//       return;
//     }
//     if (!DATE_PATTERN.test(agendaForm.session_date)) {
//       setAgendaFormError('Session date must be in YYYY-MM-DD format (e.g. 2026-09-15).');
//       return;
//     }
//     setAgendaFormError('');
//     setAgendaSaving(true);
//     try {
//       if (editingAgendaId) {
//         await agendaApi.update(user.token, agendaConference.id, editingAgendaId, agendaForm);
//       } else {
//         await agendaApi.create(user.token, agendaConference.id, agendaForm);
//       }
//       setAgendaFormVisible(false);
//       const res = await agendaApi.list(user.token, agendaConference.id);
//       setAgendas(res.data || []);
//     } catch (e) {
//       setAgendaFormError(e instanceof Error ? e.message : 'Failed to save session.');
//     } finally {
//       setAgendaSaving(false);
//     }
//   };

//   const deleteAgenda = (agenda: AgendaItem) => {
//     Alert.alert('Delete Session', `Delete "${agenda.session_name}"?`, [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           if (!user?.token || !agendaConference) return;
//           try {
//             await agendaApi.remove(user.token, agendaConference.id, agenda.id);
//             setAgendas((current) => current.filter((a) => a.id !== agenda.id));
//           } catch (e) {
//             Alert.alert('Error', e instanceof Error ? e.message : 'Failed to delete session.');
//           }
//         },
//       },
//     ]);
//   };

//   return (
//     <View style={styles.screen}>
//       <StatusBar style="dark" />
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Conferences</Text>
//         </View>

//         <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//           <View style={styles.titleRow}>
//             <View>
//               <Text style={styles.title}>Conferences</Text>
//               <Text style={styles.subtitle}>
//                 {conferences.length} conference{conferences.length === 1 ? '' : 's'}
//               </Text>
//             </View>
//             <View style={styles.topActions}>
//               <Pressable accessibilityLabel="Refresh" onPress={load} style={styles.agendaButton}>
//                 <Text style={styles.agendaText}>↻ Refresh</Text>
//               </Pressable>
//               <Pressable accessibilityLabel="Create new conference" accessibilityRole="button" onPress={openCreate} style={styles.newButton}>
//                 <Text style={styles.newText}>＋ New</Text>
//               </Pressable>
//             </View>
//           </View>

//           {loading ? <Text style={styles.stateText}>Loading conferences...</Text> : null}
//           {listError ? <Text style={[styles.stateText, { color: '#D92D3A' }]}>{listError}</Text> : null}
//           {!loading && !listError && !conferences.length ? (
//             <Text style={styles.stateText}>No conferences yet. Tap ＋ New to create one.</Text>
//           ) : null}

//           {conferences.map((conference) => (
//             <ConferenceCard
//               key={conference.id}
//               conference={conference}
//               onEdit={() => openEdit(conference)}
//               onDelete={() => confirmDelete(conference)}
//               onToggleStatus={() => toggleStatus(conference)}
//               onUploadTickets={() => uploadTickets(conference)}
//               onManageAgenda={() => openAgenda(conference)}
//               uploading={uploadingId === conference.id}
//             />
//           ))}
//         </ScrollView>

//         <Modal transparent visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
//           <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
//             <View style={styles.modalCard}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>{editingId ? 'Edit Conference' : 'Create Conference'}</Text>
//                 <Pressable accessibilityLabel="Close" onPress={() => setFormVisible(false)} hitSlop={10}>
//                   <Text style={styles.modalClose}>✕</Text>
//                 </Pressable>
//               </View>
//               <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
//                 <FormField label="Conference Name" value={form.title} onChangeText={setField('title')} placeholder="Cloud Adoption Summit 2026" />
//                 <FormField label="Conference Date" value={form.conference_date} onChangeText={setField('conference_date')} placeholder="YYYY-MM-DD" />
//                 <FormField label="Venue Name" value={form.venue_name} onChangeText={setField('venue_name')} placeholder="Hyatt Regency" />
//                 <FormField label="Venue Address" value={form.venue_address} onChangeText={setField('venue_address')} placeholder="5 Embarcadero Center" multiline />
//                 <FormField label="Venue City" value={form.venue_city} onChangeText={setField('venue_city')} placeholder="San Francisco" />
//                 <FormField label="Venue State" value={form.venue_state} onChangeText={setField('venue_state')} placeholder="CA" />
//                 <FormField label="Active Start Date" value={form.active_start_date} onChangeText={setField('active_start_date')} placeholder="YYYY-MM-DD (1 month before)" />
//                 <FormField label="Active End Date" value={form.active_end_date} onChangeText={setField('active_end_date')} placeholder="YYYY-MM-DD (1 month after)" />
//                 <FormField label="Google Maps Link" value={form.google_map_url} onChangeText={setField('google_map_url')} placeholder="https://maps.google.com/..." />

//                 <Text style={styles.formLabel}>Status</Text>
//                 <View style={styles.statusRow}>
//                   {(['active', 'inactive'] as const).map((option) => (
//                     <Pressable
//                       key={option}
//                       onPress={() => setForm((current) => ({ ...current, status: option }))}
//                       style={[styles.statusOption, form.status === option && styles.statusOptionActive]}
//                     >
//                       <Text style={[styles.statusOptionText, form.status === option && styles.statusOptionTextActive]}>
//                         {option === 'active' ? 'Active' : 'Inactive'}
//                       </Text>
//                     </Pressable>
//                   ))}
//                 </View>

//                 {formError ? <Text style={styles.formError}>{formError}</Text> : null}

//                 <Pressable disabled={saving} onPress={saveConference} style={styles.saveButton}>
//                   <Text style={styles.saveText}>
//                     {saving ? 'Saving...' : editingId ? 'Update Conference' : 'Create Conference'}
//                   </Text>
//                 </Pressable>
//               </ScrollView>
//             </View>
//           </KeyboardAvoidingView>
//         </Modal>

//         <Modal
//           transparent
//           visible={agendaConference !== null}
//           animationType="slide"
//           onRequestClose={() => setAgendaConference(null)}
//         >
//           <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
//             <View style={styles.modalCard}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle} numberOfLines={1}>
//                   Agenda · {agendaConference?.title}
//                 </Text>
//                 <Pressable accessibilityLabel="Close" onPress={() => setAgendaConference(null)} hitSlop={10}>
//                   <Text style={styles.modalClose}>✕</Text>
//                 </Pressable>
//               </View>

//               <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
//                 {!agendaFormVisible ? (
//                   <>
//                     <Pressable onPress={openAgendaCreate} style={styles.saveButton}>
//                       <Text style={styles.saveText}>＋ Add Session</Text>
//                     </Pressable>

//                     {agendaLoading ? <Text style={styles.stateText}>Loading sessions...</Text> : null}
//                     {agendaListError ? (
//                       <Text style={[styles.stateText, { color: '#D92D3A' }]}>{agendaListError}</Text>
//                     ) : null}
//                     {!agendaLoading && !agendaListError && !agendas.length ? (
//                       <Text style={styles.stateText}>No sessions yet. Tap ＋ Add Session.</Text>
//                     ) : null}

//                     {agendas.map((agenda) => (
//                       <View key={agenda.id} style={[styles.card, { borderTopColor: '#7C3AED', marginBottom: 9 }]}>
//                         <View style={styles.cardHeader}>
//                           <Text style={[styles.statusPill, { backgroundColor: '#7C3AED' }]}>
//                             {agenda.session_date}
//                           </Text>
//                           <View style={styles.cardActions}>
//                             <Pressable
//                               accessibilityLabel={`Edit ${agenda.session_name}`}
//                               onPress={() => openAgendaEdit(agenda)}
//                               style={styles.iconAction}
//                             >
//                               <SymbolView
//                                 name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
//                                 size={14}
//                                 tintColor="#7C3AED"
//                               />
//                             </Pressable>
//                             <Pressable
//                               accessibilityLabel={`Delete ${agenda.session_name}`}
//                               onPress={() => deleteAgenda(agenda)}
//                               style={styles.deleteAction}
//                             >
//                               <SymbolView
//                                 name={{ ios: 'trash', android: 'delete', web: 'delete' }}
//                                 size={14}
//                                 tintColor="#F05262"
//                               />
//                             </Pressable>
//                           </View>
//                         </View>
//                         <Text style={styles.cardTitle}>{agenda.session_name}</Text>
//                         <View style={styles.detailRow}>
//                           <SymbolView name={{ ios: 'person', android: 'person', web: 'person' }} size={11} tintColor="#65758C" />
//                           <Text style={styles.detailText}>{agenda.presenter}</Text>
//                         </View>
//                         <View style={styles.detailRow}>
//                           <SymbolView name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} size={11} tintColor="#65758C" />
//                           <Text style={styles.detailText}>{String(agenda.duration)}</Text>
//                         </View>
//                         <View style={styles.detailRow}>
//                           <SymbolView name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} size={11} tintColor="#65758C" />
//                           <Text style={styles.detailText}>{[agenda.place, agenda.room].filter(Boolean).join(' · ')}</Text>
//                         </View>
//                       </View>
//                     ))}
//                   </>
//                 ) : (
//                   <>
//                     <FormField label="Session Name" value={agendaForm.session_name} onChangeText={setAgendaField('session_name')} placeholder="Opening Keynote" />
//                     <FormField label="Presenter" value={agendaForm.presenter} onChangeText={setAgendaField('presenter')} placeholder="Dr. Angela Morrison" />
//                     <FormField label="Session Date" value={agendaForm.session_date} onChangeText={setAgendaField('session_date')} placeholder="YYYY-MM-DD (today or later)" />
//                     <FormField label="Duration" value={agendaForm.duration} onChangeText={setAgendaField('duration')} placeholder="60 min" />
//                     <FormField label="Place" value={agendaForm.place} onChangeText={setAgendaField('place')} placeholder="Hyatt Regency SF" />
//                     <FormField label="Room" value={agendaForm.room} onChangeText={setAgendaField('room')} placeholder="Main Hall" />

//                     {agendaFormError ? <Text style={styles.formError}>{agendaFormError}</Text> : null}

//                     <Pressable disabled={agendaSaving} onPress={saveAgenda} style={styles.saveButton}>
//                       <Text style={styles.saveText}>
//                         {agendaSaving ? 'Saving...' : editingAgendaId ? 'Update Session' : 'Add Session'}
//                       </Text>
//                     </Pressable>
//                     <Pressable onPress={() => setAgendaFormVisible(false)} style={[styles.saveButton, { backgroundColor: '#EFF1F7', marginTop: -10 }]}>
//                       <Text style={[styles.saveText, { color: '#64748B' }]}>Back to Sessions</Text>
//                     </Pressable>
//                   </>
//                 )}
//               </ScrollView>
//             </View>
//           </KeyboardAvoidingView>
//         </Modal>

//         <AdminBottomNav active="events" />
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#F7F8FC' },
//   safeArea: { flex: 1 },
//   header: {
//     height: 52,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#E4E8EF',
//   },
//   headerTitle: { color: '#1E273B', fontSize: 13, fontWeight: '800' },
//   content: { padding: 12, paddingBottom: 24 },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   title: { color: '#1D2639', fontSize: 23, fontWeight: '800' },
//   subtitle: { color: '#718098', fontSize: 10, marginTop: 3 },
//   topActions: { flexDirection: 'row', gap: 7 },
//   agendaButton: {
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: '#F0E9FF',
//   },
//   agendaText: { color: '#7040DF', fontSize: 10, fontWeight: '700' },
//   newButton: {
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: '#6D2DE6',
//   },
//   newText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
//   stateText: { padding: 20, textAlign: 'center', color: '#718098', fontSize: 11 },
//   card: {
//     marginBottom: 11,
//     borderTopWidth: 4,
//     borderRadius: 12,
//     padding: 11,
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#34425D',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   statusPill: {
//     overflow: 'hidden',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     color: '#FFFFFF',
//     fontSize: 8,
//     fontWeight: '800',
//   },
//   cardActions: { flexDirection: 'row', gap: 7 },
//   iconAction: {
//     width: 25,
//     height: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 7,
//     backgroundColor: '#F0E9FF',
//   },
//   deleteAction: {
//     width: 25,
//     height: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 7,
//     backgroundColor: '#FFF0F1',
//   },
//   cardTitle: { color: '#202B40', fontSize: 11, fontWeight: '800', marginTop: 8 },
//   detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 },
//   detailText: { color: '#65758C', fontSize: 9 },
//   divider: {
//     height: StyleSheet.hairlineWidth,
//     marginVertical: 9,
//     backgroundColor: '#E5E9F0',
//   },
//   stats: { flexDirection: 'row', gap: 18 },
//   statValue: { color: '#1F2A40', fontSize: 11, fontWeight: '800' },
//   statLabel: { color: '#65758C', fontSize: 8, fontWeight: '400' },
//   modalBackdrop: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(25, 34, 53, 0.38)',
//   },
//   modalCard: {
//     maxHeight: '88%',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   modalTitle: { color: '#1D2639', fontSize: 16, fontWeight: '800' },
//   modalClose: { color: '#64748B', fontSize: 16, fontWeight: '700', padding: 4 },
//   formField: { marginBottom: 10 },
//   formLabel: {
//     color: '#6B7280',
//     fontSize: 10,
//     fontWeight: '800',
//     textTransform: 'uppercase',
//     letterSpacing: 0.6,
//     marginBottom: 5,
//   },
//   formInput: {
//     height: 42,
//     borderRadius: 9,
//     borderWidth: 1,
//     borderColor: '#E3E7EF',
//     paddingHorizontal: 11,
//     backgroundColor: '#FBFBFD',
//     color: '#21243D',
//     fontSize: 13,
//   },
//   formInputMultiline: { height: 64, paddingTop: 10, textAlignVertical: 'top' },
//   statusRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
//   statusOption: {
//     flex: 1,
//     height: 38,
//     borderRadius: 9,
//     borderWidth: 1,
//     borderColor: '#E3E7EF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FBFBFD',
//   },
//   statusOptionActive: { borderColor: '#7C3AED', backgroundColor: '#F0E9FF' },
//   statusOptionText: { color: '#64748B', fontSize: 12, fontWeight: '700' },
//   statusOptionTextActive: { color: '#7C3AED', fontWeight: '800' },
//   formError: { color: '#D92D3A', fontSize: 12, marginBottom: 10, textAlign: 'center' },
//   saveButton: {
//     height: 46,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//     backgroundColor: '#6D2DE6',
//   },
//   saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
// });




import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { adminApi, agendaApi, type AgendaItem, type AgendaPayload, type ConferenceInfo, type ConferencePayload, type Ticket } from '../../services/api';
import AdminBottomNav from './AdminBottomNav';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Alert.alert is a no-op on react-native-web, so route through the browser dialogs there.
function notify(title: string, message: string) {
  if (Platform.OS === 'web') {
    (globalThis as any).alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function confirmDestructive(title: string, message: string, confirmLabel: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if ((globalThis as any).confirm(`${title}\n\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: confirmLabel, style: 'destructive', onPress: onConfirm },
    ]);
  }
}

const EMPTY_FORM = {
  title: '',
  conference_date: '',
  venue_name: '',
  venue_address: '',
  venue_city: '',
  venue_state: '',
  active_start_date: '',
  active_end_date: '',
  google_map_url: '',
  status: 'active' as 'active' | 'inactive',
};

const EMPTY_AGENDA_FORM: AgendaPayload = {
  session_name: '',
  presenter: '',
  session_date: '',
  duration: '',
  place: '',
  room: '',
};

type ConferenceCardProps = {
  conference: ConferenceInfo;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onUploadTickets: () => void;
  onViewTickets: () => void;
  onManageAgenda: () => void;
  uploading: boolean;
};

function ConferenceCard({ conference, onEdit, onDelete, onToggleStatus, onUploadTickets, onViewTickets, onManageAgenda, uploading }: ConferenceCardProps) {
  const active = conference.status === 'active';
  const accentColor = active ? '#00A878' : '#718098';
  const dateLabel = conference.conference_date
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
      new Date(`${conference.conference_date}T00:00:00`),
    )
    : '—';
  const location = [conference.venue_name, conference.venue_city, conference.venue_state].filter(Boolean).join(' · ') || '—';

  return (
    <View style={[styles.card, { borderTopColor: accentColor }]}>
      <View style={styles.cardHeader}>
        <Pressable accessibilityLabel={`Toggle status for ${conference.title}`} onPress={onToggleStatus}>
          <Text style={[styles.statusPill, { backgroundColor: accentColor }]}>
            {active ? 'Active' : 'Inactive'}
          </Text>
        </Pressable>
        <View style={styles.cardActions}>
          <Pressable
            accessibilityLabel={`Manage agenda for ${conference.title}`}
            accessibilityRole="button"
            onPress={onManageAgenda}
            style={styles.iconAction}
          >
            <SymbolView
              name={{ ios: 'list.bullet', android: 'list', web: 'list' }}
              size={14}
              tintColor="#7C3AED"
            />
          </Pressable>
          <Pressable
            accessibilityLabel={`Upload tickets for ${conference.title}`}
            accessibilityRole="button"
            onPress={onUploadTickets}
            style={styles.iconAction}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#7C3AED" />
            ) : (
              <SymbolView
                name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
                size={14}
                tintColor="#7C3AED"
              />
            )}
          </Pressable>
          <Pressable
            accessibilityLabel={`View tickets for ${conference.title}`}
            accessibilityRole="button"
            onPress={onViewTickets}
            style={styles.iconAction}
          >
            <SymbolView
              name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
              size={14}
              tintColor="#2563EB"
            />
          </Pressable>
          <Pressable
            accessibilityLabel={`Edit ${conference.title}`}
            accessibilityRole="button"
            onPress={onEdit}
            style={styles.iconAction}
          >
            <SymbolView
              name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
              size={14}
              tintColor="#7C3AED"
            />
          </Pressable>
          <Pressable
            accessibilityLabel={`Delete ${conference.title}`}
            accessibilityRole="button"
            onPress={onDelete}
            style={styles.deleteAction}
          >
            <SymbolView
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              size={14}
              tintColor="#F05262"
            />
          </Pressable>
        </View>
      </View>

      <Text style={styles.cardTitle}>{conference.title}</Text>
      <View style={styles.detailRow}>
        <SymbolView
          name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
          size={11}
          tintColor="#65758C"
        />
        <Text style={styles.detailText}>{dateLabel}</Text>
      </View>
      <View style={styles.detailRow}>
        <SymbolView
          name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
          size={11}
          tintColor="#65758C"
        />
        <Text style={styles.detailText}>{location}</Text>
      </View>

      <View style={styles.divider} />
      <View style={styles.stats}>
        <Text style={styles.statValue}>
          {conference.active_start_date || '—'} <Text style={styles.statLabel}>Active From</Text>
        </Text>
        <Text style={styles.statValue}>
          {conference.active_end_date || '—'} <Text style={styles.statLabel}>Active Until</Text>
        </Text>
      </View>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA5B5"
        style={[styles.formInput, multiline && styles.formInputMultiline]}
        value={value}
      />
    </View>
  );
}

export default function AdminEventsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conferences, setConferences] = useState<ConferenceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [ticketsConference, setTicketsConference] = useState<ConferenceInfo | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState('');

  // Agenda management state
  const [agendaConference, setAgendaConference] = useState<ConferenceInfo | null>(null);
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [agendaLoading, setAgendaLoading] = useState(false);
  const [agendaListError, setAgendaListError] = useState('');
  const [agendaFormVisible, setAgendaFormVisible] = useState(false);
  const [editingAgendaId, setEditingAgendaId] = useState<number | null>(null);
  const [agendaForm, setAgendaForm] = useState<AgendaPayload>({ ...EMPTY_AGENDA_FORM });
  const [agendaFormError, setAgendaFormError] = useState('');
  const [agendaSaving, setAgendaSaving] = useState(false);

  const setAgendaField = (key: keyof AgendaPayload) => (value: string) =>
    setAgendaForm((current) => ({ ...current, [key]: value }));

  const setField = (key: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const load = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await adminApi.conferences(user.token);
      setConferences(res.data || []);
      setListError('');
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load conferences.');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError('');
    setFormVisible(true);
  };

  const openEdit = (conference: ConferenceInfo) => {
    setEditingId(conference.id);
    setForm({
      title: conference.title || '',
      conference_date: conference.conference_date || '',
      venue_name: conference.venue_name || '',
      venue_address: conference.venue_address || '',
      venue_city: conference.venue_city || '',
      venue_state: conference.venue_state || '',
      active_start_date: conference.active_start_date || '',
      active_end_date: conference.active_end_date || '',
      google_map_url: conference.google_map_url || '',
      status: conference.status === 'inactive' ? 'inactive' : 'active',
    });
    setFormError('');
    setFormVisible(true);
  };

  const validateForm = (): string => {
    if (
      !form.title || !form.conference_date || !form.venue_name || !form.venue_address ||
      !form.venue_city || !form.venue_state || !form.active_start_date ||
      !form.active_end_date || !form.google_map_url
    ) {
      return 'Please fill in all fields — every field is required.';
    }
    if (
      !DATE_PATTERN.test(form.conference_date) ||
      !DATE_PATTERN.test(form.active_start_date) ||
      !DATE_PATTERN.test(form.active_end_date)
    ) {
      return 'Dates must be in YYYY-MM-DD format (e.g. 2026-09-15).';
    }
    if (form.active_end_date < form.active_start_date) {
      return 'Active End Date cannot be before Active Start Date.';
    }
    if (form.conference_date < form.active_start_date) {
      return 'Conference Date cannot be before Active Start Date.';
    }
    if (!/^https?:\/\//.test(form.google_map_url)) {
      return 'Google Maps link must be a full URL starting with https://';
    }
    return '';
  };

  const saveConference = async () => {
    if (!user?.token) return;
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError('');
    setSaving(true);
    try {
      const payload: ConferencePayload = { ...form };
      if (editingId) {
        await adminApi.updateConference(user.token, editingId, payload);
      } else {
        await adminApi.createConference(user.token, payload);
      }
      setFormVisible(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save conference.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (conference: ConferenceInfo) => {
    confirmDestructive(
      'Delete Conference',
      `Delete "${conference.title}"? This cannot be undone.`,
      'Delete',
      async () => {
        if (!user?.token) return;
        try {
          await adminApi.deleteConference(user.token, conference.id);
          await load();
        } catch (e) {
          notify('Error', e instanceof Error ? e.message : 'Failed to delete.');
        }
      },
    );
  };

  const toggleStatus = async (conference: ConferenceInfo) => {
    if (!user?.token) return;
    const next = conference.status === 'active' ? 'inactive' : 'active';
    try {
      await adminApi.updateConferenceStatus(user.token, conference.id, next);
      await load();
    } catch (e) {
      notify('Error', e instanceof Error ? e.message : 'Failed to update status.');
    }
  };

  const uploadTickets = async (conference: ConferenceInfo) => {
    if (!user?.token) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv',
          'text/comma-separated-values',
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];

      setUploadingId(conference.id);
      const res = await adminApi.importTickets(user.token, conference.id, {
        uri: asset.uri,
        name: asset.name || 'tickets.xlsx',
        mimeType: asset.mimeType,
        webFile: (asset as any).file ?? null,
      });
      notify('Success', res.message || 'Tickets imported successfully.');
    } catch (e) {
      notify('Upload Failed', e instanceof Error ? e.message : 'Could not import tickets.');
    } finally {
      setUploadingId(null);
    }
  };

  const openTickets = async (conference: ConferenceInfo) => {
    setTicketsConference(conference);
    setTickets([]);
    setTicketsError('');
    if (!user?.token) return;

    setTicketsLoading(true);
    try {
      const res = await adminApi.tickets(user.token, conference.id);
      setTickets(res.data || []);
    } catch (e) {
      setTicketsError(e instanceof Error ? e.message : 'Failed to load tickets.');
    } finally {
      setTicketsLoading(false);
    }
  };

  const downloadTicketTemplate = async () => {
    const endpoint = process.env.EXPO_PUBLIC_ADMIN_TICKET_TEMPLATE_URL || '/admin/tickets/template';
    const localTemplate = 'ticket_reference,ticket_holder_name,ticket_holder_email,ticket_source\nTICKET-001,Example Attendee,attendee@example.com,Eventbrite\n';
    if (!user?.token) {
      notify('Authentication Required', 'Please sign in again to download the template.');
      return;
    }
    try {
      if (Platform.OS === 'web') {
        const response = await fetch(endpoint, { headers: { Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv', Authorization: `Bearer ${user.token}` } });
        const isFallback = response.status === 404;
        const blob = isFallback
          ? new Blob([localTemplate], { type: 'text/csv;charset=utf-8;' })
          : response.ok
            ? await response.blob()
            : null;
        if (!blob) throw new Error(`Template download failed (${response.status})`);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = isFallback ? 'ticket-import-template.csv' : 'ticket-import-template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        notify('Success', 'Ticket template downloaded.');
        return;
      }

      const FileSystem = await import('expo-file-system/legacy');
      const Sharing = await import('expo-sharing');
      const xlsxUri = `${FileSystem.cacheDirectory}ticket-import-template.xlsx`;
      const csvUri = `${FileSystem.cacheDirectory}ticket-import-template.csv`;
      let fileUri = xlsxUri;
      let mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      let uti = 'org.openxmlformats.spreadsheetml.sheet';
      try {
        const result = await FileSystem.downloadAsync(endpoint, xlsxUri, { headers: { Authorization: `Bearer ${user.token}` } });
        if (result.status >= 400) {
          fileUri = csvUri;
          mimeType = 'text/csv';
          uti = 'public.comma-separated-values-text';
          await FileSystem.writeAsStringAsync(fileUri, localTemplate, { encoding: 'utf8' });
        }
      } catch {
        // The template endpoint is optional; keep the tool usable with the built-in CSV template.
        fileUri = csvUri;
        mimeType = 'text/csv';
        uti = 'public.comma-separated-values-text';
        await FileSystem.writeAsStringAsync(fileUri, localTemplate, { encoding: 'utf8' });
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType, dialogTitle: 'Download Ticket Template', UTI: uti });
      } else {
        notify('Template Ready', `File saved at:\n${fileUri}`);
      }
    } catch (error) {
      notify('Download Failed', error instanceof Error ? error.message : 'Unable to download ticket template.');
    }
  };

  const openAgenda = async (conference: ConferenceInfo) => {
    setAgendaConference(conference);
    setAgendaFormVisible(false);
    setAgendas([]);
    if (!user?.token) return;
    setAgendaLoading(true);
    try {
      const res = await agendaApi.list(user.token, conference.id);
      setAgendas(res.data || []);
      setAgendaListError('');
    } catch (e) {
      setAgendaListError(e instanceof Error ? e.message : 'Failed to load agenda.');
    } finally {
      setAgendaLoading(false);
    }
  };

  const openAgendaCreate = () => {
    setEditingAgendaId(null);
    setAgendaForm({ ...EMPTY_AGENDA_FORM });
    setAgendaFormError('');
    setAgendaFormVisible(true);
  };

  const openAgendaEdit = (agenda: AgendaItem) => {
    setEditingAgendaId(agenda.id);
    setAgendaForm({
      session_name: agenda.session_name || '',
      presenter: agenda.presenter || '',
      session_date: agenda.session_date || '',
      duration: String(agenda.duration || ''),
      place: agenda.place || '',
      room: agenda.room || '',
    });
    setAgendaFormError('');
    setAgendaFormVisible(true);
  };

  const saveAgenda = async () => {
    if (!user?.token || !agendaConference) return;
    if (
      !agendaForm.session_name || !agendaForm.presenter || !agendaForm.session_date ||
      !agendaForm.duration || !agendaForm.place || !agendaForm.room
    ) {
      setAgendaFormError('Please fill in all fields — every field is required.');
      return;
    }
    if (!DATE_PATTERN.test(agendaForm.session_date)) {
      setAgendaFormError('Session date must be in YYYY-MM-DD format (e.g. 2026-09-15).');
      return;
    }
    setAgendaFormError('');
    setAgendaSaving(true);
    try {
      if (editingAgendaId) {
        await agendaApi.update(user.token, agendaConference.id, editingAgendaId, agendaForm);
      } else {
        await agendaApi.create(user.token, agendaConference.id, agendaForm);
      }
      setAgendaFormVisible(false);
      const res = await agendaApi.list(user.token, agendaConference.id);
      setAgendas(res.data || []);
    } catch (e) {
      setAgendaFormError(e instanceof Error ? e.message : 'Failed to save session.');
    } finally {
      setAgendaSaving(false);
    }
  };

  const deleteAgenda = (agenda: AgendaItem) => {
    confirmDestructive('Delete Session', `Delete "${agenda.session_name}"?`, 'Delete', async () => {
      if (!user?.token || !agendaConference) return;
      try {
        await agendaApi.remove(user.token, agendaConference.id, agenda.id);
        setAgendas((current) => current.filter((a) => a.id !== agenda.id));
      } catch (e) {
        notify('Error', e instanceof Error ? e.message : 'Failed to delete session.');
      }
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Conferences</Text>
        </View>

        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor="#7C3AED" colors={["#7C3AED"]} />} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>Conferences</Text>
              <Text style={styles.subtitle}>
                {conferences.length} conference{conferences.length === 1 ? '' : 's'}
              </Text>
            </View>
            <View style={styles.topActions}>
              <Pressable accessibilityLabel="Download ticket template" onPress={() => void downloadTicketTemplate()} style={styles.templateButton}>
                <SymbolView name={{ ios: 'arrow.down.doc', android: 'download', web: 'download' }} size={11} tintColor="#7040DF" />
                <Text style={styles.agendaText}>Download Template</Text>
              </Pressable>
              <Pressable accessibilityLabel="Create new conference" accessibilityRole="button" onPress={openCreate} style={styles.newButton}>
                <Text style={styles.newText}>＋ New</Text>
              </Pressable>
            </View>
          </View>

          {loading ? <Text style={styles.stateText}>Loading conferences...</Text> : null}
          {listError ? <Text style={[styles.stateText, { color: '#D92D3A' }]}>{listError}</Text> : null}
          {!loading && !listError && !conferences.length ? (
            <Text style={styles.stateText}>No conferences yet. Tap ＋ New to create one.</Text>
          ) : null}

          {conferences.map((conference) => (
            <ConferenceCard
              key={conference.id}
              conference={conference}
              onEdit={() => openEdit(conference)}
              onDelete={() => confirmDelete(conference)}
              onToggleStatus={() => toggleStatus(conference)}
              onUploadTickets={() => uploadTickets(conference)}
              onViewTickets={() => openTickets(conference)}
              onManageAgenda={() => openAgenda(conference)}
              uploading={uploadingId === conference.id}
            />
          ))}
        </ScrollView>

        <Modal transparent visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{editingId ? 'Edit Conference' : 'Create Conference'}</Text>
                <Pressable accessibilityLabel="Close" onPress={() => setFormVisible(false)} hitSlop={10}>
                  <Text style={styles.modalClose}>✕</Text>
                </Pressable>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <FormField label="Conference Name" value={form.title} onChangeText={setField('title')} placeholder="Cloud Adoption Summit 2026" />
                <FormField label="Conference Date" value={form.conference_date} onChangeText={setField('conference_date')} placeholder="YYYY-MM-DD" />
                <FormField label="Venue Name" value={form.venue_name} onChangeText={setField('venue_name')} placeholder="Hyatt Regency" />
                <FormField label="Venue Address" value={form.venue_address} onChangeText={setField('venue_address')} placeholder="5 Embarcadero Center" multiline />
                <FormField label="Venue City" value={form.venue_city} onChangeText={setField('venue_city')} placeholder="San Francisco" />
                <FormField label="Venue State" value={form.venue_state} onChangeText={setField('venue_state')} placeholder="CA" />
                <FormField label="Active Start Date" value={form.active_start_date} onChangeText={setField('active_start_date')} placeholder="YYYY-MM-DD (1 month before)" />
                <FormField label="Active End Date" value={form.active_end_date} onChangeText={setField('active_end_date')} placeholder="YYYY-MM-DD (1 month after)" />
                <FormField label="Google Maps Link" value={form.google_map_url} onChangeText={setField('google_map_url')} placeholder="https://maps.google.com/..." />

                <Text style={styles.formLabel}>Status</Text>
                <View style={styles.statusRow}>
                  {(['active', 'inactive'] as const).map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => setForm((current) => ({ ...current, status: option }))}
                      style={[styles.statusOption, form.status === option && styles.statusOptionActive]}
                    >
                      <Text style={[styles.statusOptionText, form.status === option && styles.statusOptionTextActive]}>
                        {option === 'active' ? 'Active' : 'Inactive'}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {formError ? <Text style={styles.formError}>{formError}</Text> : null}

                <Pressable disabled={saving} onPress={saveConference} style={styles.saveButton}>
                  <Text style={styles.saveText}>
                    {saving ? 'Saving...' : editingId ? 'Update Conference' : 'Create Conference'}
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          transparent
          visible={agendaConference !== null}
          animationType="slide"
          onRequestClose={() => setAgendaConference(null)}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  Agenda · {agendaConference?.title}
                </Text>
                <Pressable accessibilityLabel="Close" onPress={() => setAgendaConference(null)} hitSlop={10}>
                  <Text style={styles.modalClose}>✕</Text>
                </Pressable>
              </View>

              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {!agendaFormVisible ? (
                  <>
                    <Pressable onPress={openAgendaCreate} style={styles.saveButton}>
                      <Text style={styles.saveText}>＋ Add Session</Text>
                    </Pressable>

                    {agendaLoading ? <Text style={styles.stateText}>Loading sessions...</Text> : null}
                    {agendaListError ? (
                      <Text style={[styles.stateText, { color: '#D92D3A' }]}>{agendaListError}</Text>
                    ) : null}
                    {!agendaLoading && !agendaListError && !agendas.length ? (
                      <Text style={styles.stateText}>No sessions yet. Tap ＋ Add Session.</Text>
                    ) : null}

                    {agendas.map((agenda) => (
                      <View key={agenda.id} style={[styles.card, { borderTopColor: '#7C3AED', marginBottom: 9 }]}>
                        <View style={styles.cardHeader}>
                          <Text style={[styles.statusPill, { backgroundColor: '#7C3AED' }]}>
                            {agenda.session_date}
                          </Text>
                          <View style={styles.cardActions}>
                            <Pressable
                              accessibilityLabel={`Edit ${agenda.session_name}`}
                              onPress={() => openAgendaEdit(agenda)}
                              style={styles.iconAction}
                            >
                              <SymbolView
                                name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
                                size={14}
                                tintColor="#7C3AED"
                              />
                            </Pressable>
                            <Pressable
                              accessibilityLabel={`Delete ${agenda.session_name}`}
                              onPress={() => deleteAgenda(agenda)}
                              style={styles.deleteAction}
                            >
                              <SymbolView
                                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                                size={14}
                                tintColor="#F05262"
                              />
                            </Pressable>
                          </View>
                        </View>
                        <Text style={styles.cardTitle}>{agenda.session_name}</Text>
                        <View style={styles.detailRow}>
                          <SymbolView name={{ ios: 'person', android: 'person', web: 'person' }} size={11} tintColor="#65758C" />
                          <Text style={styles.detailText}>{agenda.presenter}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <SymbolView name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} size={11} tintColor="#65758C" />
                          <Text style={styles.detailText}>{String(agenda.duration)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <SymbolView name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} size={11} tintColor="#65758C" />
                          <Text style={styles.detailText}>{[agenda.place, agenda.room].filter(Boolean).join(' · ')}</Text>
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    <FormField label="Session Name" value={agendaForm.session_name} onChangeText={setAgendaField('session_name')} placeholder="Opening Keynote" />
                    <FormField label="Presenter" value={agendaForm.presenter} onChangeText={setAgendaField('presenter')} placeholder="Dr. Angela Morrison" />
                    <FormField label="Session Date" value={agendaForm.session_date} onChangeText={setAgendaField('session_date')} placeholder="YYYY-MM-DD (today or later)" />
                    <FormField label="Duration" value={agendaForm.duration} onChangeText={setAgendaField('duration')} placeholder="60 min" />
                    <FormField label="Place" value={agendaForm.place} onChangeText={setAgendaField('place')} placeholder="Hyatt Regency SF" />
                    <FormField label="Room" value={agendaForm.room} onChangeText={setAgendaField('room')} placeholder="Main Hall" />

                    {agendaFormError ? <Text style={styles.formError}>{agendaFormError}</Text> : null}

                    <Pressable disabled={agendaSaving} onPress={saveAgenda} style={styles.saveButton}>
                      <Text style={styles.saveText}>
                        {agendaSaving ? 'Saving...' : editingAgendaId ? 'Update Session' : 'Add Session'}
                      </Text>
                    </Pressable>
                    <Pressable onPress={() => setAgendaFormVisible(false)} style={[styles.saveButton, { backgroundColor: '#EFF1F7', marginTop: -10 }]}>
                      <Text style={[styles.saveText, { color: '#64748B' }]}>Back to Sessions</Text>
                    </Pressable>
                  </>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          transparent
          visible={ticketsConference !== null}
          animationType="slide"
          onRequestClose={() => setTicketsConference(null)}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle} numberOfLines={1}>Tickets · {ticketsConference?.title}</Text>
                  {!ticketsLoading && !ticketsError ? <Text style={styles.ticketCount}>{tickets.length} ticket{tickets.length === 1 ? '' : 's'}</Text> : null}
                </View>
                <Pressable accessibilityLabel="Close tickets" onPress={() => setTicketsConference(null)} hitSlop={10}>
                  <Text style={styles.modalClose}>✕</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {ticketsLoading ? <Text style={styles.stateText}>Loading tickets...</Text> : null}
                {ticketsError ? <Text style={[styles.stateText, { color: '#D92D3A' }]}>{ticketsError}</Text> : null}
                {!ticketsLoading && !ticketsError && !tickets.length ? <Text style={styles.stateText}>No tickets have been imported for this conference yet.</Text> : null}
                {tickets.map((ticket) => (
                  <View key={ticket.id} style={styles.ticketCard}>
                    <View style={styles.ticketHeader}>
                      <Text style={styles.ticketReference}>{ticket.ticket_reference}</Text>
                      <Text style={[styles.ticketStatus, ticket.status === 'unused' ? styles.ticketUnused : styles.ticketUsed]}>{ticket.status}</Text>
                    </View>
                    <Text style={styles.ticketName}>{ticket.ticket_holder_name || 'Unnamed attendee'}</Text>
                    {ticket.ticket_holder_email ? <Text style={styles.ticketDetail}>{ticket.ticket_holder_email}</Text> : null}
                    {ticket.ticket_source ? <Text style={styles.ticketDetail}>Source: {ticket.ticket_source}</Text> : null}
                  </View>
                ))}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <AdminBottomNav active="events" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  header: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E8EF',
  },
  headerTitle: { color: '#1E273B', fontSize: 13, fontWeight: '800' },
  content: { padding: 12, paddingBottom: 24 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { color: '#1D2639', fontSize: 23, fontWeight: '800' },
  subtitle: { color: '#718098', fontSize: 10, marginTop: 3 },
  topActions: { flexDirection: 'row', gap: 7 }, templateButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 8, backgroundColor: '#F0E9FF' },
  agendaButton: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F0E9FF',
  },
  agendaText: { color: '#7040DF', fontSize: 10, fontWeight: '700' },
  newButton: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#6D2DE6',
  },
  newText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  stateText: { padding: 20, textAlign: 'center', color: '#718098', fontSize: 11 },
  card: {
    marginBottom: 11,
    borderTopWidth: 4,
    borderRadius: 12,
    padding: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#34425D',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  cardActions: { flexDirection: 'row', gap: 7 },
  iconAction: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#F0E9FF',
  },
  deleteAction: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#FFF0F1',
  },
  cardTitle: { color: '#202B40', fontSize: 11, fontWeight: '800', marginTop: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 },
  detailText: { color: '#65758C', fontSize: 9 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 9,
    backgroundColor: '#E5E9F0',
  },
  stats: { flexDirection: 'row', gap: 18 },
  statValue: { color: '#1F2A40', fontSize: 11, fontWeight: '800' },
  statLabel: { color: '#65758C', fontSize: 8, fontWeight: '400' },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(25, 34, 53, 0.38)',
  },
  modalCard: {
    maxHeight: '88%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: { color: '#1D2639', fontSize: 16, fontWeight: '800' },
  modalClose: { color: '#64748B', fontSize: 16, fontWeight: '700', padding: 4 },
  ticketCount: { color: '#718098', fontSize: 11, marginTop: 2 },
  ticketCard: { borderWidth: 1, borderColor: '#E5E9F0', borderRadius: 10, padding: 12, marginBottom: 9, backgroundColor: '#FBFBFD' },
  ticketHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  ticketReference: { color: '#202B40', fontSize: 13, fontWeight: '800', flex: 1 },
  ticketStatus: { overflow: 'hidden', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, fontSize: 9, fontWeight: '800', textTransform: 'capitalize' },
  ticketUnused: { color: '#047857', backgroundColor: '#D1FAE5' },
  ticketUsed: { color: '#64748B', backgroundColor: '#E5E7EB' },
  ticketName: { color: '#34425D', fontSize: 12, fontWeight: '700', marginTop: 7 },
  ticketDetail: { color: '#718098', fontSize: 10, marginTop: 3 },
  formField: { marginBottom: 10 },
  formLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  formInput: {
    height: 42,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    paddingHorizontal: 11,
    backgroundColor: '#FBFBFD',
    color: '#21243D',
    fontSize: 13,
  },
  formInputMultiline: { height: 64, paddingTop: 10, textAlignVertical: 'top' },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statusOption: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBFBFD',
  },
  statusOptionActive: { borderColor: '#7C3AED', backgroundColor: '#F0E9FF' },
  statusOptionText: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  statusOptionTextActive: { color: '#7C3AED', fontWeight: '800' },
  formError: { color: '#D92D3A', fontSize: 12, marginBottom: 10, textAlign: 'center' },
  saveButton: {
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#6D2DE6',
  },
  saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
