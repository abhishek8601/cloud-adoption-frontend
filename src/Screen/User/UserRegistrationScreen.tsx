import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  secureTextEntry?: boolean;
  onToggleVisibility?: () => void;
};

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry,
  onToggleVisibility,
}: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label} <Text style={styles.required}>*</Text></Text>
      <View style={styles.inputWrap}>
        <TextInput
          autoCapitalize="none"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A9B0BF"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={value}
        />
        {onToggleVisibility ? (
          <Pressable accessibilityLabel="Show or hide password" hitSlop={10} onPress={onToggleVisibility} style={styles.iconButton}>
            <SymbolView name={{ ios: 'eye', android: 'visibility', web: 'visibility' }} size={16} tintColor="#8690A1" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function UserRegistrationScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: '', company: '', designation: '', city: '', state: '', linkedIn: '', remarks: '',
  });
  const update = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
              <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} size={18} tintColor="#6D32E5" />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.helper}>All required fields must be completed.</Text>

            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.card}>
              <Field label="Full Name" placeholder="First Last" value={form.name} onChangeText={update('name')} />
              <Field label="Phone Number" placeholder="+1 (555) 000-0000" value={form.phone} keyboardType="phone-pad" onChangeText={update('phone')} />
              <Field label="Email" placeholder="you@company.com" value={form.email} keyboardType="email-address" onChangeText={update('email')} />
              <Field label="Password" placeholder="Minimum 8 characters" value={form.password} secureTextEntry={!showPassword} onChangeText={update('password')} onToggleVisibility={() => setShowPassword((current) => !current)} />
            </View>

            <Text style={styles.sectionTitle}>Professional Details</Text>
            <View style={styles.card}>
              <Field label="Company" placeholder="Your organisation" value={form.company} onChangeText={update('company')} />
              <Field label="Designation" placeholder="Your job title" value={form.designation} onChangeText={update('designation')} />
              <Field label="City" placeholder="San Francisco" value={form.city} onChangeText={update('city')} />
              <Field label="State" placeholder="CA" value={form.state} onChangeText={update('state')} />
            </View>

            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.card}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Area of Interest <Text style={styles.required}>*</Text></Text>
                <Pressable accessibilityLabel="Choose an area of interest" style={styles.select}>
                  <Text style={styles.placeholder}>Select an interest</Text>
                  <SymbolView name={{ ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' }} size={16} tintColor="#7E899B" />
                </Pressable>
              </View>
              <Field label="LinkedIn URL" placeholder="linkedin.com/in/yourprofile" value={form.linkedIn} keyboardType="url" onChangeText={update('linkedIn')} />
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Remarks</Text>
                <TextInput multiline onChangeText={update('remarks')} placeholder="Anything you'd like us to know" placeholderTextColor="#A9B0BF" style={styles.remarks} textAlignVertical="top" value={form.remarks} />
              </View>
            </View>

            <Pressable onPress={() => {}} style={styles.submitButton}>
              <Text style={styles.submitText}>Submit Registration</Text>
            </Pressable>
            <Text style={styles.terms}>By registering you agree to the Conference Code of{`\n`}Conduct.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F8FC' },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: { height: 58, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E9ECF2' },
  backButton: { minWidth: 64, flexDirection: 'row', alignItems: 'center', gap: 3 },
  backText: { color: '#6D32E5', fontSize: 13, fontWeight: '600' },
  headerTitle: { color: '#20243A', fontSize: 15, fontWeight: '800' },
  headerSpacer: { width: 64 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 },
  helper: { color: '#69758A', fontSize: 12, textAlign: 'center', marginBottom: 18 },
  sectionTitle: { color: '#607089', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8, marginTop: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, shadowColor: '#24314D', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  fieldGroup: { gap: 6, marginBottom: 13 },
  label: { color: '#62708A', fontSize: 10, lineHeight: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.55 },
  required: { color: '#EF476F' },
  inputWrap: { height: 43, borderWidth: 1, borderColor: '#E1E6EF', borderRadius: 9, backgroundColor: '#FBFCFE', flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, height: '100%', paddingHorizontal: 11, color: '#242B3A', fontSize: 13 },
  iconButton: { height: 40, width: 38, alignItems: 'center', justifyContent: 'center' },
  select: { height: 43, borderWidth: 1, borderColor: '#E1E6EF', borderRadius: 9, backgroundColor: '#FBFCFE', paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  placeholder: { color: '#A9B0BF', fontSize: 13 },
  remarks: { minHeight: 72, borderWidth: 1, borderColor: '#E1E6EF', borderRadius: 9, backgroundColor: '#FBFCFE', paddingHorizontal: 11, paddingTop: 10, color: '#242B3A', fontSize: 13 },
  submitButton: { height: 48, marginTop: 18, borderRadius: 8, backgroundColor: '#C9D5E4', alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  terms: { color: '#758198', fontSize: 10, lineHeight: 14, textAlign: 'center', marginTop: 10 },
});
