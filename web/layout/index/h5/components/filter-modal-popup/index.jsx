import React, { useState } from 'react';
import styles from './index.module.scss';
import { Icon, Button, Popup } from '@discuzq/design';
import FilterModalSection from '@components/thread/filter-modal-section';

/**
 * 筛选分类组件
 * @prop {boolean} visible 是否显示筛选弹框
 * @prop {object} filterData 选项数据
 * @prop {object} categoriesData 分类数据
 * @prop {boolean} ifShowConfirm 是否显示确认按钮
 * @prop {boolean} ifShowSearch 是否显示搜索
 * @prop {boolean} ifShowCancel 是否显示取消按钮
 * @prop {string} confirmText 确认按钮文本
 * @prop {string} cancelText 取消按钮文本
 * @prop {number} isSecondLevelActive 二级分类选中index
 * @prop {function} firstLevelClick 一级分类点击事件
 * @prop {function} secondLevelClick 二级分类点击事件
 * @prop {function} onSearch 搜索点击事件 
 * @prop {function} onClose 关闭搜索弹框
 */
const FilterModalPopup = (props) => {
  const {
    visible = false,
    filterData = [],
    categoriesData = [],
    ifShowConfirm = true,
    ifShowSearch = true,
    ifShowCancel = true,
    confirmText,
    cancelText,
    isSecondLevelActive = 0,
    firstLevelClick = () => {},
    secondLevelClick  = ()=> {},
    onSearch = () => {},
    onClose  = ()=> {},
  } = props;
  return (
    <Popup
      position="top"
      visible={visible}
      onClose={onClose}
    >
      <div className={styles.container}>
        {
          ifShowSearch ?
            <div className={styles.search}>
              <Icon name="SearchOutlined" color="#8490A8" size={20} />
            </div>
          : ''
        }
        <div className={styles.content}>
          {
            filterData.map((item, index) => {
                return <FilterModalSection key={index} title={item.title} optionData={item.data} firstLevelClick={firstLevelClick} secondLevelClick={secondLevelClick} isSecondLevelActive={isSecondLevelActive}></FilterModalSection>
            })
          }
        </div>
        {
          ifShowConfirm || ifShowCancel ?
            (<div className={styles.footer}>
              {
                ifShowConfirm ?
                  <Button className={styles.confirmBtn} type="primary" onClick={onSearch}>{confirmText || '筛选'}</Button>
                  : ''
              }
              {
                ifShowCancel ?
                  <div className={styles.cancelBtn} onClick={onClose}>
                    {cancelText || '取消'}
                  </div>
                : ''
              }
            </div>)
            : ''
        }
      </div>
    </Popup>);
};

export default FilterModalPopup;
