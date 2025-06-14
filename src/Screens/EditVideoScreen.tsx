import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import VideoPlayer from '../components/VideoPlayer';
import Timeline from '../components/Timeline';
import ControlBar from '../components/ControlBar';
import EditPanel from '../components/EditPanel';
import LoadingOverlay from '../components/LoadingOverlay';

export default function EditVideoScreen({ route, navigation }) {
  const { video } = route.params;
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 0);
  const [rotation, setRotation] = useState(0);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = async (seconds) => {
    await videoRef.current.setPositionAsync(seconds * 1000);
    setCurrentTime(seconds);
  };

  const handleTrim = () => {
    navigation.navigate('TrimVideo', { video });
  };

  const handleSpeedAdjust = () => {
    navigation.navigate('SpeedAdjust', { video });
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
  };

  const saveVideoWithRotation = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(video.uri);
      await MediaLibrary.createAlbumAsync('Videos đã chỉnh sửa', asset, false);
      Alert.alert(
        'Thành công',
        rotation === 0
          ? 'Video đã được lưu vào thư viện'
          : 'Video đã được lưu. Lưu ý: Xoay video chưa được áp dụng do hạn chế kỹ thuật.'
      );

      navigation.goBack();
    } catch (error) {
      console.error('Error saving video:', error);
      Alert.alert('Lỗi', 'Không thể lưu video');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <VideoPlayer
          ref={videoRef}
          source={{ uri: video.uri }}
          rotation={rotation}
          onPlaybackStatusUpdate={(status) => {
            setStatus(status);
            setCurrentTime(status.positionMillis / 1000);
            if (!duration) setDuration(status.durationMillis / 1000);
          }}
        />
        <Timeline currentTime={currentTime} duration={duration} />
        <ControlBar
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          disabled={isProcessing}
        />
        <EditPanel
          onTrim={handleTrim}
          onSpeedAdjust={handleSpeedAdjust}
          onRotate={handleRotate}
          onSave={saveVideoWithRotation}
          disabled={isProcessing}
        />
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
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});