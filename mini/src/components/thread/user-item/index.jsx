import React from 'react';
import { Button, Icon } from '@discuzq/design';
import Avatar from '../../avatar';
import { noop } from '../utils';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components'

/**
 * 用户信息视图
 * @prop {string}  imgSrc 用户头像
 * @prop {string}  title 用户名字
 * @prop {string}  subTitle 额外信息
 * @prop {string}  icon 用户头像右下角图标
 * @prop {string}  label 额外信息
 * @prop {string}  onClick 点击事件
 */
// TODO 点击穿透问题之后想办法解决
const Index = ({ imgSrc, title = '', icon, subTitle, label, index, onClick = noop  }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick();
  };
  return (
    <View className={styles.listItem} key={index} onClick={handleClick}>
      <View className={styles.wrapper}>
          <View className={styles.header}>
              <Avatar className={styles.img} image={imgSrc} name={title} />
              {
                icon && (
                  <View className={styles.icon} style={{ backgroundColor: index % 2 === 0 ? '#e02433' : '#ffc300' }}>
                      <Icon name={icon} />
                  </View>
                )
              }
          </View>

          <View className={styles.content}>
              <Text className={styles.title}>{title}</Text>
              <Text className={styles.subTitle}>{subTitle}</Text>
          </View>
      </View>

      {
        label || label === '' ? (
          <View className={styles.footer}>
            <Text className={styles.label}>{label}</Text>
            <Icon className={styles.rightIcon} name="RightOutlined" size={12} />
          </View>
        ) : (
          <Button type="primary" onClick={handleClick}>查看主页</Button>
        )
      }
    </View>
  );
};

export default React.memo(Index);
