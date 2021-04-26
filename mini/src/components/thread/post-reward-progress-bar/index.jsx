import React, { useMemo } from 'react';
import { Progress } from '@discuzq/design';

import styles from './index.module.scss';
import { View, Text, Image } from '@tarojs/components';

/**
 * 帖子奖励进度条
 * @prop {POST_TYPE} type 类型
 * @prop {string | number} remaining 红包帖子：剩余数量, 赏金帖子：剩余多少元
 * @prop {string | number} received 红包帖子：已领取数量 , 赏金帖子：已发放多少元
 */

const Index = ({ type = POST_TYPE.RED_PACK, remaining = 0, received = 0 }) => {
  const percent = useMemo(() => (received > 0 ? (received / (received + remaining)) * 100 : 0), [remaining, received]);
  let texts = {};
  let className = '';
  let progressTheme = '';

  if (type === POST_TYPE.RED_PACK) {
    texts = {
      remaining: (
        <>
          剩余<Text className={styles.count}>{remaining}</Text>个
        </>
      ),
      received: `已领取${received}个`,
      receive: '评论领红包',
    };
    className = styles.redPack;
    progressTheme = 'danger';
  } else if (type === POST_TYPE.BOUNTY) {
    texts = {
      remaining: (
        <>
          剩余<Text className={styles.count}>{remaining}</Text>元
        </>
      ),
      received: `已发放${received}元`,
    };
    className = styles.bounty;
    progressTheme = 'default';
  }

  return (
    <View className={`${styles.container} ${className}`}>
      <Progress
        type="circle"
        percent={percent}
        className={styles.progress}
        theme={progressTheme}
        lineWidth={12}
        isShowText={false}
      />
      <Image className={styles.icon} />
      <View className={styles.remaining}>{texts.remaining}</View>
      <View className={styles.received}>{texts.received}</View>
      {texts.receive && <View className={styles.receive}>{texts.receive}</View>}
    </View>
  );
};

export const POST_TYPE = {
  RED_PACK: Symbol('红包'),
  BOUNTY: Symbol('赏金'),
};

export default React.memo(Index);
