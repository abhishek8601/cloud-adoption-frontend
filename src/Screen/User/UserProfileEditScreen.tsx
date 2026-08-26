import { useRouter } from 'expo-router';
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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

type Field = 'name' | 'phone' | 'company_name' | 'designation' | 'city' | 'state' | 'area_of_interest' | 'linkedin_url';
const PROFILE_UPDATE_ENDPOINT = process.env.EXPO_PUBLIC_USER_PROFILE_URL;

function FormField({ label, value, onChangeText, keyboardType = 'default' }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'url';
}) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} autoCapitalize={keyboardType === 'url' ? 'none' : 'sentences'} style={styles.input} /></View>;
}

export default function UserProfileEditScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState<Record<Field, string>>({
    name: user?.name || '', phone: user?.phone || '', company_name: user?.company_name || '', designation: user?.designation || '',
    city: user?.city || '', state: user?.state || '', area_of_interest: user?.area_of_interest || '', linkedin_url: user?.linkedin_url || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const updateField = (field: Field) => (value: string) => setForm((current) => ({ ...current, [field]: value }));
  const saveProfile = async () => {
    if (!PROFILE_UPDATE_ENDPOINT) {
      setError('Profile update service is not configured.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const response = await fetch(PROFILE_UPDATE_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({ ...form, email: user?.email }),
      });
      const responseText = await response.text();
      let data: any = {};
      try { data = responseText ? JSON.parse(responseText) : {}; } catch { /* API returned no JSON body. */ }
      if (!response.ok) throw new Error(data?.message || data?.error || `Profile update failed (${response.status}).`);

      await updateUser({ ...form, ...(data?.user || data?.data || {}) });
      router.back();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return <View style={styles.screen}>
    <StatusBar style="dark" />

    <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <Pressable 
      accessibilityLabel="Back to profile" 
      accessibilityRole="button" 
      hitSlop={10} 
      onPress={() => router.back()}
      >
        
      <Text style={styles.back}>‹</Text>
        
     </Pressable>

        <Text style={styles.title}>
          Edit Profile
          </Text>

          <View style={styles.headerSpacer} />
          </View>
    
    <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >

    <ScrollView 
    contentContainerStyle={styles.content} 
    keyboardShouldPersistTaps="handled" 
    keyboardDismissMode="interactive"
    showsVerticalScrollIndicator={false}
    automaticallyAdjustKeyboardInsets>

      <Text style={styles.helper}>
        Update your personal details for the conference directory.
        </Text>

      {error ? 
      <Text 
      accessibilityRole="alert" 
      style={styles.error}>{error}
      </Text> : null}

      <View style={styles.card}>

        <FormField 
        label="NAME" 
        value={form.name} 
        onChangeText={updateField('name')} 
        />

        <FormField 
        label="PHONE" 
        value={form.phone} 
        onChangeText={updateField('phone')} 
        keyboardType="phone-pad" 
        />

        <FormField 
        label="COMPANY" 
        value={form.company_name} 
        onChangeText={updateField('company_name')} 
        />

        <FormField 
        label="DESIGNATION" 
        value={form.designation} 
        onChangeText={updateField('designation')} 
        />
        <FormField 
        label="CITY" 
        value={form.city} 
        onChangeText={updateField('city')} 
        />

        <FormField 
        label="STATE" 
        value={form.state} 
        onChangeText={updateField('state')} 
        />

        <FormField 
        label="AREA OF INTEREST" 
        value={form.area_of_interest} 
        onChangeText={updateField('area_of_interest')} 
        />

        <FormField 
        label="LINKEDIN URL" 
        value={form.linkedin_url} 
        onChangeText={updateField('linkedin_url')} 
        keyboardType="url" />
      </View>

      <Pressable accessibilityRole="button" disabled={isSaving} 
      onPress={saveProfile} 
      style={[styles.save, isSaving && styles.saveDisabled]}
      >

        <Text 
        style={styles.saveText}>
          {isSaving ? 'Saving…' : 'Save Changes'}
        </Text>
      </Pressable>
    </ScrollView>
   </KeyboardAvoidingView>
  </SafeAreaView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#F7F8FC'
   }, 

  safeArea: { 
    flex: 1 
  },
 
  keyboardAvoidingView: {
    flex: 1,
  },
  
  header: { 
    height: 56, 
    paddingHorizontal: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#FFF', 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: '#E5EAF1' 
  },

  back: { 
    color: '#7C3AED', 
    fontSize: 34, 
    fontWeight: '300', 
    lineHeight: 34 
  }, 

    title: { 
    color: '#202A3E', 
    fontSize: 16, 
    fontWeight: '800' 
    }, 
    
    headerSpacer: { 
      width: 18 
      },

  content: { 
    padding: 16, 
    paddingBottom: 120 
  }, 
  helper: { 
    color: '#718098', 
    fontSize: 12, 
    lineHeight: 18, 
    marginBottom: 14 
  }, 
  error: { 
    marginBottom: 14, 
      padding: 10, 
      borderRadius: 8, 
      color: '#B42318', 
      fontSize: 12, 
      backgroundColor: '#FEF3F2' }, 
  card: { padding: 14, borderRadius: 14, backgroundColor: '#FFF' },

  field: { 
    marginBottom: 14 
  }, 

  label: { 
    color: '#65758D', 
    fontSize: 10, 
    fontWeight: '800', 
    letterSpacing: .5, 
    marginBottom: 6 
  }, 

  input: { 
    height: 43, 
    paddingHorizontal: 11, 
    borderWidth: 1, 
    borderColor: '#DDE4ED', 
    borderRadius: 8, 
    color: '#28334A', 
    fontSize: 14 
  },

  save: { 
    height: 46, 
    marginTop: 18, 
    borderRadius: 9, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#7C3AED' 
  }, 
  
  saveDisabled: { 
    opacity: .65 
  }, 
  saveText: { 
    color: '#FFF', 
    fontSize: 14, 
    fontWeight: '800'
   },
});
