import React, { useEffect, useState } from 'react';
import { Icon, Popup, Button } from '@discuzq/design';
import { View } from '@tarojs/components';
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
      <View>
        <View className={styles.container}>
          <View className={styles.more}>
            {canEdit && (
              <View className={styles.moreItem} onClick={() => onOperClick('edit')}>
                <View className={styles.icon}>
                  <Icon name="RedactOutlined" size={20}></Icon>
                </View>
                <View className={styles.text}>编辑</View>
              </View>
            )}
            {canDelete && (
              <View className={styles.moreItem} onClick={() => onOperClick('delete')}>
                <View className={styles.icon}>
                  <Icon name="DeleteOutlined" size={20}></Icon>
                </View>
                <View className={styles.text}>删除</View>
              </View>
            )}
            {canEssence && (
              <View
                className={className(styles.moreItem, essence && styles.actived)}
                onClick={() => onOperClick('essence')}
              >
                <View className={styles.icon}>
                  <Icon name="HotBigOutlined" size={20}></Icon>
                </View>
                <View className={styles.text}>精华</View>
              </View>
            )}
            {canStick && (
              <View className={className(styles.moreItem, stick && styles.actived)} onClick={() => onOperClick('stick')}>
                <View className={styles.icon}>
                  <Icon name="TopOutlined" size={20}></Icon>
                </View>
                <View className={styles.text}>置顶</View>
              </View>
            )}
            {canCollect && (
              <View
                className={className(styles.moreItem, collect && styles.actived)}
                onClick={() => onOperClick('collect')}
              >
                <View className={styles.icon}>
                  <Icon name="CollectFunOutlined" size={20}></Icon>
                </View>
                <View className={styles.text}>收藏</View>
              </View>
            )}
            {canShare && (
              <View className={styles.moreItem} onClick={() => onOperClick('share')}>
                <View className={styles.icon}>
                  <Icon name="ShareAltOutlined" size={20}></Icon>
                </View>
                <View className={styles.text}>分享</View>
              </View>
            )}

            <View className={styles.moreItem} onClick={() => onOperClick('report')}>
              <View className={styles.icon}>
                <Icon name="WarnOutlined" size={20}></Icon>
              </View>
              <View className={styles.text}>举报</View>
            </View>
          </View>
        </View>

        <View className={styles.button}>
          <Button full={true} onClick={onSubmit} className={styles.cancel} type="default">
            取消
          </Button>
        </View>
      </View>
    </Popup>
  );
};

export default InputPop;
