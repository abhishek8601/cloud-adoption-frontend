// import { StatusBar } from 'expo-status-bar';
// import { Image } from 'expo-image';
// import { useRouter } from 'expo-router';
// import { SymbolView } from 'expo-symbols';
// import { useState } from 'react';
// import {
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function AdminLoginScreen() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const signIn = () => {
//     if (email.trim().toLowerCase() === 'superadmin@gmail.com' && password === 'super@123') {
//       router.replace('/superadmin-dashboard');
//       return;
//     }
//     router.replace('/admin-dashboard');
//   };

//   return (
//     <View style={styles.screen}>
//       <StatusBar style="light" />
//       <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           style={styles.flex}
//         >
//           <ScrollView
//             bounces={false}
//             contentContainerStyle={styles.scrollContent}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.deviceShell}>
//               <View style={styles.hero}>
//                 <Image
//                   accessibilityLabel="Cloud Adoption Conference"
//                   contentFit="contain"
//                   source={require('../../../assets/expo.icon/Assets/Logo White.svg')}
//                   style={styles.logo}
//                 />
//                 <Text style={styles.title}>Admin Console</Text>
//                 <Text style={styles.subtitle}>Cloud Adoption Solutions</Text>
//                 <View style={styles.restrictedPill}>
//                   <Text style={styles.restrictedText}>Restricted • Authorised Staff Only</Text>
//                 </View>
//               </View>

//               <View style={styles.card}>
//                 <Text style={styles.cardTitle}>Sign in to Admin</Text>

//                 <View style={styles.fieldGroup}>
//                   <Text style={styles.label}>Administrator Email</Text>
//                   <TextInput
//                     autoCapitalize="none"
//                     autoComplete="email"
//                     keyboardType="email-address"
//                     onChangeText={setEmail}
//                     placeholder="admin@cloudadoptionsolutions.com"
//                     placeholderTextColor="#9CA5B5"
//                     style={styles.input}
//                     value={email}
//                   />
//                 </View>

//                 <View style={styles.fieldGroup}>
//                   <Text style={styles.label}>Password</Text>
//                   <View style={styles.passwordField}>
//                     <TextInput
//                       autoCapitalize="none"
//                       onChangeText={setPassword}
//                       placeholder="Admin password"
//                       placeholderTextColor="#9CA5B5"
//                       secureTextEntry={!showPassword}
//                       style={styles.passwordInput}
//                       value={password}
//                     />
//                     <Pressable
//                       accessibilityLabel="Show or hide password"
//                       hitSlop={10}
//                       onPress={() => setShowPassword((current) => !current)}
//                       style={styles.eyeButton}
//                     >
//                       <SymbolView
//                         name={{
//                           ios: showPassword ? 'eye.slash' : 'eye',
//                           android: showPassword ? 'visibility_off' : 'visibility',
//                           web: showPassword ? 'visibility_off' : 'visibility',
//                         }}
//                         size={16}
//                         tintColor="#8290A5"
//                       />
//                     </Pressable>
//                   </View>
//                 </View>

//                 <Pressable
//                   accessibilityLabel="Sign in"
//                   onPress={signIn}
//                   style={styles.submitButton}
//                 >
//                   <Text style={styles.submitText}>Sign In</Text>
//                 </Pressable>
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#070B14' },
//   safeArea: { flex: 1 },
//   flex: { flex: 1 },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingVertical: 14,
//   },
//   deviceShell: {
//     flex: 1,
//     width: '100%',
//     maxWidth: 420,
//     minHeight: 570,
//     alignSelf: 'center',
//     overflow: 'hidden',
//     backgroundColor: '#101A30',
//   },
//   hero: {
//     minHeight: 252,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 20,
//     paddingBottom: 55,
//     backgroundColor: '#10192E',
//   },
//   logo: { width: 50, height: 50 },
//   title: { marginTop: 18, color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
//   subtitle: { marginTop: 5, color: '#8994AA', fontSize: 13 },
//   restrictedPill: {
//     marginTop: 15,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 16,
//     backgroundColor: '#3E2A14',
//     borderWidth: 1,
//     borderColor: '#77400D',
//   },
//   restrictedText: { color: '#F1A11B', fontSize: 10, fontWeight: '700' },
//   card: {
//     flex: 1,
//     marginTop: -25,
//     paddingHorizontal: 18,
//     paddingTop: 24,
//     paddingBottom: 38,
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   cardTitle: { color: '#11182A', fontSize: 16, fontWeight: '800', marginBottom: 23 },
//   fieldGroup: { gap: 7, marginBottom: 16 },
//   label: {
//     color: '#54627B',
//     fontSize: 10,
//     fontWeight: '800',
//     textTransform: 'uppercase',
//     letterSpacing: 0.65,
//   },
//   input: {
//     height: 46,
//     borderWidth: 1,
//     borderColor: '#DDE3ED',
//     borderRadius: 9,
//     backgroundColor: '#FBFCFE',
//     paddingHorizontal: 12,
//     color: '#1B2537',
//     fontSize: 13,
//   },
//   passwordField: {
//     height: 46,
//     borderWidth: 1,
//     borderColor: '#DDE3ED',
//     borderRadius: 9,
//     backgroundColor: '#FBFCFE',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingLeft: 12,
//   },
//   passwordInput: { flex: 1, height: '100%', color: '#1B2537', fontSize: 13 },
//   eyeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
//   submitButton: {
//     height: 43,
//     marginTop: 1,
//     borderRadius: 7,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#000000',
//   },
//   submitText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
// });


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
import { api } from '../../services/api';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const data = await api.login(trimmedEmail, password);
      const userData: any = data.data?.user || {};
      const token = data.data?.token;
      const roleName = (userData.role?.name || '').toLowerCase();

      if (roleName !== 'admin' && roleName !== 'super admin') {
        throw new Error('This account does not have admin access.');
      }

      await login({
        id: userData.id,
        name: userData.name,
        email: userData.email || trimmedEmail,
        phone: userData.phone,
        company_name: userData.company_name,
        designation: userData.designation,
        role: userData.role?.name,
        token,
        status: userData.status,
      });

      router.replace(roleName === 'super admin' ? '/superadmin-dashboard' : '/admin-dashboard');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to sign in. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.deviceShell}>
              <View style={styles.hero}>
                <Image
                  accessibilityLabel="Cloud Adoption Conference"
                  contentFit="contain"
                  source={require('../../../assets/expo.icon/Assets/Logo White.svg')}
                  style={styles.logo}
                />
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
                    <Pressable
                      accessibilityLabel="Show or hide password"
                      hitSlop={10}
                      onPress={() => setShowPassword((current) => !current)}
                      style={styles.eyeButton}
                    >
                      <SymbolView
                        name={{
                          ios: showPassword ? 'eye.slash' : 'eye',
                          android: showPassword ? 'visibility_off' : 'visibility',
                          web: showPassword ? 'visibility_off' : 'visibility',
                        }}
                        size={16}
                        tintColor="#8290A5"
                      />
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  accessibilityLabel="Sign in"
                  disabled={isSubmitting}
                  onPress={signIn}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitText}>{isSubmitting ? 'Signing In...' : 'Sign In'}</Text>
                </Pressable>

                {error ? (
                  <Text
                    accessibilityRole="alert"
                    style={{ marginTop: 10, color: '#E22F42', fontSize: 13, textAlign: 'center' }}
                  >
                    {error}
                  </Text>
                ) : null}
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  deviceShell: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    minHeight: 570,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#101A30',
  },
  hero: {
    minHeight: 252,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 55,
    backgroundColor: '#10192E',
  },
  logo: { width: 50, height: 50 },
  title: { marginTop: 18, color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  subtitle: { marginTop: 5, color: '#8994AA', fontSize: 13 },
  restrictedPill: {
    marginTop: 15,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#3E2A14',
    borderWidth: 1,
    borderColor: '#77400D',
  },
  restrictedText: { color: '#F1A11B', fontSize: 10, fontWeight: '700' },
  card: {
    flex: 1,
    marginTop: -25,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 38,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardTitle: { color: '#11182A', fontSize: 16, fontWeight: '800', marginBottom: 23 },
  fieldGroup: { gap: 7, marginBottom: 16 },
  label: {
    color: '#54627B',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.65,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#DDE3ED',
    borderRadius: 9,
    backgroundColor: '#FBFCFE',
    paddingHorizontal: 12,
    color: '#1B2537',
    fontSize: 13,
  },
  passwordField: {
    height: 46,
    borderWidth: 1,
    borderColor: '#DDE3ED',
    borderRadius: 9,
    backgroundColor: '#FBFCFE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
  },
  passwordInput: { flex: 1, height: '100%', color: '#1B2537', fontSize: 13 },
  eyeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  submitButton: {
    height: 43,
    marginTop: 1,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  submitText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
