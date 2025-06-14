import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import EditScreen from '../Screens/EditScreen';
import BackgroundRemoveScreen from '../Screens/BackgroundRemoveScreen';
import FilterEditScreen from '../Screens/FilterEditScreen';
import TextInputScreen from '../Screens/TextInputScreen';
import EditVideoScreen from '../Screens/EditVideoScreen';
import TrimVideoScreen from '../Screens/TrimVideoScreen';
import SpeedAdjustScreen from '../Screens/SpeedAdjustScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'Trang Chủ', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="Edit"
        component={EditScreen}
        options={{ headerTitle: 'Chỉnh Sửa Ảnh', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="BackgroundRemove"
        component={BackgroundRemoveScreen}
        options={{ headerTitle: ' Xoá Phông Nền', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="FilterEdit"
        component={FilterEditScreen}
        options={{ headerTitle: 'Bộ Lọc', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="TextInput"
        component={TextInputScreen}
        options={{ headerTitle: 'TextNote', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="EditVideo"
        component={EditVideoScreen}
        options={{ headerTitle: 'Chỉnh Sửa Video', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="TrimVideo"
        component={TrimVideoScreen}
        options={{ headerTitle: 'Cắt Video', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="SpeedAdjust"
        component={SpeedAdjustScreen}
        options={{ headerTitle: 'Tốc Độ Phát', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
}