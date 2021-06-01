import React, { useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { noop } from '@components/thread/utils';
import { throttle } from '@common/utils/throttle-debounce.js';


import H5BaseLayout from './h5';
import PCBaseLayout from './pc';

/**
* 集成布局交互逻辑控制，用于控制音视频播放、jump等有关scroll的布局操作
* @prop {function} onScroll 触发滚动函数
* @prop {boolean} quickScroll 是否加throttle给handleScroll
* @prop {boolean} hasListChild 页面是否有List组件
* @prop {boolean} jumpTo 跳转到List组件什么位置
* @prop {string} pageName 'home'是主页, 'search'是搜索页，用于记录当前页面阅读位置
* @prop {function} 
* @example 
*     <BaseLayout>
        <BaseLayoutControl>
        </BaseLayoutControl>
      </BaseLayout>
*/

const BaseLayoutControl = (props) => {
  const {
    site,
    baselayout = {},
    onScroll = noop,
    quickScroll = false,
    hasListChild = true,
    jumpTo = -1,
    pageName = '',
    ...others
  } = props;

  const [listRef, setListRef] = useState(null);
  const [baseLayoutWhiteList, setBaseLayoutWhiteList] = useState(['home', 'search']);
  const [videoList, setVideoList] = useState([]);
  const [playingIdx, setPlayingIdx] = useState(0);
  const layoutRef = useRef(null);

  useEffect(() => {
    if (hasListChild) setListRef(layoutRef?.current.listRef);
  }, [layoutRef]);

  useEffect(() => {
    if (hasListChild && listRef?.current && pageName) {
      if (jumpTo > 0) {
        baselayout[pageName] = jumpTo;
        listRef.current.jumpToScrollTop(jumpTo);
      } else if (baselayout[pageName] > 0 && baseLayoutWhiteList.indexOf(pageName) !== -1) {
        listRef.current.jumpToScrollTop(baselayout[pageName]);
      }
    }
  }, [jumpTo, listRef, baselayout]);


  const quickScrolling = ({ scrollTop = 0 } = {}) => {
    if (!hasListChild || !listRef?.current?.currentScrollTop) {
      onScroll();
      return;
    }
    if (baselayout.isJumpingToTop) {
      baselayout.removeJumpingToTop();
      listRef.current.onBackTop();
    } else {
      if (scrollTop && pageName) baselayout[pageName] = scrollTop;
    }

    const playingVideoDom = baselayout.playingVideoDom;
    const playingVideoPos = baselayout.playingVideoPos;
    
    if (playingVideoPos > 0 && (playingVideoPos < scrollTop ||
      playingVideoPos > window.screen.availHeight + scrollTop)) {
      playingVideoDom?.querySelector("video").pause();
      baselayout.playingVideoDom = null;
      baselayout.playingVideoPos = -1;
    }

    const playingAudioDom = baselayout.playingAudioDom;
    const playingAudioPos = baselayout.playingAudioPos;
    if (playingAudioPos > 0 && (playingAudioPos < scrollTop ||
      playingAudioPos > window.screen.availHeight + scrollTop)) {
      playingAudioDom?.querySelector("video").pause();
      baselayout.playingAudioDom = null;
      baselayout.playingAudioPos = -1;
    }
    

    onScroll({ scrollTop: scrollTop });
  };

  const handleScroll = quickScroll ? quickScrolling : throttle(quickScrolling, 50);

  if (site.platform === 'pc') {
    return <PCBaseLayout onScroll={handleScroll} pageName={pageName} {...others} ref={layoutRef} />;
  }

  return <H5BaseLayout onScroll={handleScroll} pageName={pageName} {...others} ref={layoutRef} />;
};

export default inject('site', 'baselayout')(observer(BaseLayoutControl));
