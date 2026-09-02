

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import PeopleDirectory, { type Person } from '../Common/PeopleDirectory';

const AVATAR_COLORS = ['#7C3AED', '#00A878', '#E98200', '#8B55ED', '#E51D47', '#E3302D', '#0B98B5'];

const tabs = [['Home', 'house', '/dashboard'], ['Agenda', 'calendar', '/agenda'], ['Charts', 'chart.bar', '/charts'], ['People', 'person.2', ''], ['Saved', 'bookmark', '/saved'], ['Profile', 'person', '/profile']] as const;

export default function UserPeopleScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [attendees, setAttendees] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        if (!user?.token) return;
        const token = user.token;
        setLoading(true);
        try {
            const [attendeeRes, bookmarkRes] = await Promise.all([
                api.myAttendees(token),
                api.bookmarks(token).catch(() => ({ data: [] as any[] })),
            ]);
            const savedIds = new Set((bookmarkRes.data || []).map((b: any) => b.attendee?.id));
            const mapped: Person[] = (attendeeRes.data || [])
                .filter((item) => item.user?.id !== user.id)
                .map((item, index) => ({
                    id: item.registration_id,
                    initials: (item.user?.name || '?')
                        .split(' ')
                        .map((part: string) => part[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2),
                    name: item.user?.name || 'Attendee',
                    role: item.user?.designation || '',
                    company: item.user?.company_name || '',
                    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
                    saved: savedIds.has(item.registration_id),
                }));
            setAttendees(mapped);
            setError('');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load attendees.');
        } finally {
            setLoading(false);
        }
    }, [user?.token, user?.id]);

    useEffect(() => { load(); }, [load]);

    const toggleSave = async (person: Person) => {
        if (!user?.token || !person.id) return;
        const nextSaved = !person.saved;
        setAttendees((current) => current.map((p) => (p.id === person.id ? { ...p, saved: nextSaved } : p)));
        try {
            if (nextSaved) await api.addBookmark(user.token, person.id);
            else await api.removeBookmark(user.token, person.id);
        } catch {
            // revert on failure
            setAttendees((current) => current.map((p) => (p.id === person.id ? { ...p, saved: !nextSaved } : p)));
        }
    };

    return <View style={s.screen}><StatusBar style="dark" /><SafeAreaView style={s.safe}><View style={s.content}><PeopleDirectory data={attendees} loading={loading} error={error} onToggleSave={toggleSave} /></View><View style={s.tabs}>{tabs.map(([label, icon, route]) => <Pressable key={label} onPress={() => route && router.replace(route)} style={s.tab}><SymbolView name={{ ios: icon, android: icon === 'calendar' ? 'calendar_month' : icon === 'person.2' ? 'group' : icon === 'chart.bar' ? 'bar_chart' : icon, web: icon === 'calendar' ? 'calendar_month' : icon === 'person.2' ? 'group' : icon === 'chart.bar' ? 'bar_chart' : icon } as never} size={18} tintColor={label === 'People' ? '#7B3FF0' : '#64748B'} /><Text style={[s.tabText, label === 'People' && s.active]}>{label}</Text></Pressable>)}</View></SafeAreaView></View>;
}
const s = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F8FC' }, safe: { flex: 1 }, content: { flex: 1, padding: 13, paddingBottom: 0 }, tabs: { height: 67, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#E3E8F0', backgroundColor: '#FFF' }, tab: { flex: 1, alignItems: 'center', gap: 3 }, tabText: { fontSize: 8, fontWeight: '600', color: '#64748B' }, active: { fontWeight: '800', color: '#7B3FF0' } });
