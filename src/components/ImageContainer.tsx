import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';

const ImageContainer = ({ imageUri, processedImageUri, backgroundColor, viewShotRef }) => {
  return (
    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
      <View style={[styles.imageContainer, { backgroundColor }]}>
        {imageUri && !processedImageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
        {processedImageUri && (
          <Image
            source={{ uri: processedImageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ImageContainer;