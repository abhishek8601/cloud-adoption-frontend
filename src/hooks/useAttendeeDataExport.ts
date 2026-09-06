import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

export function useAttendeeDataExport(token?: string) {
  const [isExporting, setIsExporting] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const exportData = useCallback(async () => {
    if (!token) {
      Alert.alert('Authentication Error', 'Please sign in again.');
      return;
    }

    setIsExporting(true);
    try {
      const endpoint = process.env.EXPO_PUBLIC_ADMIN_ATTENDEES_EXPORT_URL
        || 'https://api.lifesciencesdreamin.com/api/admin/reports/attendees/export';
      const response = await fetch(endpoint, {
        headers: { Accept: 'text/csv', Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Export failed (${response.status})`);

      const contentType = response.headers.get('content-type') || '';
      if (response.url.includes('/login') || contentType.includes('text/html')) {
        throw new Error('Your session has expired. Please sign in again and retry the export.');
      }

      const csvText = await response.text();
      if (!csvText) throw new Error('Export returned empty data.');

      if (Platform.OS === 'web') {
        const url = window.URL.createObjectURL(new Blob([csvText], { type: 'text/csv;charset=utf-8;' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'attendees-report.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        Alert.alert('Export Complete', 'Attendee report downloaded.');
        return;
      }

      const FileSystem = await import('expo-file-system/legacy');
      const Sharing = await import('expo-sharing');
      const fileUri = `${FileSystem.cacheDirectory}attendees-report.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvText, { encoding: 'utf8' });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Attendee Report',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Export Complete', `File saved at:\n${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Export Failed', error instanceof Error ? error.message : 'Unable to export attendee data.');
    } finally {
      setIsExporting(false);
    }
  }, [token]);

  const confirmExport = useCallback(() => {
    if (!isExporting) setIsConfirmationVisible(true);
  }, [isExporting]);

  const cancelExport = useCallback(() => setIsConfirmationVisible(false), []);
  const startExport = useCallback(() => {
    setIsConfirmationVisible(false);
    void exportData();
  }, [exportData]);

  return { confirmExport, cancelExport, isConfirmationVisible, isExporting, startExport };
}
