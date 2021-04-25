/**
 * PC-分类
 * TODO: 传入选中的分类逻辑待处理
 */
import React, { memo, useState, useEffect } from 'react'; // 性能优化的
import { Button } from '@discuzq/design'; // 原来就有的封装
import styles from './index.module.scss'; // 私有样式
import PropTypes from 'prop-types'; // 类型拦截
import typeofFn from '@common/utils/typeof';
import classNames from 'classnames';

const Classify = (props) => {
  const { category = [], onChange, categoryId } = props;
  const [categoryChildren, setCategoryChildren] = useState([]); // 二级分类渲染的数组
  const [selected, setSelected] = useState({}); // 一级分类选中的值
  const [selectedChild, setSelectedChild] = useState({}); // 二级分类选中的值
  const { length } = category;

  const handleClick = (item) => { // 一级分类点击事件
    setSelected(item);
  };
  const handleChildClick = (item) => {// 二级级分类点击事件
    setSelectedChild(item);
  };

  const setChildren = (item) => { // 当一级分类点击的时候对二级分类进行逻辑处理
    if (item.children && typeofFn.isArray(item.children.slice()) && item.children.length > 0) {
      setCategoryChildren(item.children);
      if (!categoryId) {
        setSelectedChild(item.children[0]);
      } else {
        item.children.forEach(data => {
          data == categoryId && setSelectedChild(data);
        })
      }
    } else {
      setCategoryChildren([]);
      setSelectedChild({});
    }
  };

  useEffect(() => { // 第一次分类值进来的时候默认会让第一项成为选中状态
    if (!category || selected.pid) return;
    const item = category[0] || [];
    setSelected(item);
  }, [length]);

  useEffect(() => { // 监听点击的事件回调
    onChange(selected, selectedChild);
  }, [selected, selectedChild]);

  useEffect(() => { // 监听一级分类变化
    setChildren(selected);
  }, [selected]);

  // 重显的逻辑
  useEffect(() => {
    category.forEach(item => {
      if (item.pid == categoryId) {
        setSelected(item);
      } else {
        item.children && item.children.forEach(data => {
          if (data.pid == categoryId) {
            setSelected(item);
            setSelectedChild(data)
          }
        })
      }
    });
  }, [categoryId])
  return (
    <div className={styles.tan}>
      <div className="popup-title">选择分类</div>
      <div className="popup-content" key={1}>
        {(category || []).map(item => (
          <Button
            key={item.pid}
            className={classNames({ active: selected.pid === item.pid })}
            onClick={() => {
              handleClick(item);
            }}
          >
            {item.name}
          </Button>
        ))}
      </div>
      {categoryChildren.length > 0 && (
        <div className="popup-content popup-content__children">
          {(categoryChildren || []).map(item => (
            <Button
              key={item.pid}
              className={classNames({ active: selectedChild.pid === item.pid })}
              onClick={() => {
                handleChildClick(item);
              }}
            >
              {item.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

Classify.propTypes = {
  category: PropTypes.array, // 分类数据
  onChange: PropTypes.func,
};

// 设置props默认类型
Classify.defaultProps = {
  category:[],
  onChange: () => { },
};

export default memo(Classify);
