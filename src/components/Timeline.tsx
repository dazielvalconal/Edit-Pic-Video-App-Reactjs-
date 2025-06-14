import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TimelineProps {
  currentTime: number;
  duration: number;
}

const Timeline: React.FC<TimelineProps> = ({ currentTime, duration }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.timeline}>
      <Text style={styles.timeText}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
      <View style={styles.seekBar}>
        <View style={[styles.progress, { width: `${(currentTime / duration) * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeline: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  timeText: {
    color: '#F48FB1',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  seekBar: {
    height: 4,
    backgroundColor: '#FF99CC',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#FF99CC',
  },
});

export default Timeline;