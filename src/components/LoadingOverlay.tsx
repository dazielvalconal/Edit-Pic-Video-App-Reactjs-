import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingOverlayProps {
  isProcessing: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.loadingText}>Đang xử lý...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,240,245,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#F06292',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingOverlay;