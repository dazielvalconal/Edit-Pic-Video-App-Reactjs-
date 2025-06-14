import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { Video, VideoProps } from 'expo-av';

interface VideoPlayerProps extends VideoProps {
  rotation: number;
}

// Use forwardRef to allow VideoPlayer to accept a ref
const VideoPlayer = forwardRef<any, VideoPlayerProps>(({ rotation, ...props }, ref) => {
  return (
    <Video
      ref={ref}
      style={[styles.video, { transform: [{ rotate: `${rotation}deg` }] }]}
      resizeMode="contain"
      useNativeControls={false}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFF0F5',
  },
});

export default VideoPlayer;