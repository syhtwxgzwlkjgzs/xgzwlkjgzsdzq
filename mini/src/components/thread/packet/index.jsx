import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { View, Text, Image } from '@tarojs/components'
import redPacketImg from '../../../../../web/public/dzq-img/red-packet.png';
import rewardQuestion from '../../../../../web/public/dzq-img/reward-question.png'

/**
 * 帖子红包、悬赏视图
 * @prop {string}  type 判断是红包还是悬赏
 * @prop {string}  condition 判断是集赞领红包还是评论领红包
 */
const Index = ({ money = 0, type = 0, onClick, condition = 0 }) => {

  const title = useMemo(() => {
    if (type === 0) {
      return condition === 0 ? '回复领红包' : '集赞领红包'
    } else {
      return '评论领赏金'
    }
  }, [type])

  const url = useMemo(() => {
    return type === 0 ? redPacketImg : rewardQuestion;
  }, [type])

  // 格式化金额，保留两位小数，且去除小数点后面的0
  const formatMoney = useMemo(() => {
    const num = Number(money)
    if (!num) {
      return money
    }

    const newNum = num.toFixed(2)
    const regexp=/(?:\.0*|(\.\d+?)0+)$/
    return newNum.replace(regexp,'$1')
  }, [money])

  return (
    <View className={styles.container} onClick={onClick}>
      <View className={styles.wrapper}>
        <Image className={styles.img} src={url} />
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.money}>￥{formatMoney}</Text>
      </View>
    </View>
  );
}

export default React.memo(Index)

