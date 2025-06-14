import React from 'react';
import { StyleSheet, SafeAreaView, View, Alert, ImageBackground, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import ActionButton from '../components/ActionButtonHome';
import Footer from '../components/Footer';

export default function HomeScreen({ navigation }) {
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền bị từ chối', 'Vui lòng cấp quyền truy cập camera trong cài đặt.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      videoMaxDuration: 60,
      cameraType: ImagePicker.CameraType.back,
    });

    handleMediaResult(result);
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền bị từ chối', 'Vui lòng cấp quyền truy cập thư viện trong cài đặt.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      videoMaxDuration: 60,
    });

    handleMediaResult(result);
  };

  const handleMediaResult = (result) => {
    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      
      if (asset.type === 'video') {
        const videoData = {
          uri: asset.uri,
          type: asset.type || 'video/mp4',
          name: asset.fileName || 'video.mp4',
          duration: asset.duration / 1000,
        };
        console.log('Video data selected:', videoData);
        navigation.navigate('EditVideo', { video: videoData });
      } else {
        const imageData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'image.jpg',
        };
        console.log('Image data selected:', imageData);
        navigation.navigate('Edit', { image: imageData });
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/image.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Header />
          <View style={styles.container}>
            <ActionButton title="Camera" onPress={openCamera} />
            <ActionButton title="Thư Viện" onPress={openGallery} />
          </View>
          <Footer />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight || 40,
  },
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
});