import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  adminApi,
  notificationApi,
  type ConferenceInfo,
  type NotificationItem,
  type NotificationPayload,
} from '../../services/api';
import AdminBottomNav from './AdminBottomNav';
import SuperAdminTabBar from '../../components/SuperAdminTabBar';

// Alert.alert is a no-op on react-native-web, so route through the browser dialogs there.
function notify(title: string, message: string) {
  if (Platform.OS === 'web') {
    (globalThis as any).alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function confirmAction(title: string, message: string, confirmLabel: string, destructive: boolean, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if ((globalThis as any).confirm(`${title}\n\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
    ]);
  }
}

type FormState = {
  conference_id: number | null;
  title: string;
  message: string;
  scheduled_at: string; // "YYYY-MM-DD HH:MM" local, or empty for "send manually"
};

const emptyForm: FormState = { conference_id: null, title: '', message: '', scheduled_at: '' };

type Status = 'sent' | 'scheduled' | 'draft';

function statusOf(item: NotificationItem): Status {
  if (item.sent_at) return 'sent';
  if (item.scheduled_at) return 'scheduled';
  return 'draft';
}

const statusMeta: Record<Status, { label: string; color: string; background: string }> = {
  sent: { label: 'Sent', color: '#00794F', background: '#E8F8F1' },
  scheduled: { label: 'Scheduled', color: '#B45309', background: '#FEF3C7' },
  draft: { label: 'Draft', color: '#4B5563', background: '#F1F3F7' },
};

function formatDateTime(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** ISO from the API -> "YYYY-MM-DD HH:MM" in local time for the input. */
function toInputDateTime(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** "YYYY-MM-DD HH:MM" local -> ISO string for the API. Returns null for empty, undefined for invalid. */
function fromInputDateTime(value: string): string | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(trimmed);
  if (!match) return undefined;
  const [, y, mo, d, h, mi] = match.map(Number);
  const date = new Date(y, mo - 1, d, h, mi);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

type Props = { variant?: 'admin' | 'superadmin' };

/** Shared by /admin-notifications and /superadmin-notifications; the API route is the same for both roles. */
export default function AdminNotificationsScreen({ variant = 'admin' }: Props) {
  const router = useRouter();
  const isSuperAdmin = variant === 'superadmin';
  const dashboardRoute = isSuperAdmin ? '/superadmin-dashboard' : '/admin-dashboard';
  const { user } = useAuth();
  const token = user?.token;

  const [conferences, setConferences] = useState<ConferenceInfo[]>([]);
  const [filterConferenceId, setFilterConferenceId] = useState<number | null>(null);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [listError, setListError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NotificationItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadConferences = useCallback(async () => {
    if (!token) return;
    try {
      const res = await adminApi.conferences(token);
      setConferences(res.data || []);
    } catch {
      // Notifications still render; the filter just has nothing to show.
    }
  }, [token]);

  const loadNotifications = useCallback(
    async (silent = false) => {
      if (!token) return;
      if (!silent) setLoading(true);
      try {
        const res = await notificationApi.list(token, filterConferenceId);
        setItems(res.data || []);
        setListError('');
      } catch (e) {
        setListError(e instanceof Error ? e.message : 'Failed to load notifications.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, filterConferenceId],
  );

  useEffect(() => {
    void loadConferences();
  }, [loadConferences]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const conferenceTitle = useMemo(() => {
    const map = new Map<number, string>();
    conferences.forEach((c) => map.set(c.id, c.title));
    return (id: number | null | undefined, fallback?: string | null) => (id != null && map.get(id)) || fallback || 'Unknown conference';
  }, [conferences]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, conference_id: filterConferenceId ?? conferences[0]?.id ?? null });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item: NotificationItem) => {
    setEditing(item);
    setForm({
      conference_id: item.conference?.id ?? null,
      title: item.title,
      message: item.message,
      scheduled_at: toInputDateTime(item.scheduled_at),
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const submit = async () => {
    if (!token) return;
    const title = form.title.trim();
    const message = form.message.trim();
    if (!form.conference_id) return setFormError('Choose a conference.');
    if (!title) return setFormError('Title is required.');
    if (!message) return setFormError('Message is required.');

    const scheduled = fromInputDateTime(form.scheduled_at);
    if (scheduled === undefined) return setFormError('Schedule must look like 2026-09-20 14:30, or be left blank.');
    if (scheduled && new Date(scheduled).getTime() < Date.now()) return setFormError('Scheduled time must be in the future.');

    const payload: NotificationPayload = { conference_id: form.conference_id, title, message, scheduled_at: scheduled };

    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        await notificationApi.update(token, editing.id, payload);
      } else {
        await notificationApi.create(token, payload);
      }
      setModalOpen(false);
      await loadNotifications(true);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Unable to save notification.');
    } finally {
      setSaving(false);
    }
  };

  const sendNow = (item: NotificationItem) => {
    if (!token) return;
    confirmAction(
      'Send notification?',
      `"${item.title}" will be pushed to every approved attendee of ${conferenceTitle(item.conference?.id, item.conference?.title)}. This cannot be undone.`,
      'Send',
      false,
      async () => {
        setBusyId(item.id);
        try {
          await notificationApi.send(token, item.id);
          notify('Queued', 'The notification has been queued for delivery.');
          await loadNotifications(true);
        } catch (e) {
          notify('Send failed', e instanceof Error ? e.message : 'Unable to send notification.');
        } finally {
          setBusyId(null);
        }
      },
    );
  };

  const remove = (item: NotificationItem) => {
    if (!token) return;
    confirmAction('Delete notification?', `"${item.title}" will be permanently removed.`, 'Delete', true, async () => {
      setBusyId(item.id);
      try {
        await notificationApi.remove(token, item.id);
        setItems((prev) => prev.filter((n) => n.id !== item.id));
      } catch (e) {
        notify('Delete failed', e instanceof Error ? e.message : 'Unable to delete notification.');
      } finally {
        setBusyId(null);
      }
    });
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.replace(dashboardRoute as never)} hitSlop={10} style={styles.backButton}>
            <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} size={19} tintColor="#253046" />
          </Pressable>
          <Text style={styles.headerText}>Notifications</Text>
          <Pressable accessibilityLabel="New notification" accessibilityRole="button" onPress={openCreate} style={styles.newButton}>
            <Text style={styles.newButtonText}>+ New</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void loadNotifications(true); }} />}
        >
          <Text style={styles.title}>Push Notifications</Text>
          <Text style={styles.subtitle}>Messages go to approved attendees of the selected conference.</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Pressable onPress={() => setFilterConferenceId(null)} style={[styles.chip, filterConferenceId === null && styles.chipActive]}>
              <Text style={[styles.chipText, filterConferenceId === null && styles.chipTextActive]}>All</Text>
            </Pressable>
            {conferences.map((c) => (
              <Pressable key={c.id} onPress={() => setFilterConferenceId(c.id)} style={[styles.chip, filterConferenceId === c.id && styles.chipActive]}>
                <Text numberOfLines={1} style={[styles.chipText, filterConferenceId === c.id && styles.chipTextActive]}>{c.title}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {listError ? <Text style={styles.error}>{listError}</Text> : null}

          {loading ? (
            <View style={styles.loader}><ActivityIndicator color="#7C3AED" /></View>
          ) : items.length === 0 ? (
            <View style={styles.empty}>
              <SymbolView name={{ ios: 'bell.slash', android: 'notifications_off', web: 'notifications_off' }} size={28} tintColor="#9AA5B8" />
              <Text style={styles.emptyText}>No notifications yet.</Text>
              <Pressable onPress={openCreate} style={styles.emptyButton}><Text style={styles.emptyButtonText}>Create the first one</Text></Pressable>
            </View>
          ) : (
            items.map((item) => {
              const status = statusOf(item);
              const meta = statusMeta[status];
              const busy = busyId === item.id;
              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardConference} numberOfLines={1}>{conferenceTitle(item.conference?.id, item.conference?.title)}</Text>
                    <Text style={[styles.badge, { color: meta.color, backgroundColor: meta.background }]}>{meta.label}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMessage}>{item.message}</Text>
                  <Text style={styles.cardMeta}>
                    {status === 'sent'
                      ? `Sent ${formatDateTime(item.sent_at)}`
                      : status === 'scheduled'
                        ? `Scheduled for ${formatDateTime(item.scheduled_at)}`
                        : `Created ${formatDateTime(item.created_at)}`}
                    {item.created_by?.name ? ` · ${item.created_by.name}` : ''}
                  </Text>
                  <View style={styles.actions}>
                    {status !== 'sent' && (
                      <Pressable disabled={busy} onPress={() => sendNow(item)} style={[styles.actionPrimary, busy && styles.disabled]}>
                        {busy ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.actionPrimaryText}>Send now</Text>}
                      </Pressable>
                    )}
                    {status !== 'sent' && (
                      <Pressable disabled={busy} onPress={() => openEdit(item)} style={[styles.actionSecondary, busy && styles.disabled]}>
                        <Text style={styles.actionSecondaryText}>Edit</Text>
                      </Pressable>
                    )}
                    <Pressable disabled={busy} onPress={() => remove(item)} style={[styles.actionDanger, busy && styles.disabled]}>
                      <Text style={styles.actionDangerText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
        {isSuperAdmin ? <SuperAdminTabBar activeTab="Tools" /> : <AdminBottomNav active="tools" />}
      </SafeAreaView>

      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={closeModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Notification' : 'New Notification'}</Text>

            <Text style={styles.label}>CONFERENCE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {conferences.map((c) => (
                <Pressable key={c.id} onPress={() => update('conference_id', c.id)} style={[styles.chip, form.conference_id === c.id && styles.chipActive]}>
                  <Text numberOfLines={1} style={[styles.chipText, form.conference_id === c.id && styles.chipTextActive]}>{c.title}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.label}>TITLE</Text>
            <TextInput value={form.title} onChangeText={(v) => update('title', v)} maxLength={255} placeholder="e.g. Keynote starts in 15 minutes" placeholderTextColor="#9AA5B8" style={styles.input} />

            <Text style={styles.label}>MESSAGE</Text>
            <TextInput value={form.message} onChangeText={(v) => update('message', v)} multiline placeholder="What attendees will see in the push." placeholderTextColor="#9AA5B8" style={[styles.input, styles.textarea]} />

            <Text style={styles.label}>SCHEDULE (OPTIONAL)</Text>
            <TextInput value={form.scheduled_at} onChangeText={(v) => update('scheduled_at', v)} autoCapitalize="none" placeholder="YYYY-MM-DD HH:MM — leave blank to send manually" placeholderTextColor="#9AA5B8" style={styles.input} />

            {formError ? <Text style={styles.error}>{formError}</Text> : null}

            <View style={styles.modalActions}>
              <Pressable disabled={saving} onPress={closeModal} style={styles.actionSecondary}><Text style={styles.actionSecondaryText}>Cancel</Text></Pressable>
              <Pressable disabled={saving} onPress={submit} style={[styles.actionPrimary, saving && styles.disabled]}>
                {saving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.actionPrimaryText}>{editing ? 'Save changes' : 'Create'}</Text>}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safe: { flex: 1 },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' },
  backButton: { position: 'absolute', left: 12, width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerText: { fontSize: 13, fontWeight: '800', color: '#1D2639' },
  newButton: { position: 'absolute', right: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: '#7C3AED' },
  newButtonText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  content: { padding: 12, paddingBottom: 24 },
  title: { fontSize: 21, fontWeight: '800', color: '#1D2639' },
  subtitle: { marginTop: 3, fontSize: 9, color: '#718098' },
  chips: { flexDirection: 'row', gap: 6, paddingVertical: 10 },
  chip: { maxWidth: 180, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, backgroundColor: '#EEF1F6' },
  chipActive: { backgroundColor: '#7C3AED' },
  chipText: { fontSize: 9, fontWeight: '700', color: '#4B5563' },
  chipTextActive: { color: '#FFF' },
  error: { marginTop: 8, color: '#C62828', fontSize: 10 },
  loader: { paddingVertical: 40, alignItems: 'center' },
  empty: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  emptyText: { color: '#65758C', fontSize: 10 },
  emptyButton: { marginTop: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, backgroundColor: '#F0E9FF' },
  emptyButtonText: { color: '#7C3AED', fontSize: 9, fontWeight: '800' },
  card: { marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardConference: { flex: 1, fontSize: 8, fontWeight: '800', color: '#7C3AED', textTransform: 'uppercase' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontSize: 7, fontWeight: '800' },
  cardTitle: { marginTop: 6, fontSize: 12, fontWeight: '800', color: '#1D2639' },
  cardMessage: { marginTop: 3, fontSize: 10, lineHeight: 15, color: '#354057' },
  cardMeta: { marginTop: 6, fontSize: 8, color: '#8A96A9' },
  actions: { marginTop: 10, flexDirection: 'row', gap: 6 },
  actionPrimary: { minWidth: 76, height: 28, paddingHorizontal: 12, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' },
  actionPrimaryText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  actionSecondary: { height: 28, paddingHorizontal: 12, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0E9FF' },
  actionSecondaryText: { color: '#7C3AED', fontSize: 9, fontWeight: '800' },
  actionDanger: { height: 28, paddingHorizontal: 12, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0F1' },
  actionDangerText: { color: '#E52F3F', fontSize: 9, fontWeight: '800' },
  disabled: { opacity: 0.5 },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: 'rgba(0,0,0,.48)' },
  modal: { width: '100%', maxWidth: 360, padding: 15, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 },
  modalTitle: { color: '#172238', fontSize: 13, fontWeight: '800' },
  label: { marginTop: 12, marginBottom: 5, color: '#66758D', fontSize: 7, fontWeight: '800' },
  input: { minHeight: 36, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E4E8EF', backgroundColor: '#FAFBFD', fontSize: 11, color: '#1D2639' },
  textarea: { minHeight: 84, textAlignVertical: 'top' },
  modalActions: { marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
});
