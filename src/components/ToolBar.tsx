import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';

const ToolBar = ({
  onFlip,
  onRotate,
  onCrop,
  onRemoveBackground,
  onFilter,
  onAdjust, // Thêm prop mới
  onSave,
  cropArea,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.toolsContainer}
        contentContainerStyle={styles.toolsContent}
      >
        <TouchableOpacity style={styles.toolButton} onPress={onFlip}>
          <Text style={styles.iconText}>⟳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={onRotate}>
          <Text style={styles.iconText}>↻</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={onCrop}
          disabled={!cropArea}
        >
          <Text style={[styles.iconText, !cropArea && styles.disabledText]}>✂</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButtonText} onPress={onRemoveBackground}>
          <Text style={styles.buttonText}>Nền</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButtonText} onPress={onFilter}>
          <Text style={styles.buttonText}>Bộ Lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={onSave}>
          <Text style={styles.iconText}>✔</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  toolsContainer: {
    flexGrow: 0,
  },
  toolsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  toolButton: {
    backgroundColor: '#FF99CC',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  toolButtonText: {
    backgroundColor: '#FF99CC',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default ToolBar;