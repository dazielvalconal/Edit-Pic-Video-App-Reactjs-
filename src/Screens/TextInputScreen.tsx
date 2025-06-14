import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  PanResponder,
  Alert,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const COLORS = [
  { name: 'Đen', value: '#000000' },
  { name: 'Trắng', value: '#FFFFFF' },
  { name: 'Đỏ', value: '#FF0000' },
  { name: 'Xanh lá', value: '#00FF00' },
  { name: 'Xanh dương', value: '#0000FF' },
  { name: 'Vàng', value: '#FFFF00' },
  { name: 'Hồng', value: '#FF00FF' },
  { name: 'Xanh ngọc', value: '#00FFFF' },
];

const FONT_SIZES = [12, 16, 20, 24, 28, 32, 36, 40, 48];

const TextInputScreen = ({ navigation, route }) => {
  const { imageUri, onSave } = route.params;
  const viewShotRef = useRef(null);

  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [textOverlays, setTextOverlays] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageLayout, setImageLayout] = useState({ 
    width: screenWidth, 
    height: screenHeight * 0.6,
    x: 0,
    y: 0
  });

  const createTextPanResponder = useCallback((id) => {
    const MOVE_THRESHOLD = 10;
    let startX = 0;
    let startY = 0;
    let hasMoved = false;
    let initialDistance = 0;
    let initialAngle = 0;
    let initialScale = 1;
    let initialRotation = 0;
    let multiTouch = false;

    // Tính khoảng cách giữa 2 điểm chạm
    const getDistance = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // Tính góc giữa 2 điểm chạm
    const getAngle = (x1, y1, x2, y2) => {
      return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setSelectedTextId(id);
        startX = gestureState.x0;
        startY = gestureState.y0;
        hasMoved = false;
        multiTouch = evt.nativeEvent.touches.length > 1;

        // Nếu có 2 ngón tay
        if (multiTouch && evt.nativeEvent.touches.length === 2) {
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          
          initialDistance = getDistance(
            touch1.pageX, touch1.pageY,
            touch2.pageX, touch2.pageY
          );
          
          initialAngle = getAngle(
            touch1.pageX, touch1.pageY,
            touch2.pageX, touch2.pageY
          );

          // Lấy scale và rotation hiện tại
          const currentOverlay = textOverlays.find(item => item.id === id);
          initialScale = currentOverlay?.scale || 1;
          initialRotation = currentOverlay?.rotation || 0;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // Xử lý đa chạm (2 ngón tay) - chỉnh kích thước và xoay
        if (evt.nativeEvent.touches.length === 2) {
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          
          const currentDistance = getDistance(
            touch1.pageX, touch1.pageY,
            touch2.pageX, touch2.pageY
          );
          
          const currentAngle = getAngle(
            touch1.pageX, touch1.pageY,
            touch2.pageX, touch2.pageY
          );
          
          // Tính toán tỉ lệ kích thước mới
          const newScale = initialScale * (currentDistance / initialDistance);
          
          // Tính toán góc xoay mới
          let angleDiff = currentAngle - initialAngle;
          const newRotation = (initialRotation + angleDiff) % 360;

          setTextOverlays(prev => prev.map(item => {
            if (item.id === id) {
              return {
                ...item,
                scale: newScale,
                rotation: newRotation
              };
            }
            return item;
          }));
        } 
        // Xử lý di chuyển (1 ngón tay)
        else if (evt.nativeEvent.touches.length === 1) {
          const { moveX, moveY } = gestureState;
          const dx = moveX - startX;
          const dy = moveY - startY;

          if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD || hasMoved) {
            hasMoved = true;
            setTextOverlays(prev => prev.map(item => {
              if (item.id === id) {
                const textWidth = item.content.length * (item.fontSize * 0.6);
                const textHeight = item.fontSize * 1.2;
                
                const newX = Math.max(
                  imageLayout.x + 5,
                  Math.min(
                    item.position.x + dx,
                    imageLayout.x + imageLayout.width - textWidth - 5
                  )
                );
                
                const newY = Math.max(
                  imageLayout.y + 5,
                  Math.min(
                    item.position.y + dy,
                    imageLayout.y + imageLayout.height - textHeight - 5
                  )
                );

                return {
                  ...item,
                  position: { x: newX, y: newY }
                };
              }
              return item;
            }));
            startX = moveX;
            startY = moveY;
          }
        }
      },
      onPanResponderRelease: () => {
        // Keep selected state after moving
      },
    });
  }, [imageLayout, textOverlays]);

  const addTextOverlay = () => {
    if (!text.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập văn bản');
      return;
    }

    const newId = Date.now().toString();
    const newTextOverlay = {
      id: newId,
      content: text,
      color: selectedColor,
      fontSize,
      position: { 
        x: imageLayout.x + (imageLayout.width / 2) - 50, 
        y: imageLayout.y + (imageLayout.height / 2) 
      },
      scale: 1,       // Thêm thuộc tính scale mặc định
      rotation: 0,    // Thêm thuộc tính rotation mặc định
      panResponder: createTextPanResponder(newId),
    };
    
    setTextOverlays(prev => [...prev, newTextOverlay]);
    setText('');
    setSelectedTextId(newId);
  };

  const updateSelectedText = (property, value) => {
    if (selectedTextId) {
      setTextOverlays(prev =>
        prev.map(item =>
          item.id === selectedTextId ? { ...item, [property]: value } : item
        )
      );
    }
  };

  const saveImageWithText = async () => {
    if (isProcessing) return;
    
    if (textOverlays.length === 0) {
      Alert.alert('Chú ý', 'Bạn chưa thêm text nào vào ảnh');
      return;
    }

    setIsProcessing(true);
    setIsCapturing(true); // Tắt viền trước khi chụp

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission not granted');
      }

      const uri = await viewShotRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('TextPhotos', asset, false);

      if (onSave) {
        onSave(uri);
      }

      Alert.alert('Thành công', 'Ảnh đã được lưu vào thư viện');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi lưu ảnh:', error);
      Alert.alert('Lỗi', 'Không thể lưu ảnh. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
      setIsCapturing(false); // Bật lại viền sau khi chụp xong
    }
  };

  const cancelEdit = () => {
    setTextOverlays([]);
    setSelectedTextId(null);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 0.9 }}
          style={styles.shotContainer}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              setImageLayout({ x, y, width, height });
            }}
          />
          
          {textOverlays.map((item) => (
            <View
              key={item.id}
              style={[
                styles.textOverlay,
                {
                  left: item.position.x - imageLayout.x,
                  top: item.position.y - imageLayout.y,
                  borderWidth: (!isCapturing && selectedTextId === item.id) ? 1 : 0,
                  borderColor: selectedTextId === item.id ? '#FF66B2' : 'transparent',
                  borderStyle: 'dashed',
                  transform: [
                    { scale: item.scale || 1 },
                    { rotate: `${item.rotation || 0}deg` }
                  ]
                },
              ]}
              {...item.panResponder.panHandlers}
            >
              <Text
                style={{
                  color: item.color,
                  fontSize: item.fontSize,
                  textShadowColor: 'rgba(0,0,0,0.3)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                {item.content}
              </Text>
            </View>
          ))}
        </ViewShot>

        <ScrollView style={styles.controlsContainer}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Nhập văn bản..."
            placeholderTextColor="#999"
            multiline
          />
          
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addTextOverlay}
            disabled={!text.trim()}
          >
            <Text style={styles.addButtonText}>Thêm Text</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Màu sắc</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorsContainer}
          >
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  selectedColor === color.value && styles.selectedColor,
                ]}
                onPress={() => {
                  setSelectedColor(color.value);
                  updateSelectedText('color', color.value);
                }}
              />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Kích thước chữ</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sizesContainer}
          >
            {FONT_SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeOption,
                  fontSize === size && styles.selectedSize,
                ]}
                onPress={() => {
                  setFontSize(size);
                  updateSelectedText('fontSize', size);
                }}
              >
                <Text style={fontSize === size ? styles.selectedSizeText : styles.sizeText}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelEdit}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (isProcessing || textOverlays.length === 0) && styles.disabledButton
              ]}
              onPress={saveImageWithText}
              disabled={isProcessing || textOverlays.length === 0}
            >
              <Text style={styles.saveButtonText}>
                {isProcessing ? 'Đang lưu...' : 'Lưu ảnh'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  shotContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.6,
  },
  textOverlay: {
    position: 'absolute',
    padding: 4,
    // Thêm thuộc tính để hỗ trợ transform tốt hơn
    backfaceVisibility: 'hidden',
    transformOrigin: 'center',
  },
  controlsContainer: {
    maxHeight: screenHeight * 0.4,
    padding: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#FF66B2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  colorsContainer: {
    paddingVertical: 4,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FF66B2',
  },
  sizesContainer: {
    paddingVertical: 4,
  },
  sizeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEE',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSize: {
    backgroundColor: '#FF66B2',
  },
  sizeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSizeText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#E6F7FF',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  infoText: {
    color: '#0066CC',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EEE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF66B2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default TextInputScreen;