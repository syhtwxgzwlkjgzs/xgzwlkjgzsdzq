import React, { useState } from 'react';
import styles from './index.module.scss';
import { Menu } from '@discuzq/design';
import { noop } from '@components/thread/utils'
import filterData from './data';
/**
 * 顶部选择菜单
 * @prop {object} data 筛选数据
 * @prop {number} filterIndex 筛选选中项index
 */
const Index = ({ onSubmit = noop }) => {
  const title = (name = '导航') => <span>{name}</span>;
  // 选中项index
  const newFilterData = filterData.slice();
  const [dataSource, setDataSource] = useState(newFilterData);

  // 点击筛选项，获取目标值
  const onClick = (subIndex, index) => {
    const newDataSource = dataSource.slice();
    if (`${index}` !== '-1' && `${subIndex}`.indexOf('-') !== -1) {
      const i = parseInt(subIndex.split('-')[1])
      const subIndexItems = newDataSource[index]?.children.map(item => {
        item.isActive = false
        return item
      })
      subIndexItems[i].isActive = true;

      const indexItem = newDataSource[index];
      indexItem.isActive = true;
    } else if (`${index}` === '-1') {
      
      const indexItems = newDataSource.map(item => {
        if (!item.children?.length) {
          item.isActive = false
        }
        return item
      })
      indexItems[subIndex].isActive = true;
    }
    const result = handleResult(newDataSource)
    onSubmit(result)
    setDataSource(newDataSource);
  };

  const handleResult = (data) => {
    const result = {
      filter: {}
    }
    data.forEach(item => {
      if (item.value === 'sequence') {
        result['sequence'] = item.isActive ? '1' : '0'
      } else if (item.children?.length) {
        item.children.forEach(sub => {
          if (sub.isActive && sub.value) {
            result.filter[item.type] = sub.value
          }
        })
      } else if (item.value !== 'all') {
        result[item.type] = item.isActive ? '1' : '0'
      }
    })
    return result
  }

  return (
    <div className={styles.container}>
      {/* 菜单 */}
      <Menu mode="horizontal" menuTrigger="hover">
        {
          dataSource?.map((item, index) => (
            item.children ? (
                <Menu.SubMenu 
                  key={index} 
                  index={index} 
                  title={title(item.label)} 
                  className={item.isActive && styles.activeItem}
                  style={{ padding: '3px 0' }}
                >
                  {
                    item.children.map((secondItem, secondIndex) => {
                      return (
                        <Menu.Item
                          className={secondItem.isActive && styles.activeItem}
                          divided
                          key={`${index}-${secondIndex}`}
                          index={`${index}-${secondIndex}`}
                          style={{ padding: '10px 20px' }}
                          onClick={onClick}
                        >
                          {secondItem.label}
                        </Menu.Item>
                    )})
                  }
                </Menu.SubMenu>
            ) : (
                <Menu.Item className={item.isActive && styles.activeItem} onClick={onClick} key={index} index={index} style={{ padding: '0 16px' }}>
                  {item.label}
                  { item.isActive && <div className={styles.line}></div> }
                </Menu.Item>
            )
          ))
        }
      </Menu>
    </div>
  );
};

export default React.memo(Index);
