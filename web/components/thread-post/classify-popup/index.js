/**
 * 分类弹出层
 */
import React, { memo, useState, useEffect } from 'react'; // 性能优化的
import { Popup, Button } from '@discuzq/design'; // 原来就有的封装
import styles from './index.module.scss'; // 私有样式
import PropTypes from 'prop-types'; // 类型拦截
import typeofFn from '@common/utils/typeof';
import classNames from 'classnames';

const ClassifyPopup = (props) => {
  const { show, onVisibleChange, category = [], onChange, categorySelected } = props;
  const [visible, setVisible] = useState(false);
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [selected, setSelected] = useState({});
  const [selectedChild, setSelectedChild] = useState({});
  const { length } = category;
  const handleClose = () => {
    setVisible(false);
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
    if (show) setVisible(show);
  }, [show]);

  useEffect(() => {
    onVisibleChange(visible);
  }, [visible]);

  useEffect(() => {
    if (!category || selected.pid) return;
    const item = category[0] || [];
    setSelected(item);
  }, [length]);

  useEffect(() => {
    onChange(selected, selectedChild);
  }, [selected, selectedChild]);

  useEffect(() => {
    setChildren(selected);
  }, [selected]);

  return (
    <Popup
      className={styles.tan}
      position="bottom" // 从哪个地方弹出 'bottom' | 'top' | 'center';
      maskClosable={true} // 点击遮罩层是否关闭弹出层，但好像没什么用
      visible={visible} // 是否显示弹出层
      onClose={() => {
        // 遮罩层点击关闭回调,传一个'取消'，可自定义更改
        handleClose();
      }}
    >
      <>
        <div className="popup-title">选择分类</div>
        <div className="popup-content" key={1}>
          {(category || []).map(item => (
              <Button
                key={item.pid}
                className={classNames({
                  active:
                    ((categorySelected.parent && categorySelected.parent.pid) || selected.pid) === item.pid,
                })}
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
                className={classNames({
                  active: (categorySelected.child && categorySelected.child.pid) === item.pid,
                })}
                onClick={() => {
                  handleChildClick(item);
                }}
              >
                {item.name}
              </Button>
            ))}
          </div>
        )}
        {/* 取消按钮 */}
        <div
          className="popup-cacel"
          onClick={() => {
            handleClose();
          }}
        >
          取消
        </div>
      </>
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
