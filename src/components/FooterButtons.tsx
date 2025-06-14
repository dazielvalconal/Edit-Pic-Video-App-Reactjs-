import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FooterButtonsProps {
  onSave: () => void;
  onCancel: () => void;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({ onSave, onCancel }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={onSave}>
        <Text style={styles.footerButtonText}>✓</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={onCancel}>
        <Text style={styles.footerButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingBottom: 20,
  },
  footerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF9BBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default FooterButtons;