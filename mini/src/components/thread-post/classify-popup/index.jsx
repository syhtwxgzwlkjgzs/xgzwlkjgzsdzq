/**
 * 分类弹框
 * @prop {boolean} show 输入弹框是否显示
 * @prop {array} category 输入分类列表
 * @prop {function} onHide 监听弹框切换显示隐藏
 * @prop {function} onChange 监听分类选中
 */
import React, { memo, useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { Popup, Button } from '@discuzq/design';
import styles from './index.module.scss';

import PropTypes from 'prop-types';
import typeofFn from '@common/utils/typeof';

const ClassifyPopup = (props) => {
  // props
  const { show, category, onHide, onChange } = props;
  // state
  const [parent, setParent] = useState({}); // 父类
  const [child, setChild] = useState({}); // 子类
  const [subcategory, setSubCategory] = useState([]); // 子类列表

  const handleParentClick = (item) => { // 父类点击
    setParent(item);
    if (item?.children?.length > 0) {
      return
    }
    onHide();
  };

  const handleChildClick = (item) => { // 子类点击
    setChild(item);
    onHide();
  };

  const setChildrenList = (list) => { // 设置子类列表
    if (typeofFn.isArray(list) && list.length > 0) {
      setSubCategory(list);
      setChild(list[0]);
    } else {
      setSubCategory([]);
      setChild({});
    }
  };

  // hook
  useEffect(() => { // 监听分类
    category?.length > 0 && setParent(category[0]);
  }, [category])

  useEffect(() => { // 根据当前父级，设置子级
    setChildrenList(parent?.children?.slice());
  }, [parent]);

  useEffect(() => { // 监听点击分类的操作，输出选中值
    onChange({ parent, child });
  }, [parent, child]);

  return (
    <Popup
      className={styles.wrapper}
      position="bottom"
      visible={show}
      onClose={onHide}
    >
      <View className={styles.title}>选择分类</View>
      {/* 父类 */}
      <View className={`${styles.content} ${styles['content-parent']}`}>
        {(category?.slice() || []).map(item => (
          <Button
            key={item.pid}
            className={`${parent.pid === item.pid ? styles.active : ''}`}
            onClick={() => { handleParentClick(item) }}
          >
            {item.name}
          </Button>
        ))}
      </View>
      {/* 子类 */}
      {subcategory.length > 0 && (
        <View className={`${styles.content} ${styles['content-child']}`}>
          {(subcategory || []).map(item => (
            <Button
              key={item.pid}
              className={`${child.pid === item.pid ? styles.active : ''}`}
              onClick={() => { handleChildClick(item) }}
            >
              {item.name}
            </Button>
          ))}
        </View>
      )}
      {/* 取消按钮 */}
      <View className={styles.btn} onClick={onHide}>取消</View>
    </Popup>
  );
};

ClassifyPopup.propTypes = {
  show: PropTypes.bool.isRequired,
  category: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

// 设置props默认类型
ClassifyPopup.defaultProps = {
  show: false,
  category: [],
  onHide: () => { },
  onChange: () => { },
};

export default memo(ClassifyPopup);
