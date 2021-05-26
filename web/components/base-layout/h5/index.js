import React,  { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import Header from '@components/header';
import List from '@components/list';
import BottomNavBar from '@components/bottom-nav-bar';
import { PullDownRefresh } from '@discuzq/design';
import { noop } from '@components/thread/utils';
import { throttle } from '@common/utils/throttle-debounce.js';

import styles from './index.module.scss';

/**
* PC端集成布局组件
* @prop {function} children 内容区域中间视图组件
* @prop {function} showHeader 是否显示头部组件
* @prop {function} showTabBar 是否显示底部tabBar组件
* @prop {function} showPullDown 是否集成下拉刷新
* @prop {function} onPullDown 下拉刷新事件
* @prop {function} isFinished 是否完成下拉刷新
* @prop other List Props // List组件所有的属性
* @example
*     <BaseLayout>
        {(props) => <div>中间</div>}
      </BaseLayout>
*/
const baseLayoutWhiteList = ['home', 'search'];

const BaseLayout = (props) => {
  const {
    showHeader = true,
    showTabBar = false,
    showPullDown = false,
    children = null,
    onPullDown,
    isFinished = true,
    curr,
    onScroll = noop,
    baselayout,
    onClickTabBar = noop,
    pageName = '',
  } = props;

  const [height, setHeight] = useState(600);

  // const debounce = (fn, wait) => {
  //   let timer = null;
  //   return () => {
  //     if(timer !== null){
  //       clearTimeout(timer);
  //     }
  //     timer = setTimeout(fn, wait);
  //   }
  // }

  // const throttle = (func, delay) => {
  //   let old = 0;
  //   return function() {
  //     const now = new Date().valueOf();
  //     if(now - old > delay) {
  //       func();
  //       old = now;
  //     }
  //   }
  // }

  const pullDownWrapper = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (pullDownWrapper?.current) {
      setHeight(pullDownWrapper.current.clientHeight);
    }

    if (listRef?.current && pageName && baselayout[pageName] > 0
        && baseLayoutWhiteList.indexOf(pageName) !== -1) {
      listRef.current.jumpToScrollTop(baselayout[pageName]);
    }
  }, []);

  const handleScroll = throttle(({ scrollTop = 0 } = {}) => {
    if (!listRef?.current?.currentScrollTop) return;

    if (baselayout.isJumpingToTop) {
      baselayout.removeJumpingToTop();
      listRef.current.onBackTop();
    }
    if (scrollTop) baselayout[pageName] = scrollTop;
    onScroll({ scrollTop });
  }, 50);

  return (
    <div className={styles.container}>
        {showHeader && <Header />}
        {
          showPullDown ? (
            <div className={styles.list} ref={pullDownWrapper}>
              <PullDownRefresh onRefresh={onPullDown} isFinished={isFinished} height={height}>
                  <List {...props} className={styles.listHeight} ref={listRef} onScroll={handleScroll}>
                      {typeof(children) === 'function' ? children({ ...props }) : children}
                  </List>
              </PullDownRefresh>
            </div>
          ) : (
            <List immediateCheck={false} className={styles.list} ref={listRef} onScroll={handleScroll} {...props}>
                {typeof(children) === 'function' ? children({ ...props }) : children}
            </List>
          )
        }

        {showTabBar && <BottomNavBar onClick={onClickTabBar} placeholder curr={curr} />}
    </div>
  );
};

export default inject('baselayout')(observer(BaseLayout));
