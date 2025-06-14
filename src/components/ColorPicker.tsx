import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';


const COLORS = [
    { name: 'Trắng', value: '#FFFFFF' },
    { name: 'Đen', value: '#000000' },
    { name: 'Xanh dương', value: '#87CEEB' },
    { name: 'Xanh lá', value: '#32CD32' },
    { name: 'Đỏ', value: '#FF0000' },
    { name: 'Vàng', value: '#FFD700' },
    { name: 'Cam', value: '#FFA500' },
    { name: 'Hồng', value: '#FFC0CB' },
    { name: 'Tím', value: '#800080' },
    { name: 'Xám', value: '#808080' },
    { name: 'Nâu', value: '#A52A2A' },
    { name: 'Hồng đậm', value: '#FF1493' },
    { name: 'Xanh lá cây', value: '#008000' },
    { name: 'Xanh dương đậm', value: '#0000FF' },
    { name: 'Xanh dương nhạt', value: '#ADD8E6' },
    { name: 'Xanh lá cây đậm', value: '#006400' },
    { name: 'Xanh lá cây nhạt', value: '#90EE90' },
    { name: 'Xanh lơ', value: '#00FF7F' },
    { name: 'Xanh lơ nhạt', value: '#98FB98' },
    { name: 'Xanh lơ đậm', value: '#2E8B57' },
    { name: 'Xanh lơ đậm nhạt', value: '#3CB371' },
    { name: 'Xanh lơ đậm đậm', value: '#228B22' },
    { name: 'Xanh lơ đậm đậm nhạt', value: '#32CD32' },
    { name: 'Xanh lơ đậm đậm đậm', value: '#008B8B' },
    { name: 'Xanh lơ đậm đậm đậm nhạt', value: '#00CED1' },
  
];

const ColorPicker = ({ backgroundColor, onColorChange }) => {
  const getTextColor = (bgColor) => {
    if (bgColor.includes('linear-gradient')) {
      return '#FFF';
    }
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#333' : '#FFF';
  };

  const renderColorItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.colorBox,
        { backgroundColor: item.value.includes('linear-gradient') ? '#87CEEB' : item.value },
        backgroundColor === item.value && styles.selectedColorBox,
      ]}
      onPress={() => onColorChange(item.value)}
    >
      <Text style={[styles.colorText, { color: getTextColor(item.value) }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.colorPicker}>
      <FlatList
        horizontal
        data={COLORS}
        renderItem={renderColorItem}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.colorGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  colorPicker: {
    width: '100%',
    paddingHorizontal: 10,
  },
  colorGrid: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  colorBox: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCCDD',
    shadowColor: '#FF99CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedColorBox: {
    borderWidth: 3,
    borderColor: '#FF66B2',
  },
  colorText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ColorPicker;