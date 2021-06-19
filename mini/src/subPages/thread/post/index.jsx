import React, { useState } from 'react';
import Taro, { useDidShow, useDidHide } from '@tarojs/taro';
import ThreadPost from '@layout/thread/post';
import Page from '@components/page';

const Index = () => {
  const [bottomHeight, setBottomHeight] = useState(0); // 手机软键盘弹起高度

  useDidShow(() => {
    // 监听键盘高度变化
    Taro.onKeyboardHeightChange(res => {
      setBottomHeight(res?.height || 0);
    });
  })

  useDidHide(() => {
    Taro.offKeyboardHeightChange(() => { });
  })

  return (
    <Page withLogin>
      <ThreadPost bottomHeight={bottomHeight} />
    </Page>
  )
};

export default Index;
