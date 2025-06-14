import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TextToolbarProps {
  selectedText: string | null;
  onRemove: () => void;
}

const TextToolbar: React.FC<TextToolbarProps> = ({ selectedText, onRemove }) => {
  if (!selectedText) return null;

  return (
    <View style={styles.textToolbar}>
      <TouchableOpacity onPress={onRemove} style={styles.toolbarButton}>
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textToolbar: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  toolbarButton: {
    marginHorizontal: 15,
    padding: 10,
  },
});

export default TextToolbar;