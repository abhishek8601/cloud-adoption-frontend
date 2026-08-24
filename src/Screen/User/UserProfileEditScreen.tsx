import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const PROFILE_UPDATE_ENDPOINT = process.env.EXPO_PUBLIC_USER_PROFILE_URL;

type EditableFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'url';
  multiline?: boolean;
  placeholder?: string;
  icon?: { ios: string; android: string; web: string };
};

function EditableField({ label, value, onChangeText, keyboardType = 'default', multiline, placeholder, icon }: EditableFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.multilineWrap]}>
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          placeholder={placeholder}
          placeholderTextColor="#98A2B3"
          textAlignVertical={multiline ? "top" : "center"}
        />
        {icon ? <SymbolView name={icon as never} size={12} tintColor="#71809A" /> : null}
      </View>
    </View>
  );
}

export default function UserProfileEditScreen() {
  const router = useRouter();
  const { user, updateUser, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
  name: user?.name || '',
  phone: user?.phone || '',
  company: user?.company_name || '',
  designation: user?.designation || '',
  city: user?.city || '',
  state: user?.state || '',
  interest: user?.area_of_interest || '',
  linkedin: user?.linkedin_url || '',
  remarks: user?.remarks || '',
}); 

  const userInitials = (user?.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const updateField = (field: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [field]: value }));

  const saveProfile = async () => {
    setError('');
    setSuccess(false);
    setIsSaving(true);

    try {
      // Call the profile update API
      if (!PROFILE_UPDATE_ENDPOINT) {
        throw new Error('Profile service is not configured. Please contact support.');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      // Add authorization header if token is available
      if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`;
      }

     const requestData = {
      name: form.name,
      email: user?.email,
      phone: form.phone,
      company_name: form.company,
      designation: form.designation,
      city: form.city,
      state: form.state,
      area_of_interest: form.interest,
      linkedin_url: form.linkedin,
      remarks: form.remarks,
};

  const response = await fetch(PROFILE_UPDATE_ENDPOINT, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestData),
      });
const responseText = await response.text();
let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        console.log('Response is not JSON');
      }
      if (!response.ok) {
  throw new Error(
    data?.message ||
    data?.error ||
    `Server Error: ${response.status}`
  );
}

      const isSuccessful = data.success === true || data.status === 'success' || response.ok;
      if (!isSuccessful) {
        throw new Error(data.message || 'Failed to save profile. Please try again.');
      }

     // Update local user with ALL fields
await updateUser({
  name: form.name,
  email: user?.email,
  phone: form.phone,
  company_name: form.company,
  designation: form.designation,
  city: form.city,
  state: form.state,
  area_of_interest: form.interest,
  linkedin_url: form.linkedin,
  remarks: form.remarks,
  role: user?.role,
  token: user?.token,
});
      setSuccess(true);

      // Navigate back after 1 second to show success message
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.content, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={8} onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.headerTitle}>Profile</Text><Text style={styles.backChevron}>‹</Text>
          </Pressable>
          <Pressable accessibilityLabel="Save profile" accessibilityRole="button" onPress={saveProfile} disabled={isSaving} style={[styles.savePill, isSaving && styles.savePillDisabled]}>
            <Text style={styles.savePillText}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {error ? (
            <View style={styles.errorContainer}>
              <SymbolView name={{ ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' }} size={16} tintColor="#EF476F" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View style={styles.successContainer}>
              <SymbolView name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }} size={16} tintColor="#00A56C" />
              <Text style={styles.successText}>Profile updated successfully!</Text>
            </View>
          ) : null}

          <View style={styles.profileCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{userInitials}</Text></View>
            <View style={styles.profileCopy}>
              <Text style={styles.name}>{form.name}</Text>
              <Text style={styles.role}>{form.designation}</Text>
              <Text style={styles.company}>{form.company}</Text>
              <View style={styles.verified}><SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={8} tintColor="#FFFFFF" /><Text style={styles.verifiedText}>Verified Attendee</Text></View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
          <View style={styles.formCard}>
            <EditableField label="FULL NAME" value={form.name} onChangeText={updateField('name')} />
            <EditableField label="PHONE" value={form.phone} onChangeText={updateField('phone')} keyboardType="phone-pad" />
            <EditableField label="COMPANY" value={form.company} onChangeText={updateField('company')} />
            <EditableField label="DESIGNATION" value={form.designation} onChangeText={updateField('designation')} />
            <EditableField label="CITY" value={form.city} onChangeText={updateField('city')} />
            <EditableField label="STATE" value={form.state} onChangeText={updateField('state')} />
          </View>

          <Text style={styles.sectionTitle}>INTERESTS</Text>
          <View style={styles.formCard}>
            <EditableField label="AREA OF INTEREST" value={form.interest} onChangeText={updateField('interest')} />
            <EditableField label="LINKEDIN URL" value={form.linkedin} onChangeText={updateField('linkedin')} keyboardType="url" icon={{ ios: 'link', android: 'link', web: 'link' }} />
            <EditableField label="REMARKS" value={form.remarks} onChangeText={updateField('remarks')} multiline placeholder="Notes for organisers" />
          </View>

          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.notificationCard}>
            <View style={styles.bell}><SymbolView name={{ ios: 'bell', android: 'notifications', web: 'notifications' }} size={15} tintColor="#7C3AED" /></View>
            <View style={styles.notificationCopy}><Text style={styles.notificationTitle}>Push Notifications</Text><Text style={styles.notificationDetail}>Session reminders & announcements</Text></View>
            <Pressable accessibilityLabel="Push notifications" accessibilityRole="switch" accessibilityState={{ checked: pushNotificationsEnabled }} hitSlop={8} onPress={() => setPushNotificationsEnabled((enabled) => !enabled)} style={[styles.toggle, !pushNotificationsEnabled && styles.toggleOff]}><View style={styles.toggleKnob} /></Pressable>
          </View>

          <Pressable accessibilityLabel="Save changes" accessibilityRole="button" onPress={saveProfile} disabled={isSaving} style={[styles.saveChanges, isSaving && styles.saveChangesDisabled]}><Text style={styles.saveChangesText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text></Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  header: { height: 51, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5EAF0' },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 12, fontWeight: '800', color: '#202A3E' },
  backChevron: { marginLeft: 2, marginTop: -2, fontSize: 17, fontWeight: '700', color: '#202A3E' },
  savePill: { minWidth: 36, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center', borderRadius: 14, backgroundColor: '#7C3AED' },
  savePillText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  savePillDisabled: { opacity: 0.6 },
  content: { padding: 9, paddingBottom: 20 },
  profileCard: { minHeight: 78, padding: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 11, backgroundColor: '#FFFFFF', shadowColor: '#31415E', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  avatar: { width: 35, height: 35, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' },
  avatarText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  profileCopy: { marginLeft: 10 },
  name: { fontSize: 12, fontWeight: '800', color: '#283247' },
  role: { marginTop: 2, fontSize: 9, color: '#61718A' },
  company: { marginTop: 1, fontSize: 9, color: '#61718A' },
  verified: { alignSelf: 'flex-start', marginTop: 5, paddingHorizontal: 6, paddingVertical: 2, gap: 2, flexDirection: 'row', alignItems: 'center', borderRadius: 8, backgroundColor: '#00A56C' },
  verifiedText: { fontSize: 7, fontWeight: '800', color: '#FFFFFF' },
  sectionTitle: { marginTop: 14, marginBottom: 6, fontSize: 8, fontWeight: '800', letterSpacing: 0.45, color: '#62718A' },
  formCard: { padding: 9, borderRadius: 10, backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.05, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  field: { marginBottom: 9 },
  fieldLabel: { marginBottom: 4, fontSize: 7, fontWeight: '800', letterSpacing: 0.2, color: '#7C3AED' },
  inputWrap: { height: 27, paddingRight: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 6, borderColor: '#8B45F7' },
  input: { flex: 1, height: '100%', paddingHorizontal: 8, paddingVertical: 0, color: '#354057', fontSize: 9 },
  multilineWrap: { height: 49, alignItems: 'flex-start' },
  multilineInput: { paddingTop: 7, paddingBottom: 5 },
  selectInput: { height: 27, marginBottom: 9, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 6, borderColor: '#8B45F7' },
  selectText: { fontSize: 9, color: '#354057' },
  placeholder: { color: '#98A2B3' },
  notificationCard: { minHeight: 48, padding: 9, flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.05, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  bell: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#F0E9FF' },
  notificationCopy: { flex: 1, marginLeft: 8 },
  notificationTitle: { fontSize: 9, fontWeight: '800', color: '#28334A' },
  notificationDetail: { marginTop: 2, fontSize: 7, color: '#748198' },
  toggle: { width: 29, height: 18, padding: 2, alignItems: 'flex-end', borderRadius: 10, backgroundColor: '#7C3AED' },
  toggleOff: { alignItems: 'flex-start', backgroundColor: '#B8C1CF' },
  toggleKnob: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF' },
  saveChanges: { height: 31, marginTop: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: '#7C3AED', shadowColor: '#7C3AED', shadowOpacity: 0.28, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  saveChangesText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  saveChangesDisabled: { opacity: 0.6 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 8, borderRadius: 6, backgroundColor: '#FFE8F0', gap: 8 },
  errorText: { flex: 1, fontSize: 9, color: '#EF476F', fontWeight: '600' },
  successContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 8, borderRadius: 6, backgroundColor: '#E8F5F1', gap: 8 },
  successText: { flex: 1, fontSize: 9, color: '#00A56C', fontWeight: '600' },
});
