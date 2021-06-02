import React,  { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import Header from '@components/header';
import List from '@components/list';
import BottomNavBar from '@components/bottom-nav-bar';
import { PullDownRefresh } from '@discuzq/design';
import { noop } from '@components/thread/utils';

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

const BaseLayout = forwardRef((props, ref) => {
  const {
    showHeader = true,
    showTabBar = false,
    showPullDown = false,
    children = null,
    onPullDown,
    isFinished = true,
    curr,
    onScroll = noop,
    onClickTabBar = noop,
    immediateCheck = false
  } = props;

  const [height, setHeight] = useState(600);

  const pullDownWrapper = useRef(null);
  const listRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      listRef
    }),
  );


  return (
    <div className={styles.container}>
        {showHeader && <Header />}
        {
          showPullDown ? (
            <div className={styles.list} ref={pullDownWrapper}>
              <PullDownRefresh onRefresh={onPullDown} isFinished={isFinished} height={height}>
                  <List
                    {...props}
                    className={styles.listHeight}
                    ref={listRef}
                    onScroll={onScroll}
                  >
                      {typeof(children) === 'function' ? children({ ...props }) : children}
                  </List>
              </PullDownRefresh>
            </div>
          ) : (
            <List
              {...props} // props的位置必须要在第一个，否则后面的参数可能被覆盖
              immediateCheck={immediateCheck}
              className={styles.list}
              ref={listRef}
              onScroll={onScroll}
            >
                {typeof(children) === 'function' ? children({ ...props }) : children}
            </List>
          )
        }

        {showTabBar && <BottomNavBar onClick={onClickTabBar} placeholder curr={curr} />}
    </div>
  );
});

export default BaseLayout;
