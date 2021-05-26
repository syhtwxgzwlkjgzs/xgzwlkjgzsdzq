import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import Icon from '@discuzq/design/dist/components/icon/index';
import Popup from '@discuzq/design/dist/components/popup/index';
import Button from '@discuzq/design/dist/components/button/index';
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
      <View className={styles.container}>
        <View className={styles.more}>
          {
            canEdit && <View className={styles.moreItem} onClick={() => onOperClick('edit')}>
              <View className={styles.icon}>
                <Icon name="EditOutlined" size={20}></Icon>
              </View>
              <View className={styles.text}>编辑</View>
            </View>
          }
          {
            canStick
            && <View className={styles.moreItem} onClick={() => onOperClick('stick')}>
              <View className={styles.icon} style={{ transform: 'rotateZ(180deg)' }}>
                <Icon name="UnderOutlined" size={20}></Icon>
              </View>
              <View className={styles.text}>
                {stick ? '取消置顶' : '置顶'}
              </View>
            </View>
          }
          {
            canEssence && <View className={styles.moreItem} onClick={() => onOperClick('essence')}>
              <View className={styles.icon}>
                <Icon name="HotOutlined" size={20}></Icon>
              </View>
              <View className={styles.text}>
                {essence ? '取消精华' : '精华'}
              </View>
            </View>
          }
          {
            canDelete && <View className={styles.moreItem} onClick={() => onOperClick('delete')}>
              <View className={styles.icon}>
                <Icon name="DeleteOutlined" size={20}></Icon>
              </View>
              <View className={styles.text}>删除</View>
            </View>
          }
          <View className={styles.moreItem} onClick={() => onOperClick('report')}>
            <View className={styles.icon}>
              <Icon name="WarnOutlined" size={20}></Icon>
            </View>
            <View className={styles.text}>举报</View>
          </View>
        </View>
        <Button full onClick={onSubmit} className={styles.button} type="primary" size="large">
          取消
        </Button>
      </View>
    </Popup>
  );
};

export default InputPop;
