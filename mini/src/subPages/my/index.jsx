import React, {useEffect} from 'react';
import MyContent from '../../layout/my/index';
import Page from '@components/page';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'

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
