import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function LockedField({ label, value, icon }: { label: string; value: string; icon: { ios: string; android: string; web: string } }) {
  return (
    <View style={styles.lockedField}>
      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.lockedValue}>{value}</Text>
      </View>
      <SymbolView name={icon as never} size={12} tintColor="#718098" />
    </View>
  );
}

export default function SuperAdminProfileEditScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}><Text style={styles.headerTitle}>My Profile</Text></View>
        <View style={styles.pageBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backChevron}>‹</Text><Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.pageTitle}>Profile</Text>
          <Pressable style={styles.savePill}><Text style={styles.savePillText}>Save</Text></Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}><Text style={styles.avatarText}>CA</Text></View>
            <View style={styles.profileCopy}>
              <Text style={styles.name}>Admin User</Text>
              <Text style={styles.company}>Cloud Adoption Solutions</Text>
              <View style={styles.roleBadge}>
                <SymbolView name={{ ios: 'shield.fill', android: 'shield', web: 'shield' }} size={9} tintColor="#7C3AED" />
                <Text style={styles.roleText}>Administrator</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
          <View style={styles.detailsCard}>
            <Text style={styles.editLabel}>FULL NAME</Text>
            <TextInput style={styles.input} defaultValue="Admin User" placeholderTextColor="#65758C" />
            <Text style={styles.editLabel}>PHONE</Text>
            <TextInput style={styles.input} defaultValue="+1 (415) 555-0100" keyboardType="phone-pad" placeholderTextColor="#65758C" />
            <LockedField label="EMAIL ADDRESS" value="admin@cloudadoptionsolutions.com" icon={{ ios: 'lock', android: 'lock', web: 'lock' }} />
            <LockedField label="ACCESS LEVEL" value="Full Administrator Access" icon={{ ios: 'shield', android: 'shield', web: 'shield' }} />
          </View>

          <Text style={styles.sectionTitle}>SECURITY</Text>
          <View style={styles.card}>
            {['Change Password', 'Two-Factor Authentication'].map((label) => (
              <Pressable key={label} style={styles.securityRow}>
                <Text style={styles.securityLink}>{label}</Text><Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>APPLICATION</Text>
          <View style={styles.card}>
            <InfoRow label="Version" value="1.0.0" />
            <InfoRow label="Build" value="2025.09.01" />
            <InfoRow label="Platform" value="iOS" />
          </View>

          <Pressable style={styles.saveChanges}><Text style={styles.saveChangesText}>Save Changes</Text></Pressable>
          <Pressable accessibilityLabel="Sign out" accessibilityRole="button" onPress={() => { router.dismissAll(); router.replace('/'); }} style={styles.signOut}><Text style={styles.signOutText}>Sign Out</Text></Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  header: { height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#1D2639' },
  pageBar: { height: 48, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E4E8EF' },
  backButton: { width: 58, flexDirection: 'row', alignItems: 'center' },
  backChevron: { marginRight: 3, marginTop: -2, fontSize: 20, color: '#7C3AED' },
  backText: { fontSize: 9, fontWeight: '700', color: '#7C3AED' },
  pageTitle: { position: 'absolute', alignSelf: 'center', left: 0, right: 0, textAlign: 'center', fontSize: 20, fontWeight: '800', color: '#1D2639' },
  savePill: { minWidth: 36, borderRadius: 14, paddingHorizontal: 9, paddingVertical: 7, alignItems: 'center', backgroundColor: '#7C3AED' },
  savePillText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  content: { padding: 12, paddingBottom: 18 },
  profileCard: { borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  avatar: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED' },
  avatarText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  profileCopy: { marginLeft: 10 },
  name: { fontSize: 12, fontWeight: '800', color: '#253046' },
  company: { marginTop: 3, fontSize: 9, color: '#65758C' },
  roleBadge: { alignSelf: 'flex-start', marginTop: 5, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F0E9FF' },
  roleText: { fontSize: 7, fontWeight: '700', color: '#7C3AED' },
  sectionTitle: { marginTop: 15, marginBottom: 7, fontSize: 8, fontWeight: '800', color: '#62718A' },
  detailsCard: { padding: 10, borderRadius: 10, backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  editLabel: { marginTop: 2, marginBottom: 5, fontSize: 8, fontWeight: '800', color: '#7C3AED' },
  input: { height: 28, marginBottom: 10, paddingHorizontal: 9, borderWidth: 1, borderRadius: 6, borderColor: '#7C3AED', color: '#354057', fontSize: 10 },
  lockedField: { minHeight: 43, marginBottom: 7, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 7, backgroundColor: '#EEF3F9' },
  fieldCopy: { flex: 1 },
  fieldLabel: { fontSize: 8, fontWeight: '800', color: '#62718A' },
  lockedValue: { marginTop: 3, fontSize: 9, color: '#65758C' },
  card: { overflow: 'hidden', borderRadius: 10, backgroundColor: '#FFFFFF', shadowColor: '#34425D', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  securityRow: { height: 43, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' },
  securityLink: { fontSize: 9, color: '#6F32E5' },
  chevron: { fontSize: 19, color: '#B2BDCE' },
  infoRow: { height: 31, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E9F0' },
  infoLabel: { fontSize: 9, fontWeight: '700', color: '#354057' },
  infoValue: { fontSize: 9, color: '#65758C' },
  saveChanges: { height: 34, marginTop: 13, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED', shadowColor: '#7C3AED', shadowOpacity: 0.25, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  saveChangesText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  signOut: { height: 34, marginTop: 10, borderRadius: 7, borderWidth: 1, borderColor: '#F1C4C8', alignItems: 'center', justifyContent: 'center' },
  signOutText: { fontSize: 10, fontWeight: '800', color: '#E22F42' },
});
