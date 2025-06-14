import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const ActionButtons = ({ onSave, onCancel }) => {
  return (
    <View style={styles.topButtonContainer}>
      <TouchableOpacity style={styles.topButton} onPress={onSave}>
        <Text style={styles.topButtonText}>✓</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.topButton} onPress={onCancel}>
        <Text style={styles.topButtonText}>x</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  topButton: {
    backgroundColor: '#FF99CC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActionButtons;