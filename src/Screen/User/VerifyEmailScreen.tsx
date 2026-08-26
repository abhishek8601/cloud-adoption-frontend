import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function maskEmail(email?: string) {
  if (!email || !email.includes('@')) return 'your email address';
  const [local, domain] = email.split('@');
  return `${local.slice(0, 1)}${'*'.repeat(Math.max(local.length - 1, 4))}@${domain}`;
}

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  return <SafeAreaView style={styles.screen}><StatusBar style="dark" />
    <View style={styles.header}><Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>‹  Back</Text></Pressable><Text style={styles.headerTitle}>Verify Email</Text><View style={styles.headerSpacer} /></View>
    <View style={styles.content}>
      <View style={styles.iconCard}><SymbolView name={{ ios: 'envelope', android: 'mail', web: 'mail' }} size={35} tintColor="#7C3AED" /></View>
      <Text style={styles.title}>Check your email</Text><Text style={styles.description}>We've sent a reset link</Text><Text style={styles.email}>{maskEmail(email)}</Text>
      <Pressable accessibilityLabel="Verify email" accessibilityRole="button" onPress={() => {}} style={styles.verifyButton}><Text style={styles.verifyText}>Verify Email</Text></Pressable>
      <Pressable accessibilityLabel="Resend verification code" accessibilityRole="button" onPress={() => router.back()} style={styles.resendButton}><Text style={styles.resendText}>Resend Code</Text></Pressable>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 36, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EEF0F5' },
  backButton: { width: 68, paddingVertical: 7 }, backText: { color: '#7C3AED', fontSize: 12, fontWeight: '700' }, headerTitle: { color: '#182033', fontSize: 12, fontWeight: '800' }, headerSpacer: { width: 68 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 36 }, iconCard: { width: 79, height: 79, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: '#F0E9FF', borderWidth: 1, borderColor: '#DDD0FF' }, title: { marginTop: 28, color: '#161D2D', fontSize: 23, fontWeight: '800' }, description: { marginTop: 11, color: '#728098', fontSize: 11, textAlign: 'center' }, email: { marginTop: 5, color: '#344057', fontSize: 11, fontWeight: '800' }, verifyButton: { width: '100%', height: 43, marginTop: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#7C3AED' }, verifyText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' }, resendButton: { marginTop: 17, paddingVertical: 5, paddingHorizontal: 12 }, resendText: { color: '#7C3AED', fontSize: 11, fontWeight: '800' },
});
