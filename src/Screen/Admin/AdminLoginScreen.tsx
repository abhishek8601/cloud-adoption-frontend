import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView bounces={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.deviceShell}>
              <View style={styles.hero}>
                <Text style={styles.consoleLabel}>ADMIN CONSOLE</Text>
                <View style={styles.shieldBadge}>
                  <SymbolView name={{ ios: 'shield', android: 'security', web: 'security' }} size={32} tintColor="#FFFFFF" weight="semibold" />
                </View>
                <Text style={styles.title}>Admin Console</Text>
                <Text style={styles.subtitle}>Cloud Adoption Solutions</Text>
                <View style={styles.restrictedPill}>
                  <Text style={styles.restrictedText}>Restricted • Authorised Staff Only</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Sign in to Admin</Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Administrator Email</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="admin@cloudadoptionsolutions.com"
                    placeholderTextColor="#9CA5B5"
                    style={styles.input}
                    value={email}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordField}>
                    <TextInput
                      autoCapitalize="none"
                      onChangeText={setPassword}
                      placeholder="Admin password"
                      placeholderTextColor="#9CA5B5"
                      secureTextEntry={!showPassword}
                      style={styles.passwordInput}
                      value={password}
                    />
                    <Pressable accessibilityLabel="Show or hide password" hitSlop={10} onPress={() => setShowPassword((current) => !current)} style={styles.eyeButton}>
                      <SymbolView name={{ ios: showPassword ? 'eye.slash' : 'eye', android: showPassword ? 'visibility_off' : 'visibility', web: showPassword ? 'visibility_off' : 'visibility' }} size={16} tintColor="#8290A5" />
                    </Pressable>
                  </View>
                </View>

                <Pressable onPress={() => {}} style={styles.submitButton}>
                  <Text style={styles.submitText}>Sign In to Admin Console</Text>
                </Pressable>
                <Text style={styles.demoText}>Demo: any email + 6+ character password</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#070B14' },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 18 },
  deviceShell: { flex: 1, width: '100%', maxWidth: 420, minHeight: 650, alignSelf: 'center', overflow: 'hidden', backgroundColor: '#101A30', borderRadius: 34, borderWidth: 1, borderColor: '#263653' },
  hero: { minHeight: 282, alignItems: 'center', justifyContent: 'center', paddingTop: 24, paddingBottom: 62, backgroundColor: '#10192E' },
  consoleLabel: { position: 'absolute', top: 8, color: '#56627B', fontSize: 8, fontWeight: '800', letterSpacing: 2.1 },
  shieldBadge: { width: 62, height: 62, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C2CF2', shadowColor: '#8D4CFF', shadowOpacity: 0.65, shadowRadius: 18, shadowOffset: { width: 0, height: 7 }, elevation: 8 },
  title: { marginTop: 18, color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  subtitle: { marginTop: 5, color: '#8994AA', fontSize: 13 },
  restrictedPill: { marginTop: 15, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#3E2A14', borderWidth: 1, borderColor: '#77400D' },
  restrictedText: { color: '#F1A11B', fontSize: 10, fontWeight: '700' },
  card: { flex: 1, marginTop: -30, paddingHorizontal: 22, paddingTop: 28, paddingBottom: 38, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  cardTitle: { color: '#11182A', fontSize: 16, fontWeight: '800', marginBottom: 23 },
  fieldGroup: { gap: 7, marginBottom: 16 },
  label: { color: '#54627B', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.65 },
  input: { height: 46, borderWidth: 1, borderColor: '#DDE3ED', borderRadius: 9, backgroundColor: '#FBFCFE', paddingHorizontal: 12, color: '#1B2537', fontSize: 13 },
  passwordField: { height: 46, borderWidth: 1, borderColor: '#DDE3ED', borderRadius: 9, backgroundColor: '#FBFCFE', flexDirection: 'row', alignItems: 'center', paddingLeft: 12 },
  passwordInput: { flex: 1, height: '100%', color: '#1B2537', fontSize: 13 },
  eyeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  submitButton: { height: 48, marginTop: 2, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#CBD6E5' },
  submitText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  demoText: { color: '#66758C', fontSize: 11, textAlign: 'center', marginTop: 20 },
});
