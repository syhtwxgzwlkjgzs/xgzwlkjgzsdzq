import React, { useMemo } from 'react';
import styles from './index.module.scss';
import Tip from '../tip';
import { Icon } from '@discuzq/design';
import { View, Text } from '@tarojs/components';

/**
 * 帖子底部内容
 * @prop {array}    userImgs 点赞分享用户信息
 * @prop {number}    wholeNum 全部人数
 * @prop {number}    comment 评论人数
 * @prop {number}    sharing 分享人数
 * @prop {number}    onShare 分享事件
 * @prop {number}    onComment 评论事件
 * @prop {number}    onPraise 点赞事件
 */
const Index = ({
  userImgs = [],
  wholeNum = 2,
  comment = 2,
  sharing = 2,
  isLiked = false,
  isSendingLike = false,
  tipData,
  onShare = () => {},
  onComment = () => {},
  onPraise = () => {},
}) => {
  const postList = useMemo(() => {
    const praise = !isLiked ? {
      icon: 'LikeOutlined',
      name: '赞',
      event: onPraise,
    } : {
      icon: 'LikeOutlined',
      name: '取消',
      event: onPraise,
    };

    return [praise, {
      icon: 'MessageOutlined',
      name: '评论',
      event: onComment,
    },
    {
      icon: 'ShareAltOutlined',
      name: '分享',
      event: onShare,
    }];
  }, [isLiked]);
  const imgDatas = [
    {
      avatar: 'https://discuz-service-test-1258344699.cos.ap-guangzhou.myqcloud.com/public/attachments/2021/04/15/erdyAtsoiX2cNHP1tUPP9YOvE5mPBf8fTS0Oxv5y.jpg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDCJAnwjKjthEk6HBm6fwzhCLFRRBlsBxG%26q-sign-time%3D1619339184%3B1619425644%26q-key-time%3D1619339184%3B1619425644%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D596f2f6f13bb42f7f434fb7f92ffee85591c981b',
      userName: '111',
    }
  ]
  return (
    <View>
      <View className={styles.user}>
        {userImgs.length !== 0 ? <View className={styles.userImg}>
          <View className={styles.portrait}>
            <Tip tipData={tipData} imgs={imgDatas} wholeNum={wholeNum}></Tip>
          </View>
          {
            wholeNum !== 0 && (
              <View className={styles.numText}>
                {wholeNum}
              </View>
            )
          }
        </View> : <View></View>}
        <View className={styles.commentSharing}>
          {comment > 0 && <View className={styles.commentNum}>{`${comment}条评论`}</View>}
          {comment > 0 && sharing > 0 && <View className={styles.division}>·</View>}
          {sharing > 0 && <View className={styles.commentNum}>{`${sharing}次分享`}</View>}
        </View>
      </View>


      <View className={styles.operation}>
        {
          postList.map((item, index) => (
              <View key={index} className={styles.fabulous} onClick={item.event} disabled={item.name === '赞' && isSendingLike}>
                <Icon className={`${styles.icon} ${isLiked && item.name === '赞' ? styles.likedColor : styles.dislikedColor}`}  name={item.icon} size={14}></Icon>
                <Text className={item.name === '取消' ? styles.fabulousCancel : styles.fabulousPost}>{item.name}</Text>
              </View>
          ))
        }
      </View>
    </View>
  );
};
export default React.memo(Index);
