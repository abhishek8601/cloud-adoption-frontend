import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type SessionProps = {
  track: string;
  title: string;
  speaker: string;
  role: string;
  initials: string;
  time: string;
  duration: string;
  room: string;
  color: string;
  bookmarked?: boolean;
};

function SessionCard({
  track,
  title,
  speaker,
  role,
  initials,
  time,
  duration,
  room,
  color,
  bookmarked,
}: SessionProps) {
  return (
    <View style={[styles.sessionCard, { borderTopColor: color }]}>
      <View style={styles.sessionTop}>
        <View style={[styles.trackPill, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.trackText, { color }]}>{track}</Text>
        </View>
        <SymbolView
          name={{ ios: bookmarked ? 'bookmark.fill' : 'bookmark', android: bookmarked ? 'bookmark' : 'bookmark_border', web: bookmarked ? 'bookmark' : 'bookmark_border' }}
          size={16}
          tintColor={bookmarked ? '#7C3AED' : '#B6C0D1'}
        />
      </View>
      <Text style={styles.sessionTitle}>{title}</Text>
      <View style={styles.speakerRow}>
        <View style={[styles.initials, { backgroundColor: color }]}>
          <Text style={styles.initialsText}>{initials}</Text>
        </View>
        <View>
          <Text style={styles.speakerName}>{speaker}</Text>
          <Text style={styles.speakerRole}>{role}</Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.metaRow}><SymbolView name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} size={12} tintColor="#728099" /><Text style={styles.metaMain}>{time}</Text><Text style={styles.metaText}>· {duration}</Text></View>
      <View style={styles.metaRow}><SymbolView name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }} size={12} tintColor="#7C3AED" /><Text style={styles.location}>{room}</Text><SymbolView name={{ ios: 'arrow.up.right.square', android: 'open_in_new', web: 'open_in_new' }} size={10} tintColor="#7C3AED" /></View>
    </View>
  );
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index));
}

export default function UserAgendaScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 15));
  const [calendarMonth, setCalendarMonth] = useState(new Date(2025, 8, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }).format(selectedDate);
  const calendarDays = getCalendarDays(calendarMonth);

  const handleNativeDateChange = (_event: unknown, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}><View><Text style={styles.title}>Agenda</Text><Text style={styles.eventName}>Cloud Adoption Summit 2025</Text><Text style={styles.date}>{dateLabel} · 6 sessions</Text></View><Pressable accessibilityLabel="Choose agenda date" accessibilityRole="button" onPress={() => setShowDatePicker(true)} style={styles.dateButton}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={19} tintColor="#7C3AED" /><Text style={styles.dateButtonText}>Choose Date</Text></Pressable></View>
        {showDatePicker && Platform.OS !== 'web' ? <Modal transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}><View style={styles.modalBackdrop}><View style={styles.nativePickerCard}><DateTimePicker value={selectedDate} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={handleNativeDateChange} /><View style={styles.pickerActions}><Pressable onPress={() => setShowDatePicker(false)} style={styles.pickerAction}><Text style={styles.cancelText}>Cancel</Text></Pressable>{Platform.OS === 'ios' ? <Pressable onPress={() => setShowDatePicker(false)} style={styles.pickerAction}><Text style={styles.doneText}>Done</Text></Pressable> : null}</View></View></View></Modal> : null}
        {showDatePicker && Platform.OS === 'web' ? <Modal transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}><Pressable onPress={() => setShowDatePicker(false)} style={styles.modalBackdrop}><Pressable onPress={() => undefined} style={styles.webPickerCard}><Text style={styles.pickerTitle}>Choose a date</Text><View style={styles.calendarHeader}><Pressable accessibilityLabel="Previous month" onPress={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} style={styles.monthButton}><Text style={styles.monthButtonText}>‹</Text></Pressable><Text style={styles.monthTitle}>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(calendarMonth)}</Text><Pressable accessibilityLabel="Next month" onPress={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} style={styles.monthButton}><Text style={styles.monthButtonText}>›</Text></Pressable></View><View style={styles.weekRow}>{WEEKDAYS.map((day) => <Text key={day} style={styles.weekday}>{day}</Text>)}</View><View style={styles.daysGrid}>{calendarDays.map((day) => { const active = day.toDateString() === selectedDate.toDateString(); const isCurrentMonth = day.getMonth() === calendarMonth.getMonth(); return <Pressable key={day.toISOString()} accessibilityLabel={day.toDateString()} accessibilityRole="button" onPress={() => { setSelectedDate(day); setCalendarMonth(new Date(day.getFullYear(), day.getMonth(), 1)); setShowDatePicker(false); }} style={[styles.calendarDay, active && styles.calendarDayActive]}><Text style={[styles.calendarDayText, !isCurrentMonth && styles.outsideMonthDay, active && styles.calendarDayTextActive]}>{day.getDate()}</Text></Pressable>; })}</View><Pressable accessibilityRole="button" onPress={() => setShowDatePicker(false)} style={styles.closePicker}><Text style={styles.closePickerText}>Cancel</Text></Pressable></Pressable></Pressable></Modal> : null}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} style={styles.scroll}>
          <SessionCard track="Keynote" title="Opening Keynote: The Cloud-Native Enterprise" speaker="Dr. Angela Morrison" role="VP Engineering, AWS" initials="DA" time="9:00 AM" duration="90 min" room="Hyatt Regency SF · Main Hall" color="#7C3AED" bookmarked />
          <SessionCard track="Infrastructure" title="Workshop: Kubernetes Platform Engineering at Scale" speaker="Kevin Park" role="Staff Engineer, Stripe" initials="KP" time="10:30 AM" duration="60 min" room="Hyatt Regency SF · Room A" color="#00A878" />
          <SessionCard track="Strategy" title="Panel: Multi-Cloud Strategy in 2025" speaker="Lisa Chen (Moderator)" role="CTO, CloudNative Inc." initials="LC" time="12:00 PM" duration="60 min" room="Hyatt Regency SF · Main Hall" color="#F49A00" bookmarked />
          <SessionCard track="FinOps" title="Deep Dive: Cost Optimisation at Scale" speaker="Marcus Williams" role="Platform Lead, Netflix" initials="MW" time="1:30 PM" duration="45 min" room="Hyatt Regency SF · Main Hall" color="#7C3AED" />
          <SessionCard track="Infrastructure" title="Workshop: Infrastructure as Code Best Practices" speaker="Aisha Patel" role="Platform Architect, HashiCorp" initials="AP" time="3:00 PM" duration="60 min" room="Hyatt Regency SF · Room A" color="#00A878" />
          <SessionCard track="Keynote" title="Keynote: AI/ML on Cloud Infrastructure" speaker="Dr. James Chen" role="Director, Google DeepMind" initials="DJ" time="4:30 PM" duration="60 min" room="Hyatt Regency SF · Main Hall" color="#7C3AED" bookmarked />
        </ScrollView>
        <View style={styles.tabBar}>
          <Pressable accessibilityRole="link" onPress={() => router.replace('/dashboard')} style={styles.tab}><SymbolView name={{ ios: 'house', android: 'home', web: 'home' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Home</Text></Pressable>
          <View style={styles.tabActive}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={18} tintColor="#7B3FF0" /><Text style={styles.tabActiveText}>Agenda</Text></View>
          <Pressable accessibilityLabel="Charts" accessibilityRole="link" onPress={() => router.replace('/charts')} style={styles.tab}><SymbolView name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Charts</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/people')} style={styles.tab}><SymbolView name={{ ios: 'person.2', android: 'group', web: 'group' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>People</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/saved')} style={styles.tab}><SymbolView name={{ ios: 'bookmark', android: 'bookmark', web: 'bookmark' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Saved</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/profile')} style={styles.tab}><SymbolView name={{ ios: 'person', android: 'person', web: 'person' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Profile</Text></Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, scroll: { flex: 1 }, header: { paddingHorizontal: 17, paddingTop: 15, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }, title: { color: '#1E273B', fontSize: 25, fontWeight: '800' }, eventName: { color: '#69809C', fontSize: 12, marginTop: 6 }, date: { color: '#51627B', fontSize: 11, fontWeight: '600', marginTop: 5 }, dateButton: { width: 62, height: 52, borderRadius: 9, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: '#F0E9FF' }, dateButtonText: { color: '#7A46DB', fontSize: 8, fontWeight: '700' }, content: { padding: 12, paddingBottom: 24, gap: 10 }, sessionCard: { overflow: 'hidden', padding: 13, borderRadius: 13, borderTopWidth: 4, backgroundColor: '#FFFFFF', shadowColor: '#334360', shadowOpacity: 0.08, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, sessionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, trackPill: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4 }, trackText: { fontSize: 9, fontWeight: '800' }, sessionTitle: { color: '#1E273B', fontSize: 13, lineHeight: 18, fontWeight: '800', marginTop: 9 }, speakerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 }, initials: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, initialsText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' }, speakerName: { color: '#28344A', fontSize: 11, fontWeight: '800', marginLeft: 8 }, speakerRole: { color: '#77849A', fontSize: 9, marginLeft: 8, marginTop: 2 }, line: { height: StyleSheet.hairlineWidth, backgroundColor: '#E4E8F0', marginTop: 12, marginBottom: 9 }, metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }, metaMain: { color: '#354057', fontSize: 10, fontWeight: '700' }, metaText: { color: '#7C879A', fontSize: 10 }, location: { color: '#6F3CE1', fontSize: 10, fontWeight: '600' }, tabBar: { height: 67, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E3E8F0', backgroundColor: '#FFFFFF' }, tab: { flex: 1, alignItems: 'center', gap: 3 }, tabActive: { flex: 1, alignItems: 'center', gap: 3 }, tabText: { color: '#64748B', fontSize: 8, fontWeight: '600' }, tabActiveText: { color: '#7B3FF0', fontSize: 8, fontWeight: '800' },
  modalBackdrop: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(25, 34, 53, 0.38)' }, nativePickerCard: { width: '100%', maxWidth: 340, padding: 14, borderRadius: 16, backgroundColor: '#FFFFFF' }, pickerActions: { marginTop: 4, flexDirection: 'row', justifyContent: 'flex-end', gap: 14 }, pickerAction: { paddingHorizontal: 8, paddingVertical: 7 }, cancelText: { fontSize: 14, fontWeight: '700', color: '#64748B' }, doneText: { fontSize: 14, fontWeight: '800', color: '#7C3AED' }, webPickerCard: { width: '100%', maxWidth: 340, padding: 18, borderRadius: 16, backgroundColor: '#FFFFFF', shadowColor: '#172033', shadowOpacity: 0.2, shadowRadius: 18, elevation: 5 }, pickerTitle: { marginBottom: 12, fontSize: 17, fontWeight: '800', color: '#202A3E' }, calendarHeader: { marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, monthButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#F0E9FF' }, monthButtonText: { marginTop: -2, fontSize: 23, lineHeight: 25, fontWeight: '700', color: '#7C3AED' }, monthTitle: { fontSize: 14, fontWeight: '800', color: '#28344A' }, weekRow: { flexDirection: 'row', marginBottom: 4 }, weekday: { width: '14.2857%', paddingVertical: 5, textAlign: 'center', fontSize: 10, fontWeight: '800', color: '#7A879B' }, daysGrid: { flexDirection: 'row', flexWrap: 'wrap' }, calendarDay: { width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }, calendarDayActive: { backgroundColor: '#7C3AED' }, calendarDayText: { fontSize: 12, fontWeight: '700', color: '#354057' }, outsideMonthDay: { color: '#BCC4D0' }, calendarDayTextActive: { color: '#FFFFFF' }, closePicker: { marginTop: 10, alignSelf: 'flex-end', paddingHorizontal: 7, paddingVertical: 8 }, closePickerText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
});
