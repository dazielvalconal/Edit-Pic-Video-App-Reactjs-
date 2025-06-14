import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, Alert, StatusBar ,View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import MediaViewer from '../components/MediaViewer';
import FilterList from '../components/FilterList';
import ProgressBar from '../components/ProgressBar1';
import FooterButtons from '../components/FooterButtons';

const FilterEditScreen = ({ route, navigation }) => {
  const image = route?.params?.image || null;
  const previewUrl = image?.uri || null;
  const [filteredMediaUri, setFilteredMediaUri] = useState(previewUrl);
  const [previewMediaUri, setPreviewMediaUri] = useState(previewUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const scrollViewRef = useRef(null);

  const pixelixeApiKey = 'Qb8w0L3oSLTjh9cOBpXwmCzSKr13';
  const imgurClientId = '69abba09acd8853';

  const filters = [
    { id: 'clarendon', name: 'Sáng Rõ', color: '#FFECB3' },
    { id: 'lofi', name: 'Mạnh Mẽ', color: '#E6EE9C' },
    { id: 'hefe', name: 'Ấm Áp', color: '#FFCC80' },
    { id: 'sepia', name: 'Nâu Cũ', color: '#D7CCC8' },
    { id: 'vintage', name: 'Cổ Điển', color: '#C5CAE9' },
    { id: 'gingham', name: 'Nhẹ Nhàng', color: '#F8BBD0' },
    { id: 'nashville', name: 'Hồng Rétro', color: '#E1BEE7' },
    { id: 'toaster', name: 'Viền Cháy', color: '#FFAB91' },
    { id: '1977', name: 'Tông Đỏ', color: '#EF9A9A' },
    { id: 'inkwell', name: 'Đen Trắng', color: '#CFD8DC' },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Cần cấp quyền truy cập thư viện ảnh!');
        Alert.alert(
          'Lỗi quyền',
          'Vui lòng cấp quyền trong cài đặt để sử dụng tính năng này.'
        );
      }
    })();
  }, []);

  const uploadImageToImgur = useCallback(async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
          Authorization: `Client-ID ${imgurClientId}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.link;
    } catch (error) {
      console.error('Lỗi khi tải lên Imgur:', error);
      let errorMessage = 'Không thể tải lên Imgur: ';
      if (error.response) {
        errorMessage += `Status ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'Không nhận được phản hồi từ Imgur';
      } else {
        errorMessage += error.message;
      }
      throw new Error(errorMessage);
    }
  }, [imgurClientId]);

  const applyFilter = useCallback(
    async (filterName, isPreview = false) => {
      if (!image) {
        setError('Vui lòng chọn ảnh trước!');
        return;
      }

      setSelectedFilter(filterName);

      try {
        setIsProcessing(true);
        setProgress(0);
        setError(null);

        const imgurUrl = await uploadImageToImgur(image.uri);
        const url = `https://studio.pixelixe.com/api/photo/effect/v2?apiKey=${pixelixeApiKey}&preset=${filterName}&imageUrl=${encodeURIComponent(imgurUrl)}`;

        const response = await axios.get(url, {
          responseType: 'blob',
          timeout: 30000,
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          if (isPreview) {
            setPreviewMediaUri(reader.result);
          } else {
            setFilteredMediaUri(reader.result);
          }
          setProgress(100);
        };
        reader.readAsDataURL(response.data);
      } catch (error) {
        console.error('Filter error:', error);
        if (error.response) {
          setError(`Lỗi từ máy chủ: ${error.response.status}`);
        } else if (error.request) {
          setError('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại sau.');
        } else {
          setError(`Lỗi: ${error.message}`);
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [image, pixelixeApiKey, uploadImageToImgur]
  );

  const saveFilteredImage = async () => {
    if (!filteredMediaUri) {
      Alert.alert(
        'Lỗi',
        'Chưa có ảnh nào để lưu! Vui lòng áp dụng bộ lọc trước.'
      );
      return;
    }

    try {
      let localUri = filteredMediaUri;

      if (filteredMediaUri.startsWith('data:')) {
        const fileUri = `${FileSystem.cacheDirectory}filtered_image_${Date.now()}.jpg`;
        const base64Data = filteredMediaUri.split(',')[1];
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        localUri = fileUri;
      } else {
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (!fileInfo.exists) {
          throw new Error('Ảnh đã lọc không tồn tại trong hệ thống tệp.');
        }
      }

      const asset = await MediaLibrary.createAssetAsync(localUri);
      await MediaLibrary.createAlbumAsync('Ảnh đã chỉnh sửa', asset, false);
      Alert.alert('Thành công', 'Ảnh đã được lưu vào thư viện!');
      navigation.goBack();

      if (localUri.startsWith(FileSystem.cacheDirectory)) {
        await FileSystem.deleteAsync(localUri);
      }
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      Alert.alert('Lỗi', `Không thể lưu ảnh: ${error.message}`);
    }
  };

  const handlePreview = (filterName) => {
    applyFilter(filterName, true);
  };

  const handleApply = () => {
    if (!previewMediaUri || previewMediaUri === previewUrl) {
      Alert.alert('Lỗi', 'Vui lòng xem trước bộ lọc trước khi áp dụng!');
      return;
    }
    setFilteredMediaUri(previewMediaUri);
    Alert.alert(
      'Thành công',
      'Bộ lọc đã được áp dụng. Nhấn "Lưu" để lưu kết quả.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <MediaViewer mediaUri={previewMediaUri} />
        <ProgressBar isProcessing={isProcessing} progress={progress} />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <FilterList
          filters={filters}
          selectedFilter={selectedFilter}
          onPreview={handlePreview}
          onApply={handleApply}
          isProcessing={isProcessing}
        />
        <FooterButtons onSave={saveFilteredImage} onCancel={() => navigation.goBack()} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default React.memo(FilterEditScreen);