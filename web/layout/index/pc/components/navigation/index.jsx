import React, { useState } from 'react';
import { Menu, Card } from '@discuzq/design';
import { noop }  from '@components/thread/utils'
import styles from './index.module.scss';

const Index = ({ categories = [], totalThreads = 0, onNavigationClick = noop }) => {
  const [fistIndex, setFistIndex] = useState(-1);
  const [pID, setPID] = useState(-1);
  const [secondIndex, setSecondIndex] = useState(-1);
  const onClick =(subIndex, index) => {
    let categoryIds = subIndex.split('/')
    let sequence = 0;
    setFistIndex(categoryIds[0]);
    setSecondIndex(categoryIds[1]);
    if (categoryIds[1] === '-1') {
      if (categoryIds[0] === '1') { // 默认
        sequence = 1
      }

      if (categoryIds[0] !== '') { // 全部
        categoryIds = [categoryIds[0]]
      } else {
        categoryIds = []
      }
    }

    onNavigationClick({ categoryIds, sequence })
  }

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
              <Menu.SubMenu key={index} index={`${item.pid}`}  title={renderMenuTitle(item)}>
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
    <Card className={styles.container} style={{ background: '#fff' }} bordered={false}>
      <CategoriesContent />
    </Card>
  );
};
export default React.memo(Index);
