import React,  { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { Flex } from '@discuzq/design';
import Header from '@components/header';
import List from '@components/list';
import BottomView from '@components/list/BottomView';
import { noop } from '@components/thread/utils';

import styles from './index.module.scss';
/**
* PC端集成布局组件，支持List组件所有属性，会将props透传到List组件
* @prop {function} header 头部视图组件
* @prop {function} left 内容区域左部视图组件
* @prop {function} children 内容区域中间视图组件
* @prop {function} right 内容区域右部视图组件
* @prop {function} footer 底部视图组件
* @prop {function} onSearch 顶部 Header 搜索回调
* @prop {boolean} isShowLayoutRefresh 是否显示自定义加载视图
* @prop {boolean} requestError 是否接口请求报错
* @prop {string} errorText 报错文案
* @prop {string} rightClassName 右侧class
* @example.home-right
*     <BaseLayout
        left={<div>左边</div>}
        right={<div>右边</div>}
      >
        <div>中间</div>
      </BaseLayout>
*/

const baseLayoutWhiteList = ['home', 'search'];

const BaseLayout = forwardRef((props, ref) => {
    // UI设置相关 left-children-right 对应三列布局
    const { header = null, left = null, children = null, right = null, footer = null, rightClassName = '' } = props

    // List组件相关，参考List组件props注释
    const { noMore = false, onRefresh, onScroll = noop, immediateCheck = false } = props
  
    // Header组件相关
    const { onSearch } = props
  
    // 自定义加载视图 & 报错视图
    const { requestError = false, errorText = '', isShowLayoutRefresh = true } = props
  
    // 页面滑动位置缓存相关
    const { pageName = '' } = props

  const listRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [isErrorText, setIsErrorText] = useState('加载失败')

  const debounce = (fn, wait) => {
    let timer = null;
    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    };
  };

  useImperativeHandle(
    ref,
    () => ({
      listRef,
    }),
  );

  // 处理错误提示
  useEffect(() => {
    setIsError(requestError);
    setIsErrorText(errorText)
  }, [requestError, errorText])

  // list组件，接口请求出错回调
  const onError = (err) => {
    setIsError(true);
    setIsErrorText(err)
  };

  let cls = styles['col-1'];
  if (left || right) {
    cls = styles['col-2'];
  }
  if (left && right) {
    cls = styles['col-3'];
  }

  return (
    <div className={styles.container}>
        {(header && header({ ...props })) || <Header onSearch={onSearch} />}

        <div className={`${styles.body} ${cls}`}>
          <List {...props} immediateCheck={immediateCheck} className={styles.list} wrapperClass={styles.wrapper} ref={listRef} onError={onError} onScroll={onScroll}>
            {
              (pageName === 'home' || left) && (
                <div className={styles.left}>
                  {typeof(left) === 'function' ? left({ ...props }) : left}
                </div>
              )
            }

            <div className={styles.center}>
              {typeof(children) === 'function' ? children({ ...props }) : children}
              {isShowLayoutRefresh && onRefresh && (
                <BottomView isError={isError} errorText={isErrorText} noMore={noMore} /> 
              )}
            </div>

            {
              (pageName === 'home' || right) && (
                <div className={`${styles.right} ${rightClassName} ${(pageName === "home") ? styles["home-right"] : ""}`}>
                  {typeof(right) === 'function' ? right({ ...props }) : right}
                </div>
              )
            }
          </List>
        </div>

      {typeof(footer) === 'function' ? footer({ ...props }) : footer}
    </div>
  );
});

export default BaseLayout;
