import React, { useState } from 'react';
import styles from './index.module.scss';
import { Menu } from '@discuzq/design';
import filterData from './data';
/**
 * 顶部选择菜单
 * @prop {object} data 筛选数据
 * @prop {number} filterIndex 筛选选中项index
 */
const Index = (props) => {
  const {
    data = filterData
  } = props;
  const title = (name = '导航') => {
    return <span>{name}</span>;
  }
  // 选中项index
  const [filterIndex, setFilterIndex] = useState('0');
  return (
    <div className={styles.container}>
      {/* 菜单 */}
      <Menu mode="horizontal" menuTrigger="click">
        {
          data?.map((item, index) => {
            return (
              item.children ? (
                <Menu.SubMenu key={index} index={index} title={title(item.label)} style={{padding: '3px 0'}}>
                  {
                    item.children.map((secondItem, secondIndex) => { 
                      return (<Menu.Item divided={secondItem.divided} key={secondIndex} index={secondIndex} style={{padding: '10px 20px'}}>{secondItem.label}</Menu.Item>)
                    })
                  }
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={index} index={index} style={{padding: '0 16px'}}>
                  {item.label}
                  {
                    filterIndex === index && (<div className={styles.line}></div>)
                  }
                </Menu.Item>
              )
            )
          })
        }
      </Menu>
    </div>
  );
};

export default React.memo(Index);
