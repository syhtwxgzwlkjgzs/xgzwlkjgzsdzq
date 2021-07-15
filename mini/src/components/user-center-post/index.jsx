import React from 'react';
import styles from './index.module.scss';
import Input from '@discuzq/design/dist/components/input/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import { defaultOperation } from '@common/constants/const';
import { THREAD_TYPE } from '@common/constants/thread-post';
import Avatar from '@components/avatar';
import { View, Text } from '@tarojs/components';

// 用户中心发帖模块
@inject('user')
@observer
class UserCenterPost extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <View
        className={styles.userCenterPost}
        onClick={() => {
          Router.push({ url: '/indexPages/thread/post/index' });
        }}
      >
        <View className={styles.userCenterPostTitle}>发帖</View>
        <View className={styles.userCenterPostContent}>
          <View className={styles.userCenterPostAvatar}>
            <Avatar image={user.avatarUrl} name={user.nickname} circle />
          </View>
          <View
            style={{
              width: '100%',
            }}
          >
            <View className={styles.userCenterPostInfo}>
              <View className={styles.userCenterPostInput}>
                <Input
                  style={{
                    width: '100%',
                  }}
                  disabled
                  placeholder={'分享新鲜事'}
                />
              </View>
            </View>
          </View>
        </View>
        <View className={styles.userCenterPostList}>
          {this.props.user.threadExtendPermissions[THREAD_TYPE.image] && (
            <View className={styles.userCenterPostListItem}>
              <Icon color={'#8590A6'} size={20} name={'PictureOutlinedBig'} />
            </View>
          )}
          {this.props.user.threadExtendPermissions[THREAD_TYPE.video] && (
            <View className={styles.userCenterPostListItem}>
              <Icon color={'#8590A6'} size={20} name={'VideoOutlined'} />
            </View>
          )}
          {this.props.user.threadExtendPermissions[THREAD_TYPE.voice] && (
            <View className={styles.userCenterPostListItem}>
              <Icon color={'#8590A6'} size={20} name={'MicroOutlined'} />
            </View>
          )}
          {this.props.user.threadExtendPermissions[THREAD_TYPE.goods] && (
            <View className={styles.userCenterPostListItem}>
              <Icon color={'#8590A6'} size={20} name={'ShoppingCartOutlined'} />
            </View>
          )}
          {this.props.user.threadExtendPermissions[THREAD_TYPE.reward] && (
            <View className={styles.userCenterPostListItem}>
              <Icon color={'#8590A6'} size={20} name={'QuestionOutlined'} />
            </View>
          )}
          {this.props.user.threadExtendPermissions[defaultOperation.attach] && (
            <View className={styles.userCenterPostListItem}>
              <Icon color={'#8590A6'} size={20} name={'PaperClipOutlined'} />
            </View>
          )}
          {this.props.user.threadExtendPermissions[defaultOperation.redpacket] && (
            <View className={styles.userCenterPostListItem}>
              <Icon color={'#8590A6'} size={20} name={'RedPacketOutlined'} />
            </View>
          )}
          {this.props.user.threadExtendPermissions[defaultOperation.pay] && (
            <View className={styles.userCenterPostListItem}>
              <Icon color={'#8590A6'} size={20} name={'GoldCoinOutlined'} />
            </View>
          )}
        </View>
      </View>
    );
  }
}

UserCenterPost.displayName = 'UserCenterPost';

export default UserCenterPost;
