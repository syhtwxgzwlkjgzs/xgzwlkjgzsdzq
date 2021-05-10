import PropTypes from 'prop-types';
import Avatar from '@components/avatar';
import React from 'react';
import { diffDate } from '@common/utils/diff-date';
import { View, Text } from '@tarojs/components';
import { Icon, Tag } from '@discuzq/design';
import styles from './index.module.scss';

UserInfo.propTypes = {
  name: PropTypes.string.isRequired, // 用户名称
  avatar: PropTypes.string.isRequired, // 用户头像
  groupName: PropTypes.string, // 用户组
  time: PropTypes.string, // 发帖时间
  location: PropTypes.string, // 地址
  view: PropTypes.string, // 浏览量
  onClick: PropTypes.func,
  isEssence: PropTypes.bool, // 是否精华
  isPay: PropTypes.bool, // 是否付费
  isReward: PropTypes.bool, // 是否悬赏
  isRed: PropTypes.bool, // 是否红包
  collect: PropTypes.bool,
};

export default function UserInfo(props) {
  return (
    <View className={styles.contianer}>
      <Avatar
        className={styles.avatar}
        circle
        image={props.avatar}
        name={props.name || ''}
        onClick={() => props.onClick()}
      ></Avatar>
      <View className={styles.right}>
        <View>
          <Text className={styles.name}>{props.name}</Text>
          {props.groupName && <Text className={styles.groupName}>{props.groupName}</Text>}
        </View>
        <View className={styles.meta}>
          {props.time && <Text className={styles.time}>{diffDate(props.time)}</Text>}
          {props.location && (
            <View className={styles.location}>
              <Icon name="PositionOutlined"></Icon>
              <Text className={styles.locationText}>{props.location}</Text>
            </View>
          )}
          {props.view && (
            <View className={styles.view}>
              <Icon name="EyeOutlined"></Icon>
              <Text className={styles.viewText}>{props.view}</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.tags}>
        {props.isEssence && <Tag type="primary">精华</Tag>}
        {props.isPay && <Tag type="success">付费</Tag>}
        {props.isReward && <Tag type="warning">悬赏</Tag>}
        {props.isRed && <Tag type="danger">红包</Tag>}
        {props.collect === 'collect' &&  <Icon className={styles.listItemIcon} name='CollectOutlined' size={20} />}
      </View>
    </View>
  );
}
