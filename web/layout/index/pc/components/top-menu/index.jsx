import React from 'react';
import styles from './index.module.scss';
import { Menu } from '@discuzq/design';
import filterData from './data';
/**
 * 顶部菜单
 * @prop {number} showSort 是否只能排序
 */
const NewContent = (showSort = false) => {
  const title = (name = '导航') => {
    return <span>{name}</span>;
  }
  return (
    <div className={styles.container}>
      {/* 菜单 */}
      <Menu mode="horizontal" menuTrigger="click" className='filterMenu'>
        {
          filterData.map((item, index) => {
            return (
              item.children ?
                <Menu.SubMenu key={index} index={index} title={title(item.label)} style={{padding: '3px 0'}}>
                  {
                    item.children.map((secondItem, secondIndex) => { 
                      return (<Menu.Item divided={secondItem.divided} key={secondIndex} index={secondIndex} style={{padding: '10px 20px'}}>{secondItem.label}</Menu.Item>)
                    })
                  }
                </Menu.SubMenu>
              : <Menu.Item key={index} index={index} style={{padding: '0 16px'}} className='filterItem'>{item.label}</Menu.Item>
            )
          })
        }
      </Menu>
    </div>
  );
};

export default NewContent;
