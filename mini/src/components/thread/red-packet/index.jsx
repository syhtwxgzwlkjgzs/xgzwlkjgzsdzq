import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { noop } from '../utils';
import { View, Text, Image } from '@tarojs/components';

/**
 * 红包帖/图文帖子
 * @prop {POST_TYPE} type 类型 0：红包帖 1：图文帖子
 * @prop {string} title 图文帖标题
 * @prop {string} content 红包内容
 * @prop {string} onClick 点击事件
 */

const Index = ({ type = POST_TYPE.REDPACKET, title, content, onClick = noop }) => {
  const texts = useMemo(() => {
    if (type === POST_TYPE.REDPACKET) {
      return {
        themeContent: (
          <>
            <View className={styles.content}>
            <View className={styles.text}>{content || '暂无内容'}</View>
            </View>
          </>
        ),
        conHeight: {
          height: '103px',
        },
      };
    }
    return {
      themeContent: (
        <>
          <View className={styles.content}>
              <View className={styles.title}>{title || '图文帖子'}</View>
              <View className={styles.text}>{content || '暂无内容'}</View>
          </View>
        </>
      ),
      conHeight: {
        height: '135px',
      },
    };
  }, [type]);

  return (
    <View className={styles.container} style={texts.conHeight} onClick={onClick}>
      <View className={styles.money}>
        <View className={styles.moneyTop}></View>
        <View className={styles.moneyTBottom}>开</View>
      </View>
      {texts.themeContent}
    </View>
  );
};
export const POST_TYPE = {
  REDPACKET: 0,
  IMGTEXTTHEME: 1,
};

export default React.memo(Index);
