import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface TimeSliderProps {
  startTime: number;
  endTime: number;
  duration: number;
  onStartTimeChange: (value: number) => void;
  onEndTimeChange: (value: number) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({
  startTime,
  endTime,
  duration,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.label}>Bắt đầu: {startTime.toFixed(2)}s</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={startTime}
        onValueChange={onStartTimeChange}
        minimumTrackTintColor="#F06292"
        maximumTrackTintColor="#F8BBD0"
        thumbTintColor="#F48FB1"
      />
      <Text style={styles.label}>Kết thúc: {endTime.toFixed(2)}s</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={endTime}
        onValueChange={onEndTimeChange}
        minimumTrackTintColor="#F06292"
        maximumTrackTintColor="#F8BBD0"
        thumbTintColor="#F48FB1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: '90%',
    marginVertical: 20,
  },
  slider: {
    width: '100%',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#F06292',
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TimeSlider;