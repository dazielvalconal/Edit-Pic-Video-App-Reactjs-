import Constants from 'expo-constants';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Alert } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import * as MediaLibrary from 'expo-media-library';
import ColorPicker from '../components/ColorPicker';
import ImageContainer from '../components/ImageContainer';
import ActionButtons from '../components/ActionButtons';
import ProgressBar from '../components/ProgressBar';

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
const API_URL = extra.API_URL || 'https://api.remove.bg/v1.0/removebg';
const API_KEY = extra.API_KEY || 'MMNZofL3EefdSshaCKPE93FH';

export default function BackgroundRemoveScreen({ route, navigation }) {
  const { imageUri: initialImageUri } = route.params;
  const [imageUri] = useState(initialImageUri);
  const [processedImageUri, setProcessedImageUri] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const viewShotRef = useRef(null);

  useEffect(() => {
    removeBackground();
  }, []);

  const simulateProgress = async () => {
    let currentProgress = 0;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        currentProgress += 0.1;
        if (currentProgress >= 0.8) {
          clearInterval(interval);
          resolve();
        }
        setProgress(currentProgress);
      }, 200);
    });
  };

  const removeBackground = async () => {
    setIsProcessing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('image_file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'Nationwide.jpg',
    });
    formData.append('size', 'auto');

    try {
      const progressPromise = simulateProgress();
      const response = await axios.post(API_URL, formData, {
        headers: {
          'X-Api-Key': API_KEY,
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total * 0.5);
            setProgress(percentCompleted / 100);
          }
        },
      });

      await progressPromise;
      setProgress(0.9);
      const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
      setProcessedImageUri(base64Image);
      setProgress(1);
    } catch (error) {
      console.log('Error details:', error.response?.data);
      const errorMessage = error.response?.data
        ? Buffer.from(error.response.data).toString('utf-8')
        : error.message || 'Không xác định';
      Alert.alert('Lỗi khi xóa phông nền: ' + errorMessage);
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveImageToLibrary = async () => {
    if (!processedImageUri) {
      Alert.alert('Vui lòng xóa phông nền trước!');
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền để lưu ảnh vào thư viện!');
        return;
      }

      const uri = await viewShotRef.current?.capture();
      if (!uri) {
        throw new Error('Không thể chụp ảnh.');
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('EditedPhotos', asset, false);
      Alert.alert('Thành công', 'Ảnh đã được lưu vào thư viện!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi khi lưu ảnh: ' + (error.message || 'Không xác định'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ImageContainer
          imageUri={imageUri}
          processedImageUri={processedImageUri}
          backgroundColor={backgroundColor}
          viewShotRef={viewShotRef}
        />
        <ProgressBar progress={progress} isProcessing={isProcessing} />
        <ColorPicker
          backgroundColor={backgroundColor}
          onColorChange={(color) => {
            setBackgroundColor(color);
            if (processedImageUri) {
              setProgress(0.5);
              setTimeout(() => setProgress(1), 500);
            }
          }}
        />
        <ActionButtons
          onSave={saveImageToLibrary}
          onCancel={() => navigation.goBack()}
          disabled={isProcessing}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
});