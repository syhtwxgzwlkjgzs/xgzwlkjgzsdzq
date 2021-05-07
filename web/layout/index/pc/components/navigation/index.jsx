import React, { useState } from 'react';
import { Menu, Card } from '@discuzq/design';
import { noop }  from '@components/thread/utils'
import styles from './index.module.scss';

const Index = ({ categories = [], totalThreads = 0, onNavigationClick = noop }) => {
  const [fistIndex, setFistIndex] = useState(-1);
  const [pID, setPID] = useState(-1);
  const [secondIndex, setSecondIndex] = useState(-1);
  const onClick =(subIndex, index) => {
    if (`${subIndex}`.indexOf('-') !== -1) {
      const categoryIds = subIndex.split('-')
      setFistIndex(-1);
      setPID(Number(categoryIds[0]));
      setSecondIndex(Number(categoryIds[1]));
      onNavigationClick({ categoryIds, sequence: 0 })
    } else {
      setPID(-1);
      setSecondIndex(-1);
      setFistIndex(subIndex)
      let categoryIds = ['']
      let sequence = 0
      if (subIndex !== 0) {
        categoryIds = [subIndex]
      }
      if (subIndex === 1) {
        sequence = 1
      }
      onNavigationClick({ categoryIds, sequence })
    }
  }

  const renderSubMenuTitle = ({ name, threadCount }) => (
    <div>
      <span>{name}</span>
      {threadCount !== 0 && <span style={{ cssFloat: 'right' }}>{name === '全部' ? totalThreads : threadCount}</span>}
    </div>
  );

  const CategoriesContent = () => (
      <Menu>
        {
          categories?.map((item, index) => (item?.children?.length > 0 ? (
              <Menu.SubMenu key={index} index={item.pid} className={styles.activeItem} title={renderSubMenuTitle(item)}>
                {item.children.map((children, subIndex) => (
                    <Menu.Item index={`${item.pid}-${subIndex}`} key={subIndex} onClick={onClick} className={pID === item.pid && secondIndex === subIndex && styles.activeItem}>{children.name}</Menu.Item>
                ))}
              </Menu.SubMenu>
          ) : (
              <Menu.Item index={index} key={index} onClick={onClick} className={fistIndex === index && styles.active}>{renderSubMenuTitle(item)}</Menu.Item>
          )))
        }
      </Menu>
  );

  return (
    <Card style={{ background: '#fff' }} bordered={false}>
      <CategoriesContent />
    </Card>
  );
};
export default React.memo(Index);
