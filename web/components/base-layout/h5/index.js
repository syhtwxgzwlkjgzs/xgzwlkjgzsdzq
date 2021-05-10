import React,  { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from '@components/header';
import List from '@components/list'
import { PullDownRefresh } from "@discuzq/design"

import styles from './index.module.scss';

/**
* PC端集成布局组件
* @prop {function} header 头部视图组件
* @prop {function} children 内容区域中间视图组件
* @prop other List Props // List组件所有的属性
* @example 
*     <BaseLayout
        left={(props) => <div>左边</div>}
        right={(props) => <div>右边</div>}
      >
        {(props) => <div>中间</div>}
      </BaseLayout>
*/

const BaseLayout = (props) => {
  const { showHeader = true, showTabBar = false, showPullDown = false, children = null, onPullDown, onRefresh } = props;

  const debounce = (fn, wait) => {
    let timer = null;
    return () => {
      if(timer !== null){
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    }
  }


  return (
    <div className={styles.container}>
        {showHeader && <Header />}

        <List {...props} className={styles.list}>
            {typeof(children) === 'function' ? children({ ...props }) : children}
        </List>

        {showTabBar && <div></div>}
    </div>
  );
};

export default BaseLayout;