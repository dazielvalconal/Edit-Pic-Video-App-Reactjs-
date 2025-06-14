import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

interface EditPanelProps {
  onTrim: () => void;
  onSpeedAdjust: () => void;
  onRotate: () => void;
  onSave: () => void;
  disabled: boolean;
}

const EditPanel: React.FC<EditPanelProps> = ({ onTrim, onSpeedAdjust, onRotate, onSave, disabled }) => {
  return (
    <View style={styles.editPanel}>
      <TouchableOpacity style={styles.editButton} onPress={onTrim} disabled={disabled}>
        <FontAwesome name="scissors" size={24} color="white" />
        <Text style={styles.editButtonText}>Cắt</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={onSpeedAdjust} disabled={disabled}>
        <MaterialIcons name="speed" size={24} color="white" />
        <Text style={styles.editButtonText}>Tốc độ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={onRotate} disabled={disabled}>
        <MaterialIcons name="rotate-right" size={24} color="white" />
        <Text style={styles.editButtonText}>Xoay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={onSave} disabled={disabled}>
        <MaterialIcons name="save" size={24} color="white" />
        <Text style={styles.editButtonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  editPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFF0F5',
    borderTopWidth: 1,
    borderColor: '#F8BBD0',
  },
  editButton: {
    alignItems: 'center',
    padding: 10,
    minWidth: 60,
    backgroundColor: '#FF99CC',
    borderRadius: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EditPanel;