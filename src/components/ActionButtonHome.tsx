import React from 'react';
import { TouchableOpacity, Text, StyleSheet ,View } from 'react-native';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
}

const ActionButtonHome: React.FC<ActionButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '95%',
    marginVertical: 12,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FF8AB5',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default ActionButtonHome;