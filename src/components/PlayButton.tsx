import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface PlayButtonProps {
  isPlaying: boolean;
  onPress: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onPress }) => {
  return (
    <TouchableOpacity style={styles.playButton} onPress={onPress}>
      <View style={isPlaying ? styles.pauseIcon : styles.playIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playButton: {
    marginVertical: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F48FB1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderLeftColor: '#FFFFFF',
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    marginLeft: 5,
  },
  pauseIcon: {
    width: 15,
    height: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#FFFFFF',
    borderRightWidth: 5,
    borderRightColor: '#FFFFFF',
    marginHorizontal: 5,
  },
});

export default PlayButton;