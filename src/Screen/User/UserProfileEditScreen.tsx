// import { useRouter } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { SymbolView } from 'expo-symbols';
// import { useState } from 'react';
// import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '../../context/AuthContext';

// const PROFILE_UPDATE_ENDPOINT = process.env.EXPO_PUBLIC_USER_PROFILE_URL;

// type EditableFieldProps = {
//   label: string;
//   value: string;
//   onChangeText: (value: string) => void;
//   keyboardType?: 'default' | 'phone-pad' | 'url';
//   multiline?: boolean;
//   placeholder?: string;
//   icon?: { ios: string; android: string; web: string };
// };

// function EditableField({ label, value, onChangeText, keyboardType = 'default', multiline, placeholder, icon }: EditableFieldProps) {
//   return (
//     <View style={styles.field}>
//       <Text style={styles.fieldLabel}>{label}</Text>
//       <View style={[styles.inputWrap, multiline && styles.multilineWrap]}>
//         <TextInput
//           style={[styles.input, multiline && styles.multilineInput]}
//           value={value}
//           onChangeText={onChangeText}
//           keyboardType={keyboardType}
//           multiline={multiline}
//           placeholder={placeholder}
//           placeholderTextColor="#98A2B3"
//           textAlignVertical={multiline ? "top" : "center"}
//         />
//         {icon ? <SymbolView name={icon as never} size={12} tintColor="#71809A" /> : null}
//       </View>
//     </View>
//   );
// }

// export default function UserProfileEditScreen() {
//   const router = useRouter();
//   const { user, updateUser, isLoading } = useAuth();
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const [form, setForm] = useState({
//   name: user?.name || '',
//   phone: user?.phone || '',
//   company: user?.company_name || '',
//   designation: user?.designation || '',
//   city: user?.city || '',
//   state: user?.state || '',
//   interest: user?.area_of_interest || '',
//   linkedin: user?.linkedin_url || '',
//   remarks: user?.remarks || '',
// }); 

//   const userInitials = (user?.name || 'User')
//     .split(' ')
//     .map((n) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
//   const updateField = (field: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [field]: value }));

//   const saveProfile = async () => {
//     setError('');
//     setSuccess(false);
//     setIsSaving(true);

//     try {
//       // Call the profile update API
//       if (!PROFILE_UPDATE_ENDPOINT) {
//         throw new Error('Profile service is not configured. Please contact support.');
//       }

//       const headers: Record<string, string> = {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       };

//       // Add authorization header if token is available
//       if (user?.token) {
//         headers.Authorization = `Bearer ${user.token}`;
//       }

//      const requestData = {
//       name: form.name,
//       email: user?.email,
//       phone: form.phone,
//       company_name: form.company,
//       designation: form.designation,
//       city: form.city,
//       state: form.state,
//       area_of_interest: form.interest,
//       linkedin_url: form.linkedin,
//       remarks: form.remarks,
// };

//   const response = await fetch(PROFILE_UPDATE_ENDPOINT, {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify(requestData),
//       });
// const responseText = await response.text();
// let data: any = {};

//       try {
//         data = responseText ? JSON.parse(responseText) : {};
//       } catch {
//         console.log('Response is not JSON');
//       }
//       if (!response.ok) {
//   throw new Error(
//     data?.message ||
//     data?.error ||
//     `Server Error: ${response.status}`
//   );
// }

//       const isSuccessful = data.success === true || data.status === 'success' || response.ok;
//       if (!isSuccessful) {
//         throw new Error(data.message || 'Failed to save profile. Please try again.');
//       }

//      // Update local user with ALL fields
// await updateUser({
//   name: form.name,
//   email: user?.email,
//   phone: form.phone,
//   company_name: form.company,
//   designation: form.designation,
//   city: form.city,
//   state: form.state,
//   area_of_interest: form.interest,
//   linkedin_url: form.linkedin,
//   remarks: form.remarks,
//   role: user?.role,
//   token: user?.token,
// });
//       setSuccess(true);

//       // Navigate back after 1 second to show success message
//       setTimeout(() => {
//         router.back();
//       }, 1000);
//     } catch (requestError) {
//       setError(requestError instanceof Error ? requestError.message : 'Failed to save profile. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.screen}>
//         <StatusBar style="dark" />
//         <SafeAreaView style={styles.safeArea}>
//           <View style={[styles.content, { alignItems: 'center', justifyContent: 'center' }]}>
//             <Text style={styles.headerTitle}>Loading...</Text>
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <StatusBar style="dark" />
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.header}>
//           <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={8} onPress={() => router.back()} style={styles.backButton}>
//             <Text style={styles.headerTitle}>Profile</Text><Text style={styles.backChevron}>‹</Text>
//           </Pressable>
//           <Pressable accessibilityLabel="Save profile" accessibilityRole="button" onPress={saveProfile} disabled={isSaving} style={[styles.savePill, isSaving && styles.savePillDisabled]}>
//             <Text style={styles.savePillText}>{isSaving ? 'Saving...' : 'Save'}</Text>
//           </Pressable>
//         </View>

//         <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
//           {error ? (
//             <View style={styles.errorContainer}>
//               <SymbolView name={{ ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' }} size={16} tintColor="#EF476F" />
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           ) : null}

//           {success ? (
//             <View style={styles.successContainer}>
//               <SymbolView name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }} size={16} tintColor="#00A56C" />
//               <Text style={styles.successText}>Profile updated successfully!</Text>
//             </View>
//           ) : null}

//           <View style={styles.profileCard}>
//             <View style={styles.avatar}><Text style={styles.avatarText}>{userInitials}</Text></View>
//             <View style={styles.profileCopy}>
//               <Text style={styles.name}>{form.name}</Text>
//               <Text style={styles.role}>{form.designation}</Text>
//               <Text style={styles.company}>{form.company}</Text>
//               <View style={styles.verified}><SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={8} tintColor="#FFFFFF" /><Text style={styles.verifiedText}>Verified Attendee</Text></View>
//             </View>
//           </View>

//           <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
//           <View style={styles.formCard}>
//             <EditableField label="FULL NAME" value={form.name} onChangeText={updateField('name')} />
//             <EditableField label="PHONE" value={form.phone} onChangeText={updateField('phone')} keyboardType="phone-pad" />
//             <EditableField label="COMPANY" value={form.company} onChangeText={updateField('company')} />
//             <EditableField label="DESIGNATION" value={form.designation} onChangeText={updateField('designation')} />
//             <EditableField label="CITY" value={form.city} onChangeText={updateField('city')} />
//             <EditableField label="STATE" value={form.state} onChangeText={updateField('state')} />
//           </View>

//           <Text style={styles.sectionTitle}>INTERESTS</Text>
//           <View style={styles.formCard}>
//             <EditableField label="AREA OF INTEREST" value={form.interest} onChangeText={updateField('interest')} />
//             <EditableField label="LINKEDIN URL" value={form.linkedin} onChangeText={updateField('linkedin')} keyboardType="url" icon={{ ios: 'link', android: 'link', web: 'link' }} />
//             <EditableField label="REMARKS" value={form.remarks} onChangeText={updateField('remarks')} multiline placeholder="Notes for organisers" />
//           </View>

//           <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
//           <View style={styles.notificationCard}>
//             <View style={styles.bell}><SymbolView name={{ ios: 'bell', android: 'notifications', web: 'notifications' }} size={15} tintColor="#7C3AED" /></View>
//             <View style={styles.notificationCopy}><Text style={styles.notificationTitle}>Push Notifications</Text><Text style={styles.notificationDetail}>Session reminders & announcements</Text></View>
//             <Pressable accessibilityLabel="Push notifications" accessibilityRole="switch" accessibilityState={{ checked: pushNotificationsEnabled }} hitSlop={8} onPress={() => setPushNotificationsEnabled((enabled) => !enabled)} style={[styles.toggle, !pushNotificationsEnabled && styles.toggleOff]}><View style={styles.toggleKnob} /></Pressable>
//           </View>

//           <Pressable accessibilityLabel="Save changes" accessibilityRole="button" onPress={saveProfile} disabled={isSaving} style={[styles.saveChanges, isSaving && styles.saveChangesDisabled]}><Text style={styles.saveChangesText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text></Pressable>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#F7F8FC' },
//   safeArea: { flex: 1 },
//   header: { height: 51, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5EAF0' },
//   backButton: { flexDirection: 'row', alignItems: 'center' },
//   headerTitle: { fontSize: 12, fontWeight: '800', color: '#202A3E' },
//   backChevron: { marginLeft: 2, marginTop: -2, fontSize: 17, fontWeight: '700', color: '#202A3E' },
//   savePill: { minWidth: 36, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center', borderRadius: 14, backgroundColor: '#7C3AED' },
//   savePillText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
//   savePillDisabled: { opacity: 0.6 },
//   content: { padding: 9, paddingBottom: 20 },
//   profileCard: { minHeight: 78, padding: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 11, backgroundColor: '#FFFFFF', shadowColor: '#31415E', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
//   avatar: { width: 35, height: 35, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' },
//   avatarText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
//   profileCopy: { marginLeft: 10 },
//   name: { fontSize: 12, fontWeight: '800', color: '#283247' },
//   role: { marginTop: 2, fontSize: 9, color: '#61718A' },
//   company: { marginTop: 1, fontSize: 9, color: '#61718A' },
//   verified: { alignSelf: 'flex-start', marginTop: 5, paddingHorizontal: 6, paddingVertical: 2, gap: 2, flexDirection: 'row', alignItems: 'center', borderRadius: 8, backgroundColor: '#00A56C' },
//   verifiedText: { fontSize: 7, fontWeight: '800', color: '#FFFFFF' },
//   sectionTitle: { marginTop: 14, marginBottom: 6, fontSize: 8, fontWeight: '800', letterSpacing: 0.45, color: '#62718A' },
//   formCard: { padding: 9, borderRadius: 10, backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.05, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
//   field: { marginBottom: 9 },
//   fieldLabel: { marginBottom: 4, fontSize: 7, fontWeight: '800', letterSpacing: 0.2, color: '#7C3AED' },
//   inputWrap: { height: 27, paddingRight: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 6, borderColor: '#8B45F7' },
//   input: { flex: 1, height: '100%', paddingHorizontal: 8, paddingVertical: 0, color: '#354057', fontSize: 9 },
//   multilineWrap: { height: 49, alignItems: 'flex-start' },
//   multilineInput: { paddingTop: 7, paddingBottom: 5 },
//   selectInput: { height: 27, marginBottom: 9, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 6, borderColor: '#8B45F7' },
//   selectText: { fontSize: 9, color: '#354057' },
//   placeholder: { color: '#98A2B3' },
//   notificationCard: { minHeight: 48, padding: 9, flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.05, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
//   bell: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#F0E9FF' },
//   notificationCopy: { flex: 1, marginLeft: 8 },
//   notificationTitle: { fontSize: 9, fontWeight: '800', color: '#28334A' },
//   notificationDetail: { marginTop: 2, fontSize: 7, color: '#748198' },
//   toggle: { width: 29, height: 18, padding: 2, alignItems: 'flex-end', borderRadius: 10, backgroundColor: '#7C3AED' },
//   toggleOff: { alignItems: 'flex-start', backgroundColor: '#B8C1CF' },
//   toggleKnob: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF' },
//   saveChanges: { height: 31, marginTop: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: '#7C3AED', shadowColor: '#7C3AED', shadowOpacity: 0.28, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
//   saveChangesText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
//   saveChangesDisabled: { opacity: 0.6 },
//   errorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 8, borderRadius: 6, backgroundColor: '#FFE8F0', gap: 8 },
//   errorText: { flex: 1, fontSize: 9, color: '#EF476F', fontWeight: '600' },
//   successContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 8, borderRadius: 6, backgroundColor: '#E8F5F1', gap: 8 },
//   successText: { flex: 1, fontSize: 9, color: '#00A56C', fontWeight: '600' },
// });

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const LOGOUT_ENDPOINT = process.env.EXPO_PUBLIC_USER_LOGOUT_URL;

const personalDetails = [['Name', 'Sarah Chen'], ['Phone', '+1 (415) 555-0142'], ['Company', 'Microsoft'], ['Designation', 'Cloud Architect'], ['LinkedIn', 'linkedin.com/in/sarahchen']];

function InfoRow({ label, value, locked, ticket }: { label: string; value: string; locked?: boolean; ticket?: boolean }) {
  return <View style={styles.infoRow}><View><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>{locked ? <SymbolView name={{ ios: 'lock', android: 'lock', web: 'lock' }} size={14} tintColor="#70819A" /> : ticket ? <Text style={styles.ticket}>#</Text> : null}</View>;
}

export default function UserProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);

  const userName = user?.name || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userRole = user?.role || 'Attendee';
  const userDesignation = user?.designation || '-';
  const userCompany = user?.company_name || '-';

  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const personalDetails = [
    ['Name', userName],
    ['Phone', user?.phone || '-'],
    ['Company', user?.company_name || '-'],
    ['Designation', user?.designation || '-'],
    ['LinkedIn', user?.linkedin_url || '-'],
  ];

  const handleSignOut = async () => {
    try {
      if (LOGOUT_ENDPOINT && user?.email) {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

        // Add authorization header if token is available
        if (user?.token) {
          headers.Authorization = `Bearer ${user.token}`;
        }

        await fetch(LOGOUT_ENDPOINT, {
          method: 'POST',
          headers,
          body: JSON.stringify({ email: user.email }),
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear user data regardless of API success
      await logout();
      router.dismissAll();
      router.replace('/');
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

  return <View style={styles.screen}><StatusBar style="dark" />
    <SafeAreaView style={styles.safeArea}>
      <View
        style={styles.header}>
        <Text style={styles.headerTitle}>
          Profile</Text>

        <Pressable accessibilityLabel="Edit profile"
          accessibilityRole="button"
          onPress={() => router.push('/profile-edit')}
          style={styles.editButton}>
          <SymbolView
            name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
            size={14} tintColor="#7C3AED" />
          <Text style={styles.editText}>Edit</Text>
        </Pressable></View>
      <ScrollView contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials}

            </Text>
          </View>
          <View style={styles.profileCopy}>

            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.role}>{userRole}</Text>
            <Text style={styles.company}>{userCompany}</Text>

            <View style={styles.verified}>
              <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={10} tintColor="#FFF" /><Text style={styles.verifiedText}>Verified Attendee</Text></View></View></View>
        <Text style={styles.section}>Account Information</Text>
        <View style={styles.accountCard}><InfoRow label="Conference" value={user?.conference_title || '-'} locked /><InfoRow label="Eventbrite Ticket ID" value={user?.ticket_reference || '-'} ticket /><InfoRow label="Email Address" value={userEmail} locked /></View><Text style={styles.note}>These fields are set at registration and cannot be changed.</Text>
        <Text style={styles.section}>Personal Details</Text>
        <View style={styles.personalCard}>{personalDetails.map(([label, value], index) => <View key={label} style={[styles.personalRow, index < personalDetails.length - 1 && styles.divider]}><Text style={styles.personalLabel}>{label}</Text><Text style={label === 'LinkedIn' ? styles.link : styles.personalValue}>{value}</Text></View>)}</View>
        <Text style={styles.section}>Notifications</Text>
        <View style={styles.notificationCard}><View style={styles.bell}>
          <SymbolView name={{ ios: 'bell', android: 'notifications', web: 'notifications' }} size={17} tintColor="#7C3AED" /></View><View style={styles.notifyCopy}><Text style={styles.notifyTitle}>Push Notifications</Text><Text style={styles.notifyDetail}>Session reminders & announcements</Text></View><Pressable accessibilityLabel="Push notifications" accessibilityRole="switch" accessibilityState={{ checked: pushNotificationsEnabled }} hitSlop={8} onPress={() => setPushNotificationsEnabled((enabled) => !enabled)} style={[styles.toggle, !pushNotificationsEnabled && styles.toggleOff]}><View style={styles.knob} /></Pressable></View>
        <Pressable accessibilityLabel="Sign out" accessibilityRole="button" onPress={handleSignOut} style={styles.signOut}><Text style={styles.signOutText}>Sign Out</Text></Pressable><Text style={styles.version}>Cloud Adoption Solutions · v1.0.0</Text>
      </ScrollView>
      <View style={styles.tabBar}><Pressable onPress={() => router.replace('/dashboard')} style={styles.tab}><SymbolView name={{ ios: 'house', android: 'home', web: 'home' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Home</Text></Pressable><Pressable onPress={() => router.replace('/agenda')} style={styles.tab}><SymbolView name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Agenda</Text></Pressable><Pressable accessibilityLabel="Charts" accessibilityRole="link" onPress={() => router.replace('/charts')} style={styles.tab}><SymbolView name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Charts</Text></Pressable><Pressable accessibilityLabel="People" accessibilityRole="link" onPress={() => router.replace('/people')} style={styles.tab}><SymbolView name={{ ios: 'person.2', android: 'group', web: 'group' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>People</Text></Pressable><Pressable onPress={() => router.replace('/saved')} style={styles.tab}><SymbolView name={{ ios: 'bookmark', android: 'bookmark', web: 'bookmark' }} size={18} tintColor="#64748B" /><Text style={styles.tabText}>Saved</Text></Pressable><View style={styles.tabActive}><SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' }} size={18} tintColor="#7B3FF0" /><Text style={styles.tabActiveText}>Profile</Text></View></View>
    </SafeAreaView></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F8FC' }, safeArea: { flex: 1 }, header: { height: 55, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5EAF1' }, headerTitle: { color: '#202A3E', fontSize: 16, fontWeight: '800' }, editButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0E9FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }, editText: { color: '#7C3AED', fontSize: 11, fontWeight: '800' }, content: { padding: 12, paddingBottom: 25 }, profileCard: { padding: 14, borderRadius: 14, flexDirection: 'row', backgroundColor: '#FFF', shadowColor: '#31415E', shadowOpacity: .08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, avatar: { width: 45, height: 45, borderRadius: 8, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#FFF', fontSize: 16, fontWeight: '800' }, profileCopy: { marginLeft: 11 }, name: { color: '#273147', fontSize: 16, fontWeight: '800' }, role: { color: '#697991', fontSize: 11, marginTop: 2 }, company: { color: '#697991', fontSize: 11, marginTop: 1 }, verified: { alignSelf: 'flex-start', flexDirection: 'row', gap: 3, marginTop: 7, backgroundColor: '#00A56C', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 9 }, verifiedText: { color: '#FFF', fontSize: 8, fontWeight: '800' }, section: { color: '#65758D', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: .7, marginTop: 17, marginBottom: 7 }, accountCard: { overflow: 'hidden', borderRadius: 13, backgroundColor: '#FFF' }, infoRow: { minHeight: 52, padding: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EEF3F9', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#DDE4ED' }, infoLabel: { color: '#63738B', fontSize: 9, textTransform: 'uppercase', fontWeight: '800' }, infoValue: { color: '#657791', fontSize: 12, marginTop: 4 }, ticket: { color: '#657791', fontSize: 16 }, note: { color: '#738198', fontSize: 9, marginTop: 7 }, personalCard: { borderRadius: 13, paddingHorizontal: 12, backgroundColor: '#FFF' }, personalRow: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E6EAF0' }, personalLabel: { color: '#313C51', fontSize: 11, fontWeight: '700' }, personalValue: { color: '#657791', fontSize: 11 }, link: { color: '#7140E5', fontSize: 11 }, notificationCard: { padding: 12, borderRadius: 13, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF' }, bell: { width: 31, height: 31, borderRadius: 8, backgroundColor: '#EFE9FF', alignItems: 'center', justifyContent: 'center' }, notifyCopy: { flex: 1, marginLeft: 9 }, notifyTitle: { color: '#28334A', fontSize: 12, fontWeight: '800' }, notifyDetail: { color: '#748198', fontSize: 9, marginTop: 3 }, toggle: { width: 36, height: 22, padding: 2, borderRadius: 12, alignItems: 'flex-end', backgroundColor: '#7C3AED' }, toggleOff: { alignItems: 'flex-start', backgroundColor: '#B8C1CF' }, knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFF' }, signOut: { height: 42, marginTop: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1BCC3', backgroundColor: '#FEF3F4' }, signOutText: { color: '#E22F42', fontSize: 13, fontWeight: '800' }, version: { color: '#CBD2DF', fontSize: 10, textAlign: 'center', marginTop: 14 }, tabBar: { height: 67, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E3E8F0', backgroundColor: '#FFF' }, tab: { flex: 1, alignItems: 'center', gap: 3 }, tabActive: { flex: 1, alignItems: 'center', gap: 3 }, tabText: { color: '#64748B', fontSize: 8, fontWeight: '600' }, tabActiveText: { color: '#7B3FF0', fontSize: 8, fontWeight: '800' } });
