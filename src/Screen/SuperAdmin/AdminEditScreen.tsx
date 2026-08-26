import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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

import SuperAdminTabBar from '../../components/SuperAdminTabBar';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

type AdminForm = {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  designation: string;
  city: string;
  state: string;
  area_of_interest: string;
  linkedin_url: string;
  remarks: string;
  password: string;
  password_confirmation: string;
};

const initialForm: AdminForm = {
  name: '',
  email: '',
  phone: '',
  company_name: '',
  designation: '',
  city: '',
  state: '',
  area_of_interest: '',
  linkedin_url: '',
  remarks: '',
  password: '',
  password_confirmation: '',
};

const fields: {
  key: Exclude<
    keyof AdminForm,
    'password' | 'password_confirmation'
  >;
  label: string;
  keyboardType?: 'email-address' | 'phone-pad' | 'url';
}[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'email',
    label: 'Email address',
    keyboardType: 'email-address',
  },
  {
    key: 'phone',
    label: 'Phone',
    keyboardType: 'phone-pad',
  },
  {
    key: 'company_name',
    label: 'Company name',
  },
  {
    key: 'designation',
    label: 'Designation',
  },
  {
    key: 'city',
    label: 'City',
  },
  {
    key: 'state',
    label: 'State',
  },
  {
    key: 'area_of_interest',
    label: 'Area of interest',
  },
  {
    key: 'linkedin_url',
    label: 'LinkedIn URL',
    keyboardType: 'url',
  },
  {
    key: 'remarks',
    label: 'Remarks',
  },
];

export default function AdminEditScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { user } = useAuth();

  const [form, setForm] = useState<AdminForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof AdminForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /*
   * Get Admin Details
   */
  const loadAdmin = async () => {
    if (!user?.token) {
      setError('Please sign in again.');
      setIsLoading(false);
      return;
    }

    if (!id) {
      setError('Admin ID is missing.');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      const baseUrl =
        process.env.EXPO_PUBLIC_ADMIN_ADMINS_URL ||
        '/admin/admins';

      const response = await apiRequest(
        `${baseUrl}/${id}`,
        {
          method: 'GET',
          token: user.token,
        }
      );

      /*
       * Handles common API response formats:
       *
       * {
       *   data: {...}
       * }
       *
       * or
       *
       * {...}
       */
      const result: any =
        (response as any)?.data ?? response;

      setForm({
        name: result?.name ?? '',
        email: result?.email ?? '',
        phone: result?.phone ?? '',
        company_name: result?.company_name ?? '',
        designation: result?.designation ?? '',
        city: result?.city ?? '',
        state: result?.state ?? '',
        area_of_interest: result?.area_of_interest ?? '',
        linkedin_url: result?.linkedin_url ?? '',
        remarks: result?.remarks ?? '',
        password: '',
        password_confirmation: '',
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load admin details.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAdmin();
  }, [id, user?.token]);

  /*
   * Update Admin
   */
  const submit = async () => {
    if (!user?.token) {
      setError('Please sign in again to update admin.');
      return;
    }

    if (!id) {
      setError('Admin ID is missing.');
      return;
    }

    if (!form.name || !form.email) {
      setError('Name and email are required.');
      return;
    }

    if (
      form.password &&
      form.password !== form.password_confirmation
    ) {
      setError('Passwords do not match.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const baseUrl =
        process.env.EXPO_PUBLIC_ADMIN_ADMINS_URL ||
        '/admin/admins';

      /*
       * Don't send empty password fields.
       */
      const body: Partial<AdminForm> = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company_name: form.company_name,
        designation: form.designation,
        city: form.city,
        state: form.state,
        area_of_interest: form.area_of_interest,
        linkedin_url: form.linkedin_url,
        remarks: form.remarks,
      };

      if (form.password) {
        body.password = form.password;
        body.password_confirmation =
          form.password_confirmation;
      }

      await apiRequest(`${baseUrl}/${id}`, {
        method: 'PUT',
        token: user.token,
        body,
      });

      router.replace('/superadmin-admin-users');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to update admin.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Text style={styles.back}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Edit Admin
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
          style={styles.flex}
        >
          {isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator
                size="small"
                color="#7C3AED"
              />

              <Text style={styles.loadingText}>
                Loading admin...
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>
                Edit Admin
              </Text>

              <Text style={styles.subtitle}>
                Update administrator account details
              </Text>

              {error ? (
                <Text style={styles.error}>
                  {error}
                </Text>
              ) : null}

              {/* Normal Fields */}
              {fields.map((field) => (
                <View
                  key={field.key}
                  style={styles.field}
                >
                  <Text style={styles.label}>
                    {field.label.toUpperCase()}
                  </Text>

                  <TextInput
                    value={form[field.key]}
                    onChangeText={(value) =>
                      update(field.key, value)
                    }
                    autoCapitalize={
                      field.key === 'email' ||
                      field.key === 'linkedin_url'
                        ? 'none'
                        : 'words'
                    }
                    keyboardType={
                      field.keyboardType
                    }
                    placeholder={field.label}
                    placeholderTextColor="#96A0B0"
                    style={styles.input}
                  />
                </View>
              ))}

              {/* Password */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  PASSWORD
                </Text>

                <TextInput
                  value={form.password}
                  onChangeText={(value) =>
                    update('password', value)
                  }
                  secureTextEntry
                  placeholder="Leave blank to keep current password"
                  placeholderTextColor="#96A0B0"
                  style={styles.input}
                />
              </View>

              {/* Confirm Password */}
              <View style={styles.field}>
                <Text style={styles.label}>
                  CONFIRM PASSWORD
                </Text>

                <TextInput
                  value={form.password_confirmation}
                  onChangeText={(value) =>
                    update(
                      'password_confirmation',
                      value
                    )
                  }
                  secureTextEntry
                  placeholder="Confirm new password"
                  placeholderTextColor="#96A0B0"
                  style={styles.input}
                />
              </View>

              {/* Update Button */}
              <Pressable
                disabled={isSaving}
                onPress={() => void submit()}
                style={[
                  styles.submit,
                  isSaving && styles.disabled,
                ]}
              >
                {isSaving ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <Text style={styles.submitText}>
                    Update Admin
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <SuperAdminTabBar activeTab="Users" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  safe: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  header: {
    height: 54,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E8EF',
  },

  headerTitle: {
    color: '#1D2639',
    fontSize: 14,
    fontWeight: '800',
  },

  headerSpacer: {
    width: 18,
  },

  back: {
    color: '#7C3AED',
    fontSize: 30,
    lineHeight: 30,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  title: {
    color: '#1D2639',
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 3,
    marginBottom: 16,
    color: '#718098',
    fontSize: 11,
  },

  error: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    color: '#C62828',
    backgroundColor: '#FFF0F1',
    fontSize: 11,
  },

  field: {
    marginBottom: 12,
  },

  label: {
    marginBottom: 6,
    color: '#65758C',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  input: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDE4ED',
    borderRadius: 8,
    backgroundColor: '#FFF',
    color: '#253046',
    fontSize: 13,
  },

  submit: {
    height: 46,
    marginTop: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
  },

  disabled: {
    opacity: 0.65,
  },

  submitText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },

  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#718098',
    fontSize: 11,
  },
});