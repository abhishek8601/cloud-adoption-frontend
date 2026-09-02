

import { Image } from 'expo-image';
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
import { useAuth } from '../../context/AuthContext';

const LOGIN_ENDPOINT = process.env.EXPO_PUBLIC_LOGIN_URL;

type LoginUser = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  designation?: string;
  city?: string;
  state?: string;
  area_of_interest?: string;
  linkedin_url?: string;
  remarks?: string;
  status?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  role?: {
    id?: number;
    name?: string;
  };
  registrations?: {
    id?: number;
    conference_id?: number;
    ticket_reference?: string;
    approval_status?: string;
    conference?: { id?: number; title?: string } | null;
  }[];
};

type LoginResponse = {
  message?: string;
  success?: boolean;
  status?: boolean | string | number;
  token?: string;

  data?: {
    token?: string;
    user?: LoginUser;
  };

  user?: LoginUser;
};

/** User sign-in screen. */
export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    if (!LOGIN_ENDPOINT) {
      setError('Login service is not configured. Please contact support.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const responseText = await response.text();
      let data: LoginResponse = {};

      try {
        data = responseText ? (JSON.parse(responseText) as LoginResponse) : {};
      } catch {
        // A non-JSON response is handled below as an unsuccessful sign-in.
      }

      const rejectedByApi = data.success === false || data.status === false || data.status === 'error';
      if (!response.ok || rejectedByApi) {
        throw new Error(data.message || 'Unable to sign in. Please check your credentials.');
      }

      // Extract user data from response
      const userData = data.data?.user || data.user || {};

      const userName = userData.name || trimmedEmail.split('@')[0];

      const token = data.data?.token || data.token;

      const registration = userData.registrations?.[0];

      // Save complete user data to AuthContext
      await login({
        id: userData.id,
        name: userName,
        email: userData.email || trimmedEmail,
        phone: userData.phone,
        company_name: userData.company_name,
        designation: userData.designation,
        city: userData.city,
        state: userData.state,
        area_of_interest: userData.area_of_interest,
        linkedin_url: userData.linkedin_url,
        remarks: userData.remarks,
        role: userData.role?.name,
        token: token,
        status: userData.status,
        conference_id: registration?.conference?.id ?? registration?.conference_id,
        conference_title: registration?.conference?.title,
        ticket_reference: registration?.ticket_reference,
      });

      const roleName = (userData.role?.name || '').toLowerCase();
      if (roleName === 'super admin') {
        router.replace('/superadmin-dashboard');
      } else if (roleName === 'admin') {
        router.replace('/admin-dashboard');
      } else {
        router.replace('/dashboard');
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={styles.keyboardAvoidingView}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.shell}>
              <View style={styles.hero}>
                <Image
                  accessibilityLabel="Cloud Adoption Conference"
                  contentFit="contain"
                  source={require('../../../assets/expo.icon/Assets/Logo White.svg')}
                  style={styles.logo}
                />
                <Text style={styles.heroTitle}>Cloud Adoption Summit</Text>
              </View>

              <View style={styles.card}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="you@company.com"
                    placeholderTextColor="#B8BECC"
                    selectionColor="#7A3FF2"
                    style={styles.textInput}
                    value={email}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={styles.passwordField}>
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="password"
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#B8BECC"
                      secureTextEntry={!showPassword}
                      selectionColor="#7A3FF2"
                      style={styles.passwordInput}
                      value={password}
                    />
                    <Pressable
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      hitSlop={10}
                      onPress={() => setShowPassword((value) => !value)}
                      style={({ pressed }) => [styles.passwordToggle, pressed && styles.pressed]}>
                      <SymbolView
                        name={{
                          ios: showPassword ? 'eye.slash' : 'eye',
                          android: showPassword ? 'visibility_off' : 'visibility',
                          web: showPassword ? 'visibility_off' : 'visibility',
                        }}
                        size={18}
                        tintColor="#A0A7B5"
                      />
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  disabled={isSubmitting}
                  onPress={handleSignIn}
                  style={({ pressed }) => [styles.signInButton, (pressed || isSubmitting) && styles.pressed]}>
                  <Text
                    style={styles.signInText}>{isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Text>
                </Pressable>

                {error ? <Text accessibilityRole="alert"
                  style={styles.errorText}>{error}</Text> : null}

                <Pressable
                  onPress={() => router.push('/forget-password')}
                  style={({ pressed }) => [styles.linkPressable, pressed && styles.pressed]}>
                  <Text style={styles.primaryLink}>Forgot Password?</Text>
                </Pressable>

                <View style={styles.secondaryText}>
                  <Text style={styles.secondaryCopy}>New attendee? </Text>
                  <Pressable accessibilityRole="link"
                    onPress={() => router.push('/register')}>
                    <Text style={styles.secondaryLink}>Register Now</Text>
                  </Pressable>
                </View>

                <Pressable
                  accessibilityRole="link"
                  onPress={() => router.push('/admin-login')}
                  style={({ pressed }) => [styles.linkPressable, pressed && styles.pressed]}>
                  <Text style={styles.primaryLink}>Sign in as Admin</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EFF1F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    minHeight: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#1C2238',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
  hero: {
    minHeight: 248,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#6738E8',
    experimental_backgroundImage: 'linear-gradient(135deg, #4D3DD7 0%, #8B38F0 100%)',
  },
  logo: {
    width: 80,
    height: 80,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    marginTop: -28,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 14,
    gap: 8,
  },
  fieldLabel: {
    color: '#6B7280',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  textInput: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    paddingHorizontal: 12,
    backgroundColor: '#FBFBFD',
    color: '#21243D',
    fontSize: 15,
  },
  passwordField: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    paddingLeft: 12,
    paddingRight: 6,
    backgroundColor: '#FBFBFD',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    color: '#21243D',
    fontSize: 15,
    paddingVertical: 0,
  },
  passwordToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButton: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
    backgroundColor: '#7A3FF2',
    experimental_backgroundImage: 'linear-gradient(135deg, #6B35EA 0%, #8D43F0 100%)',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    marginTop: -8,
    marginBottom: 12,
    color: '#D92D3A',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  linkPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLink: {
    color: '#6F32E5',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  secondaryText: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
    lineHeight: 22,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryCopy: {
    color: '#7A8192',
    fontSize: 15,
    lineHeight: 22,
  },
  secondaryLink: {
    color: '#6F32E5',
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
  },
});
