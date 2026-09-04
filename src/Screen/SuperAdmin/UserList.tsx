import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { registrationApi, type RegistrationEntry } from '../../services/api';
import UserManagementList from './UserManagementList';

const avatarColors = ['#7C3AED', '#00A878', '#0095C8', '#E98200'];

function toPerson(entry: RegistrationEntry, index: number): string[] {
  const name = entry.user?.name?.trim() || 'Unnamed attendee';
  const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'A';
  const status = entry.approval_status ? `${entry.approval_status[0].toUpperCase()}${entry.approval_status.slice(1)}` : 'Registered';

  return [initials, name, entry.user?.email || 'No email address', avatarColors[index % avatarColors.length], status];
}

export default function UserList() {
  const { user } = useAuth();
  const [people, setPeople] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!user?.token) {
      setPeople([]);
      setError('Please sign in again to view registered users.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await registrationApi.list(user.token);
      setPeople((response.data || []).map(toPerson));
    } catch (requestError) {
      setPeople([]);
      setError(requestError instanceof Error ? requestError.message : 'Unable to load registered users.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useFocusEffect(useCallback(() => { void loadUsers(); }, [loadUsers]));

  return <UserManagementList people={people} isLoading={isLoading} error={error} />;
}
