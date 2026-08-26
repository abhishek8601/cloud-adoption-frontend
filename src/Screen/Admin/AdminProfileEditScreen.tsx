import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

type ProfileForm = { name: string; phone: string; company_name: string; designation: string; city: string; state: string; area_of_interest: string; linkedin_url: string };
const createForm = (profile?: Partial<ProfileForm>): ProfileForm => ({ name: profile?.name || '', phone: profile?.phone || '', company_name: profile?.company_name || '', designation: profile?.designation || '', city: profile?.city || '', state: profile?.state || '', area_of_interest: profile?.area_of_interest || '', linkedin_url: profile?.linkedin_url || '' });

function Field({ label, value, editable = true, onChangeText }: { label: string; value: string; editable?: boolean; onChangeText?: (value: string) => void }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} editable={editable} keyboardType={label === 'PHONE' ? 'phone-pad' : label === 'LINKEDIN URL' ? 'url' : 'default'} onChangeText={onChangeText} style={[styles.input, !editable && styles.lockedInput]} value={value} /></View>;
}

export default function AdminProfileEditScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState<ProfileForm>(() => createForm(user || undefined));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const name = form.name || user?.name || '-';
  const initials = name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2) || 'A';
  const rawRole = typeof user?.role === 'string' ? user.role : 'Administrator';
  const role = rawRole.replace(/\b\w/g, (letter) => letter.toUpperCase());
  const updateField = (field: keyof ProfileForm) => (value: string) => setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (!user?.token) return;
    const token = user.token;
    const load = async () => {
      try {
        const response = await api.me(token);
        const profile = response.data?.user || response.data;
        if (profile) {
          const normalized = { ...profile, role: profile.role?.name || profile.role };
          await updateUser(normalized);
          setForm(createForm(profile));
        }
      } catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Unable to load your profile.'); }
    };
    void load();
  }, [user?.token]);

  const saveProfile = async () => {
    if (!form.name.trim() || !form.company_name.trim() || !form.designation.trim() || !form.city.trim() || !form.state.trim()) { setError('Please complete all required profile fields.'); return; }
    if (!user?.token) { setError('Your session has expired. Please sign in again.'); return; }
    setError(''); setIsSaving(true);
    try {
      const payload = { ...form, name: form.name.trim(), phone: form.phone.trim(), company_name: form.company_name.trim(), designation: form.designation.trim(), city: form.city.trim(), state: form.state.trim(), area_of_interest: form.area_of_interest.trim(), linkedin_url: form.linkedin_url.trim(), email: user.email };
      const response = await api.updateProfile(user.token, payload);
      const profile = response.data?.user || response.data || {};
      await updateUser({ ...form, ...profile, role: profile.role?.name || profile.role });
      Alert.alert('Profile updated', response.message || 'Your profile changes have been saved.', [{ text: 'Done', onPress: () => router.back() }]);
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Unable to save profile changes.'); } finally { setIsSaving(false); }
  };

  return <View style={styles.screen}><StatusBar style="dark" /><SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><Pressable onPress={() => router.back()}><Text style={styles.back}>Back to Profile</Text></Pressable><Pressable disabled={isSaving} onPress={saveProfile} style={[styles.savePill, isSaving && styles.disabled]}><Text style={styles.savePillText}>{isSaving ? 'Saving...' : 'Save'}</Text></Pressable></View>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View><View><Text style={styles.name}>{name}</Text><Text style={styles.company}>{form.company_name || '-'}</Text><Text style={styles.role}>{role}</Text></View></View>
      <Text style={styles.section}>ACCOUNT DETAILS</Text><View style={styles.card}>
        <Field label="FULL NAME" value={form.name} onChangeText={updateField('name')} /><Field label="PHONE" value={form.phone} onChangeText={updateField('phone')} /><Field label="COMPANY NAME" value={form.company_name} onChangeText={updateField('company_name')} /><Field label="DESIGNATION" value={form.designation} onChangeText={updateField('designation')} /><Field label="CITY" value={form.city} onChangeText={updateField('city')} /><Field label="STATE" value={form.state} onChangeText={updateField('state')} /><Field label="AREA OF INTEREST" value={form.area_of_interest} onChangeText={updateField('area_of_interest')} /><Field label="LINKEDIN URL" value={form.linkedin_url} onChangeText={updateField('linkedin_url')} /><Field label="EMAIL ADDRESS" value={user?.email || '-'} editable={false} /><Field label="ACCESS LEVEL" value={role} editable={false} />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </View>
      <Pressable disabled={isSaving} onPress={saveProfile} style={[styles.saveChanges, isSaving && styles.disabled]}><Text style={styles.saveChangesText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text></Pressable>
    </ScrollView></KeyboardAvoidingView>
  </SafeAreaView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, flex: { flex: 1 }, header: { height: 52, paddingHorizontal: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }, back: { color: '#253046', fontSize: 11, fontWeight: '800' }, savePill: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 15, backgroundColor: '#7C3AED' }, savePillText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' }, content: { padding: 12, paddingBottom: 24 }, profileCard: { padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF' }, avatar: { width: 46, height: 46, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' }, avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' }, name: { marginLeft: 10, color: '#253046', fontSize: 13, fontWeight: '800' }, company: { marginLeft: 10, marginTop: 3, color: '#65758C', fontSize: 9 }, role: { marginLeft: 10, marginTop: 5, color: '#7C3AED', fontSize: 8 }, section: { marginTop: 15, marginBottom: 7, color: '#62718A', fontSize: 9, fontWeight: '800' }, card: { padding: 12, borderRadius: 12, backgroundColor: '#FFFFFF' }, field: { marginBottom: 10 }, label: { marginBottom: 5, color: '#7C3AED', fontSize: 8, fontWeight: '800' }, input: { height: 38, paddingHorizontal: 10, borderWidth: 1, borderRadius: 7, borderColor: '#8B45F7', color: '#354057', fontSize: 11 }, lockedInput: { borderColor: '#DCE3EC', backgroundColor: '#EEF3F9', color: '#65758C' }, error: { color: '#D92D3A', fontSize: 10 }, saveChanges: { height: 42, marginTop: 17, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#7C3AED' }, disabled: { opacity: 0.6 }, saveChangesText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
});
