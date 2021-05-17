import React, { useEffect, useState } from 'react';
import { Icon, Popup, Button } from '@discuzq/design';
import styles from './index.module.scss';
import className from 'classnames';

const InputPop = (props) => {
  const { visible, onSubmit, onClose, onOperClick, permissions = {}, statuses = {} } = props;

  const { canEdit, canDelete, canEssence, canStick, canShare, canCollect } = permissions;
  const { isEssence, isStick, isCollect } = statuses;

  const [essence, setEssence] = useState(isEssence);
  const [stick, setStick] = useState(isStick);
  const [collect, setCollect] = useState(isCollect);

  useEffect(() => {
    setEssence(isEssence);
  }, [isEssence]);

  useEffect(() => {
    setStick(isStick);
  }, [isStick]);

  useEffect(() => {
    setCollect(isCollect);
  }, [isCollect]);

  return (
    <Popup position="bottom" visible={visible} onClose={onClose}>
      <div>
        <div className={styles.container}>
          <div className={styles.more}>
            {canEdit && (
              <div className={styles.moreItem} onClick={() => onOperClick('edit')}>
                <div className={styles.icon}>
                  <Icon name="RedactOutlined" size={20}></Icon>
                </div>
                <div className={styles.text}>编辑</div>
              </div>
            )}
            {canDelete && (
              <div className={styles.moreItem} onClick={() => onOperClick('delete')}>
                <div className={styles.icon}>
                  <Icon name="DeleteOutlined" size={20}></Icon>
                </div>
                <div className={styles.text}>删除</div>
              </div>
            )}
            {canEssence && (
              <div
                className={className(styles.moreItem, essence && styles.actived)}
                onClick={() => onOperClick('essence')}
              >
                <div className={styles.icon}>
                  <Icon name="HotBigOutlined" size={20}></Icon>
                </div>
                <div className={styles.text}>精华</div>
              </div>
            )}
            {canStick && (
              <div className={className(styles.moreItem, stick && styles.actived)} onClick={() => onOperClick('stick')}>
                <div className={styles.icon}>
                  <Icon name="TopOutlined" size={20}></Icon>
                </div>
                <div className={styles.text}>置顶</div>
              </div>
            )}
            {canCollect && (
              <div
                className={className(styles.moreItem, collect && styles.actived)}
                onClick={() => onOperClick('collect')}
              >
                <div className={styles.icon}>
                  <Icon name="CollectFunOutlined" size={20}></Icon>
                </div>
                <div className={styles.text}>收藏</div>
              </div>
            )}
            {canShare && (
              <div className={styles.moreItem} onClick={() => onOperClick('share')}>
                <div className={styles.icon}>
                  <Icon name="ShareAltOutlined" size={20}></Icon>
                </div>
                <div className={styles.text}>分享</div>
              </div>
            )}

            <div className={styles.moreItem} onClick={() => onOperClick('report')}>
              <div className={styles.icon}>
                <Icon name="WarnOutlined" size={20}></Icon>
              </div>
              <div className={styles.text}>举报</div>
            </div>
          </div>
        </div>

        <div className={styles.button}>
          <Button full={true} onClick={onSubmit} className={styles.cancel} type="default">
            取消
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default InputPop;
