import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import UserManagementList from './UserManagementList';

type AdminRecord = {
  id?: number | string;
  name?: string;
  email?: string;
  status?: string;
  is_active?: boolean;
  role?: string;
};

const avatarColors = ['#7C3AED', '#00A878', '#DF7800', '#8B5CF6', '#E52F50'];

function toAdminRow(admin: AdminRecord, index: number): string[] {
  const name = admin.name || 'Unnamed Admin';
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'AD';
  const status = admin.status || (admin.is_active === false ? 'Disabled' : 'Active');
  return [initials, name, admin.email || 'No email address', avatarColors[index % avatarColors.length], status, String(admin.id || '')];
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmins = useCallback(async () => {
    if (!user?.token) {
      setAdmins([]);
      setError('Please sign in again to view admins.');
      setIsLoading(false);
      return;
    }

    // Admin details is the configured source for the Super Admin's Admin Users list.
    const endpoint = process.env.EXPO_PUBLIC_ADMIN_DETAILS_URL
      || process.env.EXPO_PUBLIC_ADMIN_ADMINS_URL
      || '/admin/admins';

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<AdminRecord[] | { data?: AdminRecord[] }>(endpoint, { token: user.token });
      const payload = response.data;
      const records = Array.isArray(payload) ? payload : payload?.data || [];
      setAdmins(records.map(toAdminRow));
    } catch (requestError) {
      setAdmins([]);
      setError(requestError instanceof Error ? requestError.message : 'Unable to load admin users.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  const deleteAdmin = async (adminId: string) => {
    if (!user?.token) throw new Error('Please sign in again to delete an admin.');
    const endpoint = process.env.EXPO_PUBLIC_ADMIN_DETAILS_URL
      || process.env.EXPO_PUBLIC_ADMIN_ADMINS_URL
      || '/admin/admins';
    await apiRequest(`${endpoint}/${adminId}`, { method: 'DELETE', token: user.token });
    await loadAdmins();
  };

  const viewAdmin = async (adminId: string): Promise<Record<string, unknown>> => {
    if (!user?.token) throw new Error('Please sign in again to view admin details.');
    const endpoint = process.env.EXPO_PUBLIC_ADMIN_DETAILS_URL
      || process.env.EXPO_PUBLIC_ADMIN_ADMINS_URL
      || '/admin/admins';
    const response = await apiRequest<Record<string, unknown>>(`${endpoint}/${adminId}`, { token: user.token });
    return response.data || {};
  };

  useFocusEffect(useCallback(() => { void loadAdmins(); }, [loadAdmins]));

  return <UserManagementList admin people={admins} isLoading={isLoading} error={error} onDeleteAdmin={deleteAdmin} onViewAdmin={viewAdmin} />;
}
