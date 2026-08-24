import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
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
      <Text style={styles.label}>{label} 
        <Text style={styles.required}>*</Text></Text>
      <View 
      style={styles.inputWrap}>
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
          <Pressable accessibilityLabel="Show or hide password" hitSlop={10} 
          onPress={onToggleVisibility} 
          style={styles.iconButton}>
            <SymbolView 
            name={{ 
              ios: 'eye', android: 'visibility', web: 'visibility' 
              }} size={16} tintColor="#8690A1" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const REGISTER_ENDPOINT = process.env.EXPO_PUBLIC_USER_REGISTER_URL;

export default function UserRegistrationScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', 
    phone: '', 
    email: '', 
    password: '', 
    passwordConfirmation: '',
    ticketReference: '',
    company: '', 
    designation: '', 
    city: '', 
    state: '', 
    interest: '',
    linkedIn: '', 
    remarks: '',
  });
  const update = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    // Validate all required fields
    if (!form.name || !form.email || !form.password || !form.passwordConfirmation || !form.phone || !form.company || !form.designation || !form.interest || !form.ticketReference) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate password confirmation
    if (form.password !== form.passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    if (!REGISTER_ENDPOINT) {
      setError('Registration service is not configured. Please contact support.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.passwordConfirmation,
          ticket_reference: form.ticketReference,
          phone: form.phone,
          company_name: form.company,
          designation: form.designation,
          city: form.city,
          state: form.state,
          area_of_interest: form.interest,
          linkedin_url: form.linkedIn,
          remarks: form.remarks,
        }),
      });

      const responseText = await response.text();
      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        // Handle non-JSON response
      }

      const isSuccess = data.success === true || data.status === 'success' || response.ok;
      if (!isSuccess) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // Registration successful, navigate to login
      router.replace('/');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
           style={styles.flex}
        >
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" hitSlop={12} 
            onPress={() => router.push('/')} style={styles.backButton}>
              <SymbolView name={{ 
                ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} size={18} tintColor="#6D32E5" />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            >
            <Text style={styles.helper}>All required fields must be completed.</Text>

            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.card}>
              <Field 
              label="Ticket Reference" 
              placeholder="Enter your ticket reference" 
              value={form.ticketReference} 
              onChangeText={update('ticketReference')} />
              <Field 
              label="Full Name" 
              placeholder="First Last" 
              value={form.name} 
              onChangeText={update('name')} />
              <Field 
              label="Phone Number" 
              placeholder="+1 (555) 000-0000" 
              value={form.phone} 
              keyboardType="phone-pad" 
              onChangeText={update('phone')} />
              <Field 
              label="Email" 
              placeholder="you@company.com" 
              value={form.email} 
              keyboardType="email-address" 
              onChangeText={update('email')} />
              <Field 
              label="Password" 
              placeholder="Minimum 8 characters" 
              value={form.password} 
              secureTextEntry={!showPassword} 
              onChangeText={update('password')} 
              onToggleVisibility={() => setShowPassword((current) => !current)} />
              <Field 
              label="Confirm Password" 
              placeholder="Re-enter your password" 
              value={form.passwordConfirmation} 
              secureTextEntry={!showConfirmPassword} 
              onChangeText={update('passwordConfirmation')} 
              onToggleVisibility={() => setShowConfirmPassword((current) => !current)} />
            </View>

            <Text 
            style={styles.sectionTitle}>
              Professional Details
              </Text>
            <View style={styles.card}>
              <Field 
              label="Company" 
              placeholder="Your organisation" 
              value={form.company} 
              onChangeText={update('company')} />
              <Field 
              label="Designation" 
              placeholder="Your job title" 
              value={form.designation} 
              onChangeText={update('designation')} />
              <Field 
              label="City" 
              placeholder="San Francisco" 
              value={form.city} 
              onChangeText={update('city')} />
              <Field 
              label="State" 
              placeholder="CA" 
              value={form.state} 
              onChangeText={update('state')} />
            </View>

            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.card}>
              <Field 
              label="Area of Interest" 
              placeholder="e.g., Cloud Computing, AI, DevOps" 
              value={form.interest} 
              onChangeText={update('interest')} />
              <Field 
              label="LinkedIn URL" placeholder="linkedin.com/in/yourprofile" 
              value={form.linkedIn} keyboardType="url" 
              onChangeText={update('linkedIn')} />
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Remarks</Text>
                <TextInput multiline onChangeText={update('remarks')} 
                placeholder="Anything you'd like us to know" 
                placeholderTextColor="#A9B0BF" style={styles.remarks} 
                textAlignVertical="top" 
                value={form.remarks} />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable onPress={handleSubmit} disabled={isSubmitting} style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}>
              <Text style={styles.submitText}>{isSubmitting ? 'Submitting...' : 'Submit Registration'}</Text>
            </Pressable>
            <Text 
            style={styles.terms}>
              By registering you agree to the Conference Code of{`\n`}Conduct.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#F6F8FC' },
  safeArea: { 
    flex: 1 },
  flex: { 
    flex: 1 },
  header: { 
    height: 58, 
    backgroundColor: '#FFFFFF', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: '#E9ECF2' },
  backButton: { 
    minWidth: 64, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 3 },
  backText: { 
    color: '#6D32E5', 
    fontSize: 13, 
    fontWeight: '600' },
  headerTitle: { 
    color: '#20243A', 
    fontSize: 15, 
    fontWeight: '800' },
  headerSpacer: { 
    width: 64 },
  content: { 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 200,
},
  helper: { 
    color: '#69758A', 
    fontSize: 12, 
    textAlign: 'center', 
    marginBottom: 18 },
  sectionTitle: { 
    color: '#607089', 
    fontSize: 10, 
    fontWeight: '800', 
    textTransform: 'uppercase', 
    letterSpacing: 0.7, 
    marginBottom: 8, 
    marginTop: 10 },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 14, 
    padding: 12, 
    shadowColor: '#24314D', 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 3 }, 
    elevation: 2 },
  fieldGroup: { 
    gap: 6, 
    marginBottom: 13 },
  label: { 
    color: '#62708A', 
    fontSize: 10, 
    lineHeight: 13, 
    fontWeight: '800', 
    textTransform: 'uppercase', 
    letterSpacing: 0.55 },
  required: { 
    color: '#EF476F' },
  inputWrap: { 
    height: 43, 
    borderWidth: 1, 
    borderColor: '#E1E6EF', 
    borderRadius: 9, 
    backgroundColor: '#FBFCFE', 
    flexDirection: 'row', 
    alignItems: 'center' },
  input: { 
    flex: 1, 
    height: '100%', 
    paddingHorizontal: 11, 
    color: '#242B3A', 
    fontSize: 13 },
  iconButton: { 
    height: 40, 
    width: 38, 
    alignItems: 'center', 
    justifyContent: 'center' },
  select: { 
    height: 43, 
    borderWidth: 1, 
    borderColor: '#E1E6EF',
     borderRadius: 9, 
     backgroundColor: '#FBFCFE', 
     paddingHorizontal: 11, 
     flexDirection: 'row', 
     alignItems: 'center', 
     justifyContent: 'space-between' },
  placeholder: { 
    color: '#A9B0BF', 
    fontSize: 13 },
  remarks: { minHeight: 72, 
    borderWidth: 1, 
    borderColor: '#E1E6EF', 
    borderRadius: 9, 
    backgroundColor: '#FBFCFE', 
    paddingHorizontal: 11, 
    paddingTop: 10, color: '#242B3A', 
    fontSize: 13 },
  errorText: {
    color: '#EF476F',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: '#FFE8F0',
    padding: 10,
    borderRadius: 8,
  },
  submitButton: { 
    height: 48, 
    marginTop: 18, 
    borderRadius: 8, 
    backgroundColor: '#C9D5E4', 
    alignItems: 'center', 
    justifyContent: 'center' },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: { 
    color: '#FFFFFF', 
    fontSize: 13, 
    fontWeight: '800' },
  terms: { 
    color: '#758198', 
    fontSize: 10, 
    lineHeight: 14, 
    textAlign: 'center', 
    marginTop: 10 },
});
