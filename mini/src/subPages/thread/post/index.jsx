import React, { useState, useCallback } from 'react';
import Taro, { useDidShow, useDidHide } from '@tarojs/taro';
import ThreadPost from '@layout/thread/post';
import Page from '@components/page';

const Index = () => {
  const [bottomHeight, setBottomHeight] = useState(0); // 手机软键盘弹起高度

  // 滚动页面到指定视图位置
  const pageScrollTo = useCallback(({ selector = null, scrollTop = 0, duration = 500 } = {}) => {
    if (selector) {
      Taro.createSelectorQuery()
        .selectViewport()
        .scrollOffset()
        .select(selector)
        .boundingClientRect()
        .exec((res) => {
          if (!res[1]) return;
          const top = res[0].scrollTop + res[1]?.top - 100;
          setTimeout(() => {
            Taro.pageScrollTo({ scrollTop: top, duration });
          }, 0);
        })
    } else {
      setTimeout(() => {
        Taro.pageScrollTo({ scrollTop, duration });
      }, 0);
    }
  }, [])

  useDidShow(() => {
    // 监听键盘高度变化
    Taro.onKeyboardHeightChange(res => {
      setBottomHeight(res?.height || 0);
    });

    setBottomHeight(0);
  })

  useDidHide(() => {
    Taro.offKeyboardHeightChange(() => { });
  })

  return (
    <Page withLogin>
      <ThreadPost bottomHeight={bottomHeight} pageScrollTo={pageScrollTo} />
    </Page>
  )
};

export default Index;
