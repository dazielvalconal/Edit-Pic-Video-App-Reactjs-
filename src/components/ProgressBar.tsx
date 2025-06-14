import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressView } from '@react-native-community/progress-view';

interface ProgressBarProps {
  progress: number;
  isProcessing: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Đang xóa phông nền: {Math.round(progress * 100)}%
      </Text>
      <ProgressView
        style={styles.progressBar}
        progress={progress}
        progressTintColor="#007AFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  progressText: {
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  progressBar: {
    width: '100%',
  },
});

export default ProgressBar;