import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type ExportConfirmationProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ExportDataConfirmation({ visible, onCancel, onConfirm }: ExportConfirmationProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Export Data</Text>
          <Text style={styles.message}>Do you want to export data</Text>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Do not export data" onPress={onCancel} style={[styles.button, styles.noButton]}>
              <Text style={styles.noText}>No</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Export data" onPress={onConfirm} style={[styles.button, styles.yesButton]}>
              <Text style={styles.yesText}>Yes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function ExportDataLoader({ visible }: { visible: boolean }) {
  return (
    <Modal transparent visible={visible} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator color="#7C3AED" size="large" />
          <Text style={styles.label}>Exporting data...</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(20, 28, 46, 0.35)' },
  card: { minWidth: 176, alignItems: 'center', gap: 12, borderRadius: 16, paddingHorizontal: 28, paddingVertical: 24, backgroundColor: '#FFFFFF' },
  label: { color: '#253046', fontSize: 14, fontWeight: '700' },
  title: { alignSelf: 'flex-start', color: '#1D2639', fontSize: 18, fontWeight: '800' },
  message: { alignSelf: 'flex-start', color: '#58677E', fontSize: 14 },
  actions: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  button: { minWidth: 70, alignItems: 'center', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  noButton: { backgroundColor: '#EDF0F5' },
  yesButton: { backgroundColor: '#7C3AED' },
  noText: { color: '#3D4A60', fontWeight: '700' },
  yesText: { color: '#FFFFFF', fontWeight: '700' },
});
