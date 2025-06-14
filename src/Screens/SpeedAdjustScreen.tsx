import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import PlayPauseButton from '../components/PlayPauseButton';
import SpeedSelector from '../components/SpeedSelector';
import LoadingOverlay from '../components/LoadingOverlay';

export default function SpeedAdjustScreen({ route, navigation }) {
  const { video } = route.params;
  const videoRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSpeed = async (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(newSpeed, true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <VideoPlayer
          ref={videoRef}
          source={{ uri: video.uri }}
          rotation={0}
          rate={speed}
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish && isPlaying) {
              videoRef.current.replayAsync();
            }
          }}
        />
        <View style={styles.controlContainer}>
          <PlayPauseButton
            isPlaying={isPlaying}
            onPress={handlePlayPause}
            disabled={isProcessing}
          />
        </View>
        <Text style={styles.speedTitle}>Tốc độ hiện tại: {speed.toFixed(2)}x</Text>
        <SpeedSelector speed={speed} onSpeedChange={changeSpeed} />
        <LoadingOverlay isProcessing={isProcessing} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  controlContainer: {
    marginVertical: 15,
  },
  speedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F06292',
    marginVertical: 15,
    textAlign: 'center',
  },
});