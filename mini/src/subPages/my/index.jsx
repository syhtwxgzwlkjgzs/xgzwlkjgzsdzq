import React, {useEffect} from 'react';
import MyContent from '../../layout/my/index';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'

export default function index() {
  
  useEffect(() => {
    Taro.hideHomeButton();
  });

  return (
    <View>
      <MyContent />
    </View>
  )
}
