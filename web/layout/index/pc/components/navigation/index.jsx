import React, { useState, useEffect } from 'react';
import { Menu, Card } from '@discuzq/design';
import { noop } from '@components/thread/utils'
import styles from './index.module.scss';
import isServer from '../../../../../../common/utils/is-server';
// import LoadingBox from '@components/loading-box';
import BottomView from '@components/list/BottomView';

const Index = ({ categories = [], totalThreads = 0, onNavigationClick = noop, defaultFisrtIndex = 'all', defaultSecondIndex = 'all', isError = false, errorText }) => {
  const [fistIndex, setFistIndex] = useState(defaultFisrtIndex);
  const [secondIndex, setSecondIndex] = useState(defaultSecondIndex);

  useEffect(() => {
    setFistIndex(defaultFisrtIndex)
    setSecondIndex(defaultSecondIndex)
  }, [defaultFisrtIndex, defaultSecondIndex])

  const onClick = (subIndex, index) => {
    let categoryIds = subIndex.split('/')

    setFistIndex(categoryIds[0]);
    setSecondIndex(categoryIds[1]);
    if (categoryIds[1] === 'all') {
      categoryIds = [categoryIds[0]]
    } else {
      categoryIds = [categoryIds[1]]
    }

    onNavigationClick({ categoryIds })
  }
  const debounce = (fn, wait) => {
    let timer = null;
    return () => {
      if(timer !== null){
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    }
  }
  // 监听浏览器窗口变化
  const getWindowSize = () => {
    if (!isServer()) {
      return {
        innerHeight: !isServer() ? window.innerHeight : null,
        innerWidth: !isServer() ? window.innerWidth : null,
      }
    }
  };
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const handleResize = debounce(() => {
    setWindowSize(getWindowSize());
  }, 50);
  useEffect(() => {
    if (!isServer()) // 监听
      window.addEventListener("resize", handleResize);
    // 销毁
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const renderMenuTitle = ({ name, threadCount }) => (
    <div className={styles.subMenuBox}>
      <span className={styles.ellipsis}>{name}</span>
      {threadCount !== 0 && <span className={styles.span}>{name === '全部' ? totalThreads : threadCount}</span>}
    </div>
  );

  const renderSubMenuTitle = ({ name, threadCount }) => (
    <div>
      <span className={styles.ellipsis}>{name}</span>
      {threadCount !== 0 && <span className={styles.subSpan}>{threadCount}</span>}
    </div>
  );

  const CategoriesContent = () => (
    <Menu defaultOpeneds={[`${fistIndex}`]} defaultSubmenuActives={[`${fistIndex}`]} defaultActives={[`${fistIndex}/${secondIndex}`]}>
      {
        categories?.map((item, index) => (item?.children?.length > 0 ? (
          <Menu.SubMenu key={index} index={`${item.pid}`} title={renderMenuTitle(item)}>
            {item.children.map((child, subIndex) => (
              <Menu.Item index={`${item.pid}/${child.pid}`} key={subIndex} onClick={onClick}>{renderSubMenuTitle(child)}</Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item index={`${item.pid}/all`} key={index} onClick={onClick}>{renderMenuTitle(item)}</Menu.Item>
        )))
      }
    </Menu>
  );

  return (
    <Card className={`${styles.container} ${styles.verticalScrollbar}`} style={{
      /* stylelint-disable */
      background: '#fff', overflowY: 'auto',
      maxHeight: (windowSize?.innerHeight - 95) || '600px'
    }} bordered={false}>
      {
        categories?.length ?
          <CategoriesContent />
          :
          <BottomView isBox isError={isError} errorText='暂无数据' noMore={false} loadingText='正在加载' />
      }
    </Card>
  );
};
export default React.memo(Index);