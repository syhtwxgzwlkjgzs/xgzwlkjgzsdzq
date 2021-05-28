import React, {useEffect} from 'react';
import MyContent from '../../layout/my/index';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import Page from '@components/page';

export default function index() {
  
  useEffect(() => {
    Taro.hideHomeButton();
  });

  return (
    <Page withLogin>
      <MyContent />
    </Page>
  )
}
