import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface MediaViewerProps {
  mediaUri: string | null;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ mediaUri }) => {
  return (
    <View style={styles.mediaContainer}>
      {mediaUri ? (
        <Image
          source={{ uri: mediaUri }}
          style={styles.media}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.noMediaText}>Không có ảnh nào được chọn</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  noMediaText: {
    fontSize: 16,
    color: '#888',
  },
});

export default MediaViewer;