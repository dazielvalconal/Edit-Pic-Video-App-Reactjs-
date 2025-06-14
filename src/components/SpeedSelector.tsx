import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet ,View } from 'react-native';

interface SpeedSelectorProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const speedOptions = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

const SpeedSelector: React.FC<SpeedSelectorProps> = ({ speed, onSpeedChange }) => {
  return (
    <View style={styles.speedButtonsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.speedButtonsScroll}>
        {speedOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.speedButton,
              speed === option ? styles.speedButtonActive : null,
            ]}
            onPress={() => onSpeedChange(option)}
          >
            <Text
              style={[
                styles.speedButtonText,
                speed === option ? styles.speedButtonTextActive : null,
              ]}
            >
              x{option.toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  speedButtonsContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  speedButtonsScroll: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  speedButton: {
    backgroundColor: '#FFF0F5',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FFB6C1',
    minWidth: 75,
    alignItems: 'center',
    shadowColor: '#F48FB1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  speedButtonActive: {
    backgroundColor: '#FF99CC',
    borderColor: '#FF69B4',
  },
  speedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F06292',
  },
  speedButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SpeedSelector;