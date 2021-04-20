import React from 'react';
import styles from './index.module.scss';
import { Icon, Button } from '@discuzq/design';

/**
 * 筛选模块-选项部分
 * @prop {string} title 选项标题
 * @prop {object} optionData 选项数据
 * @prop {object} secondData 二级分类数据
 * @prop {object} firstLevelClick 一级分类点击事件
 * @prop {object} secondLevelClick 二级分类点击事件
 * @prop {number} isSecondLevelActive 二级分类选中index
 */

const Index = ({
  title, 
  optionData = [],
  secondData = [],
  firstLevelClick = () => {},
  secondLevelClick = () => {},
  isSecondLevelActive = 0
}) => {
  return (
  <div className={styles.section}>
    <div className={styles.title}>{title}</div>
    {/* 一级分类 */}
    <ul className={`${styles.itemWrap} ${styles.itemDetail}`}>
      {
        optionData.map((item, index) => {
          return <li className={!item.selected ? '' : styles.active } key={index}
          onClick={firstLevelClick}>{item.label}</li>
        })
      }
    </ul>
    <ul className={`${styles.itemWrap} ${styles.secondLevel}`}>
      {
        secondData.map((item, index) => {
          return <li className={isSecondLevelActive == index ? styles.active : null } key={index} onClick={secondLevelClick}>{item.label}</li>
        })
      }
    </ul>
  </div>
  )
}

export default React.memo(Index) 