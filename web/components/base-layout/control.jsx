import React,  { useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { noop } from '@components/thread/utils';
import { throttle } from '@common/utils/throttle-debounce.js'


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
  const [baseLayoutWhiteList, setBaseLayoutWhiteList] = useState(['home', 'search'])
  const layoutRef = useRef(null);


  useEffect(() => {
    if(hasListChild) setListRef(layoutRef?.current.listRef);
  }, [layoutRef]);


  useEffect(() => {
    if (hasListChild && listRef?.current && pageName) {
      if(jumpTo > 0) {
        baselayout[pageName] = jumpTo;
        listRef.current.jumpToScrollTop(jumpTo);
      } else if (baselayout[pageName] > 0 &&
          baseLayoutWhiteList.indexOf(pageName) !== -1) {
        listRef.current.jumpToScrollTop(baselayout[pageName]);
      }
    }
  }, [jumpTo, listRef]);


  const quickScrolling = ({ scrollTop = 0 } = {}) => {
    if (!hasListChild || !listRef?.current?.currentScrollTop) {
      onScroll();
      return;
    }
    if(baselayout.isJumpingToTop) {
      baselayout.removeJumpingToTop();
      listRef.current.onBackTop();
    } else {
      if(scrollTop && pageName) baselayout[pageName] = scrollTop;
    }
    onScroll({ scrollTop: scrollTop });
  }

  const handleScroll = quickScroll ? quickScrolling : throttle(quickScrolling, 50);

  if (site.platform === 'pc') {
    return (
      <PCBaseLayout 
        onScroll={handleScroll}
        pageName={pageName}
        {...others}
        ref={layoutRef}
      />
    );
  }

  return (
    <H5BaseLayout 
      onScroll={handleScroll}
      pageName={pageName}
      {...others}
      ref={layoutRef}
    />
  );

};

export default inject('site', 'baselayout')(observer(BaseLayoutControl));