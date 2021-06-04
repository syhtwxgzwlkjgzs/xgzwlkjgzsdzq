import React, {useEffect} from 'react';
import OtherView from '../../layout/my/other-user/index';
import Page from '@components/page';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'

export default function index() {

  return (
    <Page>
      <OtherView />
    </Page>
  )
}