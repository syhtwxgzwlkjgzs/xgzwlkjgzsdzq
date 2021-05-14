/**
 * 分类弹出层
 */
import React, { memo, useState, useEffect } from 'react'; // 性能优化的
import { Popup, Button, Icon } from '@discuzq/design'; // 原来就有的封装
import styles from './index.module.scss'; // 私有样式
import PropTypes from 'prop-types'; // 类型拦截
import typeofFn from '@common/utils/typeof';
import classNames from 'classnames';

const ClassifyPopup = (props) => {
  const { pc, show, onVisibleChange, category = [], onChange, categorySelected } = props;
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [selected, setSelected] = useState({});
  const [selectedChild, setSelectedChild] = useState({});
  const handleClose = () => {
    onVisibleChange(false);
  };
  const handleClick = (item) => {
    setSelected(item);
    if (item.children && !item.children.length) handleClose();
  };
  const handleChildClick = (item) => {
    setSelectedChild(item);
    handleClose();
  };

  const setChildren = (item) => {
    if (item.children && typeofFn.isArray(item.children.slice()) && item.children.length > 0) {
      setCategoryChildren(item.children);
      setSelectedChild(item.children[0]);
    } else {
      setCategoryChildren([]);
      setSelectedChild({});
    }
  };

  useEffect(() => {
    if (!category || (category && category.length === 0) || selected.pid) return;
    const item = category[0] || {};
    setSelected(item);
  }, [category]);

  useEffect(() => {
    if (selected.pid) return;
    if (categorySelected.parent && categorySelected.parent.pid && categorySelected.parent.pid !== selected.pid) {
      setSelected(categorySelected.parent);
    }
  }, [categorySelected]);

  useEffect(() => {
    onChange(selected, selectedChild);
  }, [selected, selectedChild]);

  useEffect(() => {
    setChildren(selected);
  }, [selected]);

  const clsWrapper = pc ? classNames(styles.pc, styles.wrapper) : styles.wrapper;

  const content = (
    <div className={clsWrapper}>
      <div className={styles['popup-title']}>
        {pc && <Icon name="MenuOutlined" size="16" />}
        选择分类
      </div>
      <div className={styles['popup-content']} key={1}>
        {(category || []).map(item => (
          item.canCreateThread
            ? <Button
              key={item.pid}
              className={classNames({
                active:
                  selected.pid === item.pid,
                'is-pc': pc,
              })}
              onClick={() => {
                handleClick(item);
              }}
            >
              {item.name}
            </Button>
            : null
        ))}
      </div>
      {categoryChildren.length > 0 && (
        <div className={classNames(styles['popup-content'], styles['popup-content__children'])}>
          {(categoryChildren || []).map(item => (
            item.canCreateThread
              ? <Button
                key={item.pid}
                className={classNames({
                  active: selectedChild.pid === item.pid,
                  'is-pc': pc,
                })}
                onClick={() => {
                  handleChildClick(item);
                }}
              >
                {item.name}
              </Button>
              : null
          ))}
        </div>
      )}
    </div>
  );

  if (pc) return content;

  return (
    <Popup
      className={styles.tan}
      position="bottom" // 从哪个地方弹出 'bottom' | 'top' | 'center';
      maskClosable={true} // 点击遮罩层是否关闭弹出层，但好像没什么用
      visible={show} // 是否显示弹出层
      onClose={() => {
        // 遮罩层点击关闭回调,传一个'取消'，可自定义更改
        handleClose();
      }}
    >
      {content}
      {/* 取消按钮 */}
      <div
        className="popup-cacel"
        onClick={() => {
          handleClose();
        }}
      >
        取消
      </div>
    </Popup>
  );
};

ClassifyPopup.propTypes = {
  show: PropTypes.bool.isRequired, // 限定visible的类型为bool,且是必传的
  category: PropTypes.array, // 分类数据
  onVisibleChange: PropTypes.func,
  onChange: PropTypes.func,
};

// 设置props默认类型
ClassifyPopup.defaultProps = {
  show: false,
  category: [],
  onVisibleChange: () => { },
  onChange: () => {},
};

export default memo(ClassifyPopup);
