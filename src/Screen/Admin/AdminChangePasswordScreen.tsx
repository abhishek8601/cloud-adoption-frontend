import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function AdminChangePasswordScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const savePassword = async () => {
    if (!currentPassword || !password || !confirmation) {
      setError('Please complete all password fields.');
      return;
    }
    if (password !== confirmation) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (!user?.token) {
      setError('Your session has expired. Please sign in again.');
      return;
    }

    setError('');
    setIsSaving(true);
    try {
      const response = await api.changePassword(user.token, {
        current_password: currentPassword,
        password,
        password_confirmation: confirmation,
      });
      setCurrentPassword('');
      setPassword('');
      setConfirmation('');
      Alert.alert('Password updated', response.message || 'Your password has been changed successfully.', [
        { text: 'Done', onPress: () => router.back() },
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to change password.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={styles.headerSpacer} />
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <View style={styles.content}>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.description}>Use your current password to create a new one.</Text>
            <View style={styles.card}>
              <Text style={styles.label}>CURRENT PASSWORD</Text>
              <TextInput accessibilityLabel="Current password" autoCapitalize="none" autoCorrect={false} secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} style={styles.input} />
              <Text style={styles.label}>NEW PASSWORD</Text>
              <TextInput accessibilityLabel="New password" autoCapitalize="none" autoCorrect={false} secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
              <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
              <TextInput accessibilityLabel="Confirm new password" autoCapitalize="none" autoCorrect={false} secureTextEntry value={confirmation} onChangeText={setConfirmation} style={styles.input} />
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              <Pressable accessibilityLabel="Update password" accessibilityRole="button" disabled={isSaving} onPress={savePassword} style={[styles.saveButton, isSaving && styles.disabled]}>
                <Text style={styles.saveText}>{isSaving ? 'Updating...' : 'Update Password'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FC' },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: { height: 52, paddingHorizontal: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF' },
  headerTitle: { color: '#1D2639', fontSize: 13, fontWeight: '800' },
  headerSpacer: { width: 42 },
  back: { color: '#7C3AED', fontSize: 11, fontWeight: '800' },
  content: { padding: 12 },
  title: { color: '#1D2639', fontSize: 23, fontWeight: '800' },
  description: { marginTop: 4, color: '#718098', fontSize: 11 },
  card: { marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: '#FFFFFF' },
  label: { marginTop: 10, marginBottom: 5, color: '#62718A', fontSize: 9, fontWeight: '800' },
  input: { height: 42, paddingHorizontal: 11, borderWidth: 1, borderRadius: 8, borderColor: '#DCE3EC', color: '#253046', fontSize: 13 },
  error: { marginTop: 12, color: '#D92D3A', fontSize: 11 },
  saveButton: { height: 44, marginTop: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#7C3AED' },
  disabled: { opacity: 0.6 },
  saveText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
