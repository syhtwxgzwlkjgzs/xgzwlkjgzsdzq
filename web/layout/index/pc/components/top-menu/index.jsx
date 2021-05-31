import React, { useState } from 'react';
import styles from './index.module.scss';
import { Menu } from '@discuzq/design';
import { noop } from '@components/thread/utils'
import filterData from './data';
import deepClone from '@common/utils/deep-clone';
import data from '../../../../search/pc/components/stepper/data';
/**
 * 顶部选择菜单
 * @prop {object} data 筛选数据
 * @prop {number} filterIndex 筛选选中项index
 */
const orgFilter = {
  
}
const Index = ({ onSubmit = noop, isShowDefault = false }) => {

  const title = (name = '导航') => <span>{name}</span>;
  // 选中项index
  const newFilterData = filterData.slice();
  if ( isShowDefault ) {
    newFilterData.splice(1, 0, {
      label: '默认', // 默认智能排序
      type: 'sequence',
      isActive: false,
    });
  }
  
  const [dataSource, setDataSource] = useState(deepClone(newFilterData));

  // 点击筛选项，获取目标值
  const onClick = (subIndex, index) => {
    const newDataSource = deepClone(newFilterData);

    // 清除「所有」选项选中状态
    newDataSource[0].isActive = false

    if (`${index}` !== '-1' && `${subIndex}`.indexOf('/') !== -1) { // 点击二级菜单
      // 获取二级菜单的下标
      const i = parseInt(subIndex.split('/')[1])
      // 若当前二级菜单不是选中状态，先清空之前操作，再赋值
      const subIndexItems = newDataSource[index]?.children.map(item => {
        item.isActive = false
        return item
      })
      subIndexItems[i].isActive = true;

      const indexItem = newDataSource[index];
      indexItem.isActive = true;
    } else if (`${index}` === '-1') { // 点击一级菜单
        // 若当前一级菜单不是选中状态，先清空之前操作，再赋值
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

  // 根据isActive为true的选项，组装参数
  const handleResult = (data) => {
    const result = {
      sequence: 0,
      filter: {
        sort: 1,
        attention: 0,
        types: [],
        essence: 0
      }
    }
    data.forEach(item => {
      if (item.type === 'sequence') {
        result['sequence'] = item.isActive ? '1' : '0'
      } else if (item.children?.length) {
        item.children.forEach(sub => {
          if (sub.isActive && sub.value) {
            if (item.type === 'types' && sub.value) {
              result.filter[item.type] = [sub.value]
            } else {
              result.filter[item.type] = sub.value
            }
          }
        })
      } else if (item.type !== 'all') {
        result.filter[item.type] = item.isActive ? '1' : '0'
      }
    })
    return result
  }

  return (
    <div className={styles.container}>
      {/* 菜单 */}
      <Menu mode="horizontal" menuTrigger="hover" defaultActives={['0']}>
        {
          dataSource?.map((item, index) => (
            item.children ? (
                <Menu.SubMenu 
                  key={index} 
                  index={index} 
                  title={title(item.label)} 
                  style={{ padding: '3px 0' }}
                >
                  {
                    item.children.map((secondItem, secondIndex) => {
                      return (
                        <Menu.Item
                          divided
                          key={`${index}/${secondIndex}`}
                          index={`${index}/${secondIndex}`}
                          style={{ padding: '10px 20px' }}
                          onClick={onClick}
                        >
                          {secondItem.label}
                        </Menu.Item>
                    )})
                  }
                </Menu.SubMenu>
            ) : (
                <Menu.Item onClick={onClick} key={index} index={`${index}`} style={{ padding: '0 16px' }}>
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
