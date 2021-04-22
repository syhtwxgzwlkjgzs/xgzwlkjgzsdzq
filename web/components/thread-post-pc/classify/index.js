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
  category: [{ "pid": 1, "name": "官方动态11", "description": "官方动态", "icon": "", "sort": 0, "property": 0, "threadCount": 4205, "parentid": 0, "canCreateThread": true, "searchIds": 1, "children": [] }, { "pid": 30, "name": "牛奶", "description": "", "icon": "", "sort": 0, "property": 0, "threadCount": 277, "parentid": 0, "canCreateThread": true, "searchIds": [30, 31, 48], "children": [{ "pid": 31, "name": "QQ星儿童牛奶", "description": "", "icon": "", "sort": 0, "property": 0, "threadCount": 110, "parentid": 30, "canCreateThread": true, "searchIds": 31 }, { "pid": 48, "name": "test1", "description": "", "icon": "", "sort": 1, "property": 0, "threadCount": 16, "parentid": 30, "canCreateThread": true, "searchIds": 48 }] }, { "pid": 32, "name": "lala", "description": "12e", "icon": "", "sort": 0, "property": 0, "threadCount": 105, "parentid": 0, "canCreateThread": true, "searchIds": [32, 33], "children": [{ "pid": 33, "name": "天王星1号", "description": "手法", "icon": "", "sort": 1, "property": 0, "threadCount": 42, "parentid": 32, "canCreateThread": true, "searchIds": 33 }] }, { "pid": 53, "name": "测试接口", "description": "测试接口", "icon": "", "sort": 0, "property": 0, "threadCount": 74, "parentid": 0, "canCreateThread": true, "searchIds": 53, "children": [] }, { "pid": 14, "name": "地球", "description": "地球", "icon": "", "sort": 2, "property": 0, "threadCount": 276, "parentid": 0, "canCreateThread": true, "searchIds": [14, 20, 19], "children": [{ "pid": 20, "name": "小地球1", "description": "球", "icon": "", "sort": 1, "property": 0, "threadCount": 65, "parentid": 14, "canCreateThread": true, "searchIds": 20 }, { "pid": 19, "name": "地球二级分类", "description": "地球二级分类", "icon": "", "sort": 2, "property": 0, "threadCount": 79, "parentid": 14, "canCreateThread": true, "searchIds": 19 }] }, { "pid": 15, "name": "火星", "description": "火星", "icon": "", "sort": 3, "property": 0, "threadCount": 74, "parentid": 0, "canCreateThread": true, "searchIds": [15, 21], "children": [{ "pid": 21, "name": "火星二级分类", "description": "火星二级分类", "icon": "", "sort": 1, "property": 0, "threadCount": 35, "parentid": 15, "canCreateThread": true, "searchIds": 21 }] }, { "pid": 16, "name": "太阳", "description": "太阳", "icon": "", "sort": 4, "property": 0, "threadCount": 59, "parentid": 0, "canCreateThread": true, "searchIds": [16, 22, 24, 25], "children": [{ "pid": 22, "name": "小太阳1号", "description": "", "icon": "", "sort": 0, "property": 0, "threadCount": 5, "parentid": 16, "canCreateThread": true, "searchIds": 22 }, { "pid": 24, "name": "小太阳3号", "description": "", "icon": "", "sort": 0, "property": 0, "threadCount": 8, "parentid": 16, "canCreateThread": true, "searchIds": 24 }, { "pid": 25, "name": "小太阳2号", "description": "", "icon": "", "sort": 0, "property": 0, "threadCount": 2, "parentid": 16, "canCreateThread": true, "searchIds": 25 }] }, { "pid": 17, "name": "木星", "description": "木星", "icon": "", "sort": 5, "property": 0, "threadCount": 131, "parentid": 0, "canCreateThread": true, "searchIds": [17, 26], "children": [{ "pid": 26, "name": "木星1号卫星", "description": "", "icon": "", "sort": 0, "property": 0, "threadCount": 56, "parentid": 17, "canCreateThread": true, "searchIds": 26 }] }, { "pid": 18, "name": "土星", "description": "土星", "icon": "", "sort": 6, "property": 0, "threadCount": 214, "parentid": 0, "canCreateThread": true, "searchIds": [18, 27, 28, 29, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], "children": [{ "pid": 27, "name": "土星1", "description": "1", "icon": "", "sort": 0, "property": 0, "threadCount": 24, "parentid": 18, "canCreateThread": true, "searchIds": 27 }, { "pid": 28, "name": "土星2", "description": "2", "icon": "", "sort": 1, "property": 0, "threadCount": 29, "parentid": 18, "canCreateThread": true, "searchIds": 28 }, { "pid": 29, "name": "土星3", "description": "3", "icon": "", "sort": 2, "property": 0, "threadCount": 23, "parentid": 18, "canCreateThread": true, "searchIds": 29 }, { "pid": 34, "name": "土星4", "description": "", "icon": "", "sort": 3, "property": 0, "threadCount": 3, "parentid": 18, "canCreateThread": true, "searchIds": 34 }, { "pid": 35, "name": "土星5", "description": "", "icon": "", "sort": 4, "property": 0, "threadCount": 0, "parentid": 18, "canCreateThread": true, "searchIds": 35 }, { "pid": 36, "name": "土星6", "description": "", "icon": "", "sort": 5, "property": 0, "threadCount": 0, "parentid": 18, "canCreateThread": true, "searchIds": 36 }, { "pid": 37, "name": "土星7", "description": "", "icon": "", "sort": 6, "property": 0, "threadCount": 0, "parentid": 18, "canCreateThread": true, "searchIds": 37 }, { "pid": 38, "name": "土星8", "description": "", "icon": "", "sort": 7, "property": 0, "threadCount": 1, "parentid": 18, "canCreateThread": true, "searchIds": 38 }, { "pid": 39, "name": "土星9", "description": "", "icon": "", "sort": 8, "property": 0, "threadCount": 3, "parentid": 18, "canCreateThread": true, "searchIds": 39 }, { "pid": 40, "name": "土星10", "description": "", "icon": "", "sort": 9, "property": 0, "threadCount": 3, "parentid": 18, "canCreateThread": true, "searchIds": 40 }, { "pid": 41, "name": "土星11", "description": "", "icon": "", "sort": 10, "property": 0, "threadCount": 1, "parentid": 18, "canCreateThread": true, "searchIds": 41 }, { "pid": 42, "name": "土星12", "description": "", "icon": "", "sort": 11, "property": 0, "threadCount": 0, "parentid": 18, "canCreateThread": true, "searchIds": 42 }, { "pid": 43, "name": "土星13", "description": "", "icon": "", "sort": 12, "property": 0, "threadCount": 0, "parentid": 18, "canCreateThread": true, "searchIds": 43 }, { "pid": 44, "name": "土星14", "description": "", "icon": "", "sort": 13, "property": 0, "threadCount": 8, "parentid": 18, "canCreateThread": true, "searchIds": 44 }] }, { "pid": 45, "name": "文字贴", "description": "", "icon": "", "sort": 7, "property": 0, "threadCount": 93, "parentid": 0, "canCreateThread": true, "searchIds": 45, "children": [] }, { "pid": 46, "name": "长文红包帖", "description": "", "icon": "", "sort": 8, "property": 0, "threadCount": 81, "parentid": 0, "canCreateThread": true, "searchIds": 46, "children": [] }, { "pid": 47, "name": "草稿箱", "description": "", "icon": "", "sort": 9, "property": 0, "threadCount": 76, "parentid": 0, "canCreateThread": true, "searchIds": 47, "children": [] }, { "pid": 49, "name": "sun", "description": "", "icon": "", "sort": 10, "property": 0, "threadCount": 110, "parentid": 0, "canCreateThread": true, "searchIds": [49, 50], "children": [{ "pid": 50, "name": "s1", "description": "", "icon": "", "sort": 0, "property": 0, "threadCount": 50, "parentid": 49, "canCreateThread": true, "searchIds": 50 }] }],
  onChange: () => { },
};

export default memo(Classify);
