import React from 'react';
import { View, Text, StyleSheet, PanResponderInstance } from 'react-native';

interface TextOverlayProps {
  id: string;
  content: string;
  color: string;
  fontSize: number;
  position: { x: number; y: number };
  isSelected: boolean;
  panResponder: PanResponderInstance;
}

const TextOverlay: React.FC<TextOverlayProps> = ({
  id,
  content,
  color,
  fontSize,
  position,
  isSelected,
  panResponder,
}) => {
  return (
    <View
      style={[
        styles.textOverlay,
        {
          left: position.x,
          top: position.y,
          borderWidth: isSelected ? 1 : 0,
          borderColor: isSelected ? '#FF66B2' : 'transparent',
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Text
        style={{
          color,
          fontSize,
          textShadowColor: 'rgba(0,0,0,0.3)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        }}
      >
        {content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textOverlay: {
    position: 'absolute',
    padding: 4,
    borderStyle: 'dashed',
  },
});

export default TextOverlay;