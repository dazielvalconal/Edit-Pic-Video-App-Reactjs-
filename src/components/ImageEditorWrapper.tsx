import React from 'react';
import { View, Image, StyleSheet, PanResponderInstance, Dimensions } from 'react-native';
import CropArea from './CropArea';
import TextOverlay from './TextOverlay';

const { height: screenHeight } = Dimensions.get('window');

interface TextOverlayData {
  id: string;
  content: string;
  color: string;
  fontSize: number;
  position: { x: number; y: number };
  panResponder: PanResponderInstance;
}

interface ImageEditorWrapperProps {
  imageUri: string;
  cropArea: { startX: number; startY: number; x: number; y: number; width: number; height: number } | null;
  cropPanResponder: PanResponderInstance;
  textOverlays: TextOverlayData[];
  selectedText: string | null;
  onTextPress: (id: string) => void;
}

const ImageEditorWrapper: React.FC<ImageEditorWrapperProps> = ({
  imageUri,
  cropArea,
  cropPanResponder,
  textOverlays,
  selectedText,
  onTextPress,
}) => {
  // Kiểm tra URI hợp lệ
  if (!imageUri) {
    console.warn('Image URI is invalid or missing');
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container} {...cropPanResponder.panHandlers}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
        onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
      />
      <CropArea cropArea={cropArea} />
      {textOverlays.map((item) => (
        <TextOverlay
          key={item.id}
          id={item.id}
          content={item.content}
          color={item.color}
          fontSize={item.fontSize}
          position={item.position}
          isSelected={selectedText === item.id}
          panResponder={item.panResponder}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.85,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageEditorWrapper;