import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  disabled: boolean;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ isPlaying, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={styles.playPauseButton}
      onPress={onPress}
      disabled={disabled}
    >
      <MaterialIcons
        name={isPlaying ? 'pause' : 'play-arrow'}
        size={32}
        color="#FFFFFF"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playPauseButton: {
    backgroundColor: '#FF99CC',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F48FB1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default PlayPauseButton;