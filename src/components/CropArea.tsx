import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CropAreaProps {
  cropArea: { startX: number; startY: number; x: number; y: number; width: number; height: number } | null;
}

const CropArea: React.FC<CropAreaProps> = ({ cropArea }) => {
  if (!cropArea || cropArea.width < 20 || cropArea.height < 20) return null;

  return (
    <View
      style={[
        styles.cropArea,
        {
          left: cropArea.x,
          top: cropArea.y,
          width: cropArea.width,
          height: cropArea.height,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  cropArea: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FF66B2',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default CropArea;