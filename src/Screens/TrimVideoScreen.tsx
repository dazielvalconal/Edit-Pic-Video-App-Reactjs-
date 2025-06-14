import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import PlayButton from '../components/PlayButton';
import TimeSlider from '../components/TimeSlider';

export default function TrimVideoScreen({ route }) {
  const { video } = route.params;
  const [videoUri] = useState(video.uri);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(video.duration || 0);
  const [duration, setDuration] = useState(video.duration || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          setDuration(status.durationMillis / 1000);
          setEndTime(status.durationMillis / 1000);
        }
      }
    })();
  }, [videoUri]);

  const togglePlayback = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.setPositionAsync(startTime * 1000);
        await videoRef.current.playFromPositionAsync(startTime * 1000);
        setIsPlaying(true);
      }
    }
  };

  const handleStartTimeChange = (value: number) => {
    setStartTime(value);
    if (value >= endTime) setEndTime(value + 0.1);
    if (videoRef.current && !isPlaying) {
      videoRef.current.setPositionAsync(value * 1000);
    }
  };

  const handleEndTimeChange = (value: number) => {
    setEndTime(value);
    if (value <= startTime) setStartTime(value - 0.1);
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.positionMillis >= endTime * 1000 && isPlaying) {
      videoRef.current.setPositionAsync(startTime * 1000);
      videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <VideoPlayer
        ref={videoRef}
        source={{ uri: videoUri }}
        rotation={0}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
      <PlayButton isPlaying={isPlaying} onPress={togglePlayback} />
      <TimeSlider
        startTime={startTime}
        endTime={endTime}
        duration={duration}
        onStartTimeChange={handleStartTimeChange}
        onEndTimeChange={handleEndTimeChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});