import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ControlBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  disabled: boolean;
}

const ControlBar: React.FC<ControlBarProps> = ({ isPlaying, onPlayPause, disabled }) => {
  return (
    <View style={styles.controlBar}>
      <TouchableOpacity
        style={styles.controlButton}
        onPress={onPlayPause}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <MaterialIcons
          name={isPlaying ? 'pause' : 'play-arrow'}
          size={44}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  controlButton: {
    marginHorizontal: 25,
    padding: 15,
    backgroundColor: '#FF99CC',
    borderRadius: 50,
    shadowColor: '#F48FB1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default ControlBar;