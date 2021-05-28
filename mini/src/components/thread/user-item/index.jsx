import React, { useContext } from 'react';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Avatar from '../../avatar';
import { noop } from '../utils';
import styles from './index.module.scss';
import { ThreadCommonContext } from '../utils'
import { View, Text } from '@tarojs/components'

/**
 * 用户信息视图
 * @prop {string}  imgSrc 用户头像
 * @prop {string}  title 用户名字
 * @prop {number}  type 免费还是付费用户
 * @prop {string}  subTitle 额外信息
 * @prop {string}  icon 用户头像右下角图标
 * @prop {string}  label 额外信息
 * @prop {string}  onClick 点击事件
 * @prop {string}  isShowBottomLine 是否显示分割线
 */
// TODO 点击穿透问题之后想办法解决
const Index = ({ imgSrc, title = '', type = 0, subTitle, label, index, onClick = noop, userId, platform, isShowBottomLine = true, needPadding = true }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick(userId);
  };

  const icon =  (type === 1) ? "LikeOutlined" :
                (type === 2) ? "HeartOutlined" :
                (type === 3) ? "HeartOutlined" : "",
        bgClrBasedOnType =  (type === 1) ? styles.like :
                            (type === 2) ? styles.heart :
                            (type === 3) ? styles.heart : "";

  return (
    <View className={`${styles.listItem} ${isShowBottomLine && styles.bottomLine} ${needPadding && styles.sidebarPadding}`} key={index} onClick={handleClick}>
      <View className={styles.wrapper}>
          <View className={styles.header}>
              <Avatar
                className={styles.img}
                image={imgSrc}
                name={title}
                isShowUserInfo={platform === 'pc'}
                userId={userId}
              />
              {
                icon && (
                  <View className={`${styles.icon} ${bgClrBasedOnType}`}>
                      <Icon name={icon} size={12}/>
                  </View>
                )
              }
          </View>

          <View className={styles.content}>
              <Text className={styles.title}>{title}</Text>
              {subTitle && <Text className={styles.subTitle}>{subTitle}</Text>}
          </View>
      </View>

      {
        label || label === '' ? (
          <View className={styles.footer}>
            <Text className={styles.label}>{label}</Text>
            <Icon className={styles.rightIcon} name="RightOutlined" size={12} />
          </View>
        ) : (
          <Button type="primary" className={styles.button} onClick={handleClick}>查看主页</Button>
        )
      }
    </View>
  );
};

export default React.memo(Index);
