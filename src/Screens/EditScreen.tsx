import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  PanResponder,
  Alert,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import ToolBar from '../components/ToolBar';
import ImageEditorWrapper from '../components/ImageEditorWrapper';
import TextToolbar from '../components/TextToolbar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TextOverlay {
  id: string;
  content: string;
  color: string;
  fontSize: number;
  position: { x: number; y: number };
  panResponder: any;
}

const EditScreen = ({ route, navigation }) => {
  const { image } = route.params;
  const [currentImageUri, setCurrentImageUri] = useState(image.uri);
  const [originalImage, setOriginalImage] = useState(image);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const viewShotRef = useRef();

  const stateRef = useRef();
  stateRef.current = { textOverlays, selectedText, isEditingText, cropArea };

  const cropPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !stateRef.current.isEditingText && !stateRef.current.selectedText,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCropArea({ startX: locationX, startY: locationY, x: locationX, y: locationY, width: 0, height: 0 });
    },
    onPanResponderMove: (evt, gestureState) => {
      if (stateRef.current.cropArea) {
        const { moveX, moveY } = gestureState;
        setCropArea((prev) => ({
          ...prev,
          x: Math.min(prev.startX, moveX),
          y: Math.min(prev.startY, moveY),
          width: Math.abs(moveX - prev.startX),
          height: Math.abs(moveY - prev.startY),
        }));
      }
    },
    onPanResponderRelease: () => {
      if (stateRef.current.cropArea && (stateRef.current.cropArea.width < 20 || stateRef.current.cropArea.height < 20)) {
        setCropArea(null);
      }
    },
  });

  const createTextPanResponder = useCallback((id: string) => {
    let lastDx = 0, lastDy = 0;
    const threshold = 5;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setSelectedText(id);
        setIsEditingText(true);
        lastDx = 0;
        lastDy = 0;
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const deltaX = dx - lastDx;
        const deltaY = dy - lastDy;
        if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
          setTextOverlays((prev) =>
            prev.map((text) =>
              text.id === id
                ? { ...text, position: { x: text.position.x + deltaX, y: text.position.y + deltaY } }
                : text
            )
          );
          lastDx = dx;
          lastDy = dy;
        }
      },
      onPanResponderRelease: () => {
        setSelectedText(null);
        setIsEditingText(false);
      },
    });
  }, []);

  const removeSelectedText = useCallback(() => {
    if (stateRef.current.selectedText) {
      setTextOverlays((prev) => prev.filter((text) => text.id !== stateRef.current.selectedText));
      setSelectedText(null);
    }
  }, []);

  const handleText = () => {
    navigation.navigate('TextInput', {
      imageUri: currentImageUri,
      onSave: (uri) => setCurrentImageUri(uri),
    });
  };

  const handleAdjustments = () => {
    navigation.navigate('Adjustment', {
      image: currentImageUri,
      onSave: (uri) => setCurrentImageUri(uri),
    });
  };

  useEffect(() => {
    let mounted = true;
    Image.getSize(currentImageUri, (width, height) => {
      if (mounted) setImageDimensions({ width, height });
    }, (error) => console.log('Error getting image size:', error));
    return () => { mounted = false; };
  }, [currentImageUri]);

  const flipImage = async () => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        currentImageUri,
        [{ flip: ImageManipulator.FlipType.Horizontal }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setCurrentImageUri(manipulatedImage.uri);
      setOriginalImage({ ...originalImage, uri: manipulatedImage.uri });
    } catch (error) {
      console.error('Error flipping image:', error);
      Alert.alert('Lỗi', 'Không thể lật ảnh');
    }
  };

  const rotateImage = async () => {
    try {
      const newRotation = (rotation + 90) % 360;
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        currentImageUri,
        [{ rotate: 90 }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setCurrentImageUri(manipulatedImage.uri);
      setOriginalImage({ ...originalImage, uri: manipulatedImage.uri });
      setRotation(newRotation);
    } catch (error) {
      console.error('Error rotating image:', error);
      Alert.alert('Lỗi', 'Không thể xoay ảnh');
    }
  };

  const cropImage = async () => {
    if (!stateRef.current.cropArea || stateRef.current.cropArea.width < 20 || stateRef.current.cropArea.height < 20) {
      Alert.alert('Vùng chọn không hợp lệ', 'Vui lòng chọn vùng lớn hơn');
      return;
    }
    try {
      const { width: imgWidth, height: imgHeight } = imageDimensions;
      const scaleX = imgWidth / screenWidth;
      const scaleY = imgHeight / (screenHeight * 0.85);
      const cropX = Math.max(0, stateRef.current.cropArea.x * scaleX);
      const cropY = Math.max(0, stateRef.current.cropArea.y * scaleY);
      const cropWidth = Math.min(stateRef.current.cropArea.width * scaleX, imgWidth - cropX);
      const cropHeight = Math.min(stateRef.current.cropArea.height * scaleY, imgHeight - cropY);

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        currentImageUri,
        [{ crop: { originX: cropX, originY: cropY, width: cropWidth, height: cropHeight } }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      setCurrentImageUri(manipulatedImage.uri);
      setOriginalImage({ ...originalImage, uri: manipulatedImage.uri });
      setCropArea(null);
    } catch (error) {
      console.error('Error cropping image:', error);
      Alert.alert('Lỗi', 'Không thể cắt ảnh');
    }
  };

  const removeBackground = () => {
    navigation.navigate('BackgroundRemove', { imageUri: currentImageUri });
  };

  const handleFilter = () => {
    navigation.navigate('FilterEdit', { image: originalImage, previewUrl: currentImageUri });
  };

  const saveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện');
        return;
      }
      const uri = await viewShotRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('EditedPhotos', asset, false);
      Alert.alert('Thành công', 'Ảnh đã được lưu vào thư viện');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Lỗi', 'Không thể lưu ảnh');
    }
  };

  // Kiểm tra imageUri hợp lệ
  if (!currentImageUri) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Không tìm thấy ảnh. Vui lòng thử lại.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.viewShot}>
            <ImageEditorWrapper
              imageUri={currentImageUri}
              cropArea={cropArea}
              cropPanResponder={cropPanResponder}
              textOverlays={textOverlays}
              selectedText={selectedText}
              onTextPress={(id) => setSelectedText(id)}
            />
          </ViewShot>
          <TextToolbar selectedText={selectedText} onRemove={removeSelectedText} />
        </View>
        <ToolBar
          onFlip={flipImage}
          onRotate={rotateImage}
          onCrop={cropImage}
          onRemoveBackground={removeBackground}
          onFilter={handleFilter}
          onAdjust={handleAdjustments}
          onSave={saveImage}
          cropArea={cropArea}
        />
        <TouchableOpacity style={styles.textButton} onPress={handleText}>
          <Text style={styles.iconText}>🖌️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  contentWrapper: {
    flex: 1,
  },
  viewShot: {
    flex: 1,
  },
  textButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF99CC',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EditScreen;