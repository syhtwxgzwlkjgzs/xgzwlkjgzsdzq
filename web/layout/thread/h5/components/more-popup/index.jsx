import React from 'react';
import { Icon, Popup, Button } from '@discuzq/design';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onSubmit, onClose, onOperClick } = props;

  return (
    <Popup position="bottom" visible={visible} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.more}>
          <div className={styles.moreItem} onClick={() => onOperClick('1')}>
            <div className={styles.icon} style={{ transform: 'rotateZ(180deg)' }}>
              <Icon name="UnderOutlined" size={20}></Icon>
            </div>
            <div className={styles.text}>置顶</div>
          </div>
          <div className={styles.moreItem} onClick={() => onOperClick('2')}>
            <div className={styles.icon}>
              <Icon name="HotOutlined" size={20}></Icon>
            </div>
            <div className={styles.text}>精华</div>
          </div>
          <div className={styles.moreItem} onClick={() => onOperClick('3')}>
            <div className={styles.icon}>
              <Icon name="DeleteOutlined" size={20}></Icon>
            </div>
            <div className={styles.text}>删除</div>
          </div>
          {/* <div className={styles.moreItem} onClick={() => onOperClick('4')}>
            <div className={styles.icon}>
              <Icon name="WarnOutlined" size={20}></Icon>
            </div>
            <div className={styles.text}>举报</div>
          </div> */}
        </div>
        <Button full={true} onClick={onSubmit} className={styles.button} type="primary" size="large">
          取消
        </Button>
      </div>
    </Popup>
  );
};

export default InputPop;
