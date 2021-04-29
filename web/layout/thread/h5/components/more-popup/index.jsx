import React, { useEffect, useState } from 'react';
import { Icon, Popup, Button } from '@discuzq/design';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onSubmit, onClose, onOperClick, permissions = {}, statuses = {} } = props;

  const { canEdit, canDelete, canEssence, canStick } = permissions;
  const { isEssence, isStick } = statuses;

  const [essence, setEssence] = useState(isEssence);
  const [stick, setStick] = useState(isStick);

  useEffect(() => {
    setEssence(isEssence);
  }, [isEssence]);

  useEffect(() => {
    setStick(isStick);
  }, [isStick]);

  return (
    <Popup position="bottom" visible={visible} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.more}>
          {
            canEdit && <div className={styles.moreItem} onClick={() => onOperClick('edit')}>
              <div className={styles.icon}>
                <Icon name="EditOutlined" size={20}></Icon>
              </div>
              <div className={styles.text}>编辑</div>
            </div>
          }
          {
            canStick
            && <div className={styles.moreItem} onClick={() => onOperClick('stick')}>
              <div className={styles.icon} style={{ transform: 'rotateZ(180deg)' }}>
                <Icon name="UnderOutlined" size={20}></Icon>
              </div>
              <div className={styles.text}>
                {stick ? '取消置顶' : '置顶'}
              </div>
            </div>
          }
          {
            canEssence && <div className={styles.moreItem} onClick={() => onOperClick('essence')}>
              <div className={styles.icon}>
                <Icon name="HotOutlined" size={20}></Icon>
              </div>
              <div className={styles.text}>
                {essence ? '取消精华' : '精华'}
              </div>
            </div>
          }
          {
            canDelete && <div className={styles.moreItem} onClick={() => onOperClick('delete')}>
              <div className={styles.icon}>
                <Icon name="DeleteOutlined" size={20}></Icon>
              </div>
              <div className={styles.text}>删除</div>
            </div>
          }
          <div className={styles.moreItem} onClick={() => onOperClick('report')}>
            <div className={styles.icon}>
              <Icon name="WarnOutlined" size={20}></Icon>
            </div>
            <div className={styles.text}>举报</div>
          </div>
        </div>
        <Button full={true} onClick={onSubmit} className={styles.button} type="primary" size="large">
          取消
        </Button>
      </div>
    </Popup>
  );
};

export default InputPop;
