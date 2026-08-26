import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
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

const FORGOT_PASSWORD_ENDPOINT = process.env.EXPO_PUBLIC_FORGOT_PASSWORD_URL;

type ForgotPasswordResponse = {
  message?: string;
  success?: boolean;
  status?: boolean | string | number;
};

export default function UserForgetPasswordScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!FORGOT_PASSWORD_ENDPOINT) {
      setError('Service is not configured. Please contact support.');
      return;
    }

    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(FORGOT_PASSWORD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const responseText = await response.text();
      let data: ForgotPasswordResponse = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        // Non-JSON response
      }

      const isSuccessful = data.success === true || data.status === true || response.ok;
      if (!isSuccessful) {
        throw new Error(data.message || 'Failed to process request. Please try again.');
      }

      router.push({ pathname: '/verify-email', params: { email: trimmedEmail } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to process request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            ref={scrollViewRef}
            automaticallyAdjustKeyboardInsets={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.shell}>
              <View style={styles.header}>
                <Pressable
                  accessibilityLabel="Go back to login"
                  hitSlop={12}
                  onPress={() => router.push('/')}
                  style={styles.backButton}
                >
                  <SymbolView
                    name={{
                      ios: 'chevron.left',
                      android: 'arrow_back',
                      web: 'arrow_back',
                    }}
                    size={20}
                    tintColor="#FFFFFF"
                  />
                </Pressable>
                <Text style={styles.headerTitle}>Reset Password</Text>
                <View style={styles.spacer} />
              </View>

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
                <Text style={styles.cardTitle}>Forgot Your Password?</Text>
                <Text style={styles.cardDescription}>
                  Enter your email address and we'll send you instructions to reset your password.
                </Text>

                {error ? (
                  <View style={styles.errorContainer}>
                    <SymbolView
                      name={{ ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' }}
                      size={16}
                      tintColor="#EF476F"
                    />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {success ? (
                  <View style={styles.successContainer}>
                    <SymbolView
                      name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                      size={16}
                      tintColor="#00A56C"
                    />
                    <Text style={styles.successText}>
                      Check your email for password reset instructions.
                    </Text>
                  </View>
                ) : null}

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={!isSubmitting}
                      keyboardType="email-address"
                      onChangeText={setEmail}
                      onFocus={() => {
                        // Ensure the field remains above the keyboard after it animates in.
                        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 250);
                      }}
                      placeholder="you@company.com"
                      placeholderTextColor="#B8BECC"
                      selectionColor="#7A3FF2"
                      style={styles.input}
                      value={email}
                    />
                    <SymbolView
                      name={{
                        ios: 'envelope',
                        android: 'mail',
                        web: 'mail',
                      }}
                      size={16}
                      tintColor="#A0A7B5"
                    />
                  </View>
                </View>

                <Pressable
                  accessibilityLabel="Send reset instructions"
                  disabled={isSubmitting || success}
                  onPress={handleSubmit}
                  style={[
                    styles.submitButton,
                    (isSubmitting || success) && styles.submitButtonDisabled,
                  ]}
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityLabel="Back to login"
                  onPress={() => router.push('/')}
                  style={styles.backLink}
                >
                  <Text style={styles.backLinkText}>Back to Login</Text>
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
    backgroundColor: '#6D32E5',
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
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  spacer: {
    width: 40,
  },
  hero: {
    alignItems: 'center',
    marginVertical: 20,
    
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTitle: {
    color: '#202A3E',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#65758A',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#EF476F',
    fontSize: 12,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5F1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    color: '#00A56C',
    fontSize: 12,
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 16,
    gap: 6,
  },
  fieldLabel: {
    color: '#62708A',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.55,
  },
  inputWrap: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E1E6EF',
    borderRadius: 10,
    backgroundColor: '#FBFCFE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#242B3A',
    fontSize: 13,
  },
  submitButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#7A3FF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backLinkText: {
    color: '#7A3FF2',
    fontSize: 12,
    fontWeight: '600',
  },
});
