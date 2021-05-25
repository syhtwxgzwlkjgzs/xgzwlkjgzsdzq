import React, { useState, useEffect } from 'react';
import { Menu, Card } from '@discuzq/design';
import { noop } from '@components/thread/utils'
import LoadingTips from '../../../../thread/pc/components/loading-tips';
import styles from './index.module.scss';
import isServer from '../../../../../../common/utils/is-server';
import LoadingBox from '@components/loading-box';

const Index = ({ categories = [], totalThreads = 0, onNavigationClick = noop, defaultFisrtIndex = -1, defaultSecondIndex = -1 }) => {
  const [fistIndex, setFistIndex] = useState(defaultFisrtIndex);
  const [secondIndex, setSecondIndex] = useState(defaultSecondIndex);

  const onClick = (subIndex, index) => {
    let categoryIds = subIndex.split('/')
    let sequence = 0;

    // 若是点击已选中的项，则不处理「更新：暂时不需要处理这里」
    // if (fistIndex === categoryIds[0]) {
    //   if (categoryIds[1] === '-1') {
    //     return
    //   } else {
    //     if (secondIndex === categoryIds[1]) {
    //       return
    //     }
    //   }
    // }

    setFistIndex(categoryIds[0]);
    setSecondIndex(categoryIds[1]);
    if (categoryIds[1] === '-1') {
      if (categoryIds[0] !== '-1') { // 全部
        categoryIds = [categoryIds[0]]
      } else {
        categoryIds = []
      }
    }

    onNavigationClick({ categoryIds, sequence })
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
    <div>
      <span>{name}</span>
      {threadCount !== 0 && <span className={styles.span}>{name === '全部' ? totalThreads : threadCount}</span>}
    </div>
  );

  const renderSubMenuTitle = ({ name, threadCount }) => (
    <div>
      <span>{name}</span>
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
          <Menu.Item index={`${item.pid}/-1`} key={index} onClick={onClick}>{renderMenuTitle(item)}</Menu.Item>
        )))
      }
    </Menu>
  );

  return (
    <Card className={`${styles.container} ${styles.verticalScrollbar}`} style={{
      /* stylelint-disable */
      background: '#fff', overflowY: 'auto',
      maxHeight: windowSize?.innerHeight - 80
    }} bordered={false}>
      {
        categories?.length ?
          <CategoriesContent />
        :
          <LoadingBox />
      }
    </Card>
  );
};
export default React.memo(Index);
