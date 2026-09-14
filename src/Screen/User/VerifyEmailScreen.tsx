import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';

const RESEND_COOLDOWN_SECONDS = 30;

function maskEmail(email?: string) {
  if (!email || !email.includes('@')) return 'your email address';
  const [local, domain] = email.split('@');
  return `${local.slice(0, 1)}${'*'.repeat(Math.max(local.length - 1, 4))}@${domain}`;
}

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email, mode } = useLocalSearchParams<{ email?: string; mode?: 'reset' | 'verify' }>();
  const isVerifyMode = mode === 'verify';
  const [isResending, setIsResending] = useState(false);
  // Reset flow just sent an email, so start cooled down; verify flow arrives from a failed login with nothing sent yet.
  const [cooldown, setCooldown] = useState(isVerifyMode ? 0 : RESEND_COOLDOWN_SECONDS);
  const [status, setStatus] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      // Deep-linked or reloaded without the email param — nothing to resend to.
      router.replace(isVerifyMode ? '/' : '/forget-password');
      return;
    }
    setStatus(null);
    setIsResending(true);
    try {
      if (isVerifyMode) {
        await api.resendVerification(email);
        setStatus({ kind: 'success', text: 'A new verification link has been sent.' });
      } else {
        await api.forgotPassword(email);
        setStatus({ kind: 'success', text: 'A new reset link has been sent.' });
      }
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (requestError) {
      setStatus({
        kind: 'error',
        text: requestError instanceof Error ? requestError.message : 'Unable to resend. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const resendDisabled = isResending || cooldown > 0;
  const resendLabel = isResending
    ? 'Sending…'
    : cooldown > 0
      ? `Resend Link (${cooldown}s)`
      : 'Resend Link';

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹  Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{isVerifyMode ? 'Verify Your Email' : 'Check Your Email'}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.content}>
        <View style={styles.iconCard}>
          <SymbolView name={{ ios: 'envelope', android: 'mail', web: 'mail' }} size={35} tintColor="#7C3AED" />
        </View>
        <Text style={styles.title}>{isVerifyMode ? 'Verify your email' : 'Check your email'}</Text>
        <Text style={styles.description}>
          {isVerifyMode ? 'Your account isn\'t verified yet. We sent a verification link to' : "We've sent a password reset link to"}
        </Text>
        <Text style={styles.email}>{maskEmail(email)}</Text>
        <Text style={styles.hint}>
          {isVerifyMode
            ? 'Open the link in that email to verify your account, then sign in again. If it isn\'t there, check your spam folder.'
            : "Open the link in that email to choose a new password. If it isn't there, check your spam folder."}
        </Text>

        {status ? (
          <View style={[styles.statusBox, status.kind === 'success' ? styles.statusSuccess : styles.statusError]}>
            <SymbolView
              name={status.kind === 'success'
                ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
                : { ios: 'exclamationmark.circle.fill', android: 'error', web: 'error' }}
              size={16}
              tintColor={status.kind === 'success' ? '#00A56C' : '#EF476F'}
            />
            <Text style={[styles.statusText, status.kind === 'success' ? styles.statusTextSuccess : styles.statusTextError]}>{status.text}</Text>
          </View>
        ) : null}

        <Pressable
          accessibilityLabel="Back to sign in"
          accessibilityRole="button"
          onPress={() => router.replace('/')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>Back to Sign In</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Resend reset link"
          accessibilityRole="button"
          accessibilityState={{ disabled: resendDisabled }}
          disabled={resendDisabled}
          onPress={handleResend}
          style={[styles.resendButton, resendDisabled && styles.resendDisabled]}
        >
          {isResending ? <ActivityIndicator size="small" color="#7C3AED" /> : null}
          <Text style={[styles.resendText, resendDisabled && styles.resendTextDisabled]}>{resendLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 36, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EEF0F5' },
  backButton: { width: 68, paddingVertical: 7 },
  backText: { color: '#7C3AED', fontSize: 12, fontWeight: '700' },
  headerTitle: { color: '#182033', fontSize: 12, fontWeight: '800' },
  headerSpacer: { width: 68 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 36 },
  iconCard: { width: 79, height: 79, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: '#F0E9FF', borderWidth: 1, borderColor: '#DDD0FF' },
  title: { marginTop: 28, color: '#161D2D', fontSize: 23, fontWeight: '800' },
  description: { marginTop: 11, color: '#728098', fontSize: 11, textAlign: 'center' },
  email: { marginTop: 5, color: '#344057', fontSize: 11, fontWeight: '800' },
  hint: { marginTop: 14, color: '#728098', fontSize: 11, lineHeight: 16, textAlign: 'center' },
  statusBox: { width: '100%', marginTop: 20, padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusSuccess: { backgroundColor: '#E8F8F1', borderWidth: 1, borderColor: '#B9EBD3' },
  statusError: { backgroundColor: '#FFEEF1', borderWidth: 1, borderColor: '#FFC9D3' },
  statusText: { flex: 1, fontSize: 11, fontWeight: '600' },
  statusTextSuccess: { color: '#00794F' },
  statusTextError: { color: '#C4213E' },
  primaryButton: { width: '100%', height: 43, marginTop: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#7C3AED' },
  primaryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  resendButton: { marginTop: 17, paddingVertical: 5, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  resendDisabled: { opacity: 0.55 },
  resendText: { color: '#7C3AED', fontSize: 11, fontWeight: '800' },
  resendTextDisabled: { color: '#9B86C9' },
});
