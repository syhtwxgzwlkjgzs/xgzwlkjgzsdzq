import React from 'react';
import Icon from '@discuzq/design/dist/components/icon/index';
import Button from '@discuzq/design/dist/components/button/index';
import { View } from '@tarojs/components';
import { inject, observer } from 'mobx-react';
import Avatar from '@components/avatar';
import styles from './index.module.scss';

@inject('user')
@observer
class UserCenterFriends extends React.Component {
  static defaultProps = {
    id: null,
    imgUrl: '',
    type: 'follow',
    withHeaderUserInfo: false,
    userName: null,
    userGroup: null,
    itemStyle: {},
    itemWrapperStyle: {},
    followHandler: async () => {},
    unFollowHandler: async () => {},
    onContainerClick: async ({ id }) => {},
  };

  render() {
    const myid = this.props.user.id;
    return (
      <View
        style={{
          ...this.props.itemWrapperStyle,
        }}
        onClick={async () => {
          await this.props.onContainerClick({
            id: this.props.id,
          });
        }}
      >
        <View
          style={{
            ...this.props.itemStyle,
          }}
          className={styles.friendItem}
        >
          <View className={styles.friendInfo}>
            <View className={styles.friendAvatar}>
              <Avatar
                image={this.props.imgUrl}
                userId={this.props.id}
                isShowUserInfo={this.props.withHeaderUserInfo}
                circle
                name={this.props.userName}
              />
            </View>
            <View className={styles.friendTextInfo}>
              <View className={styles.friendName}>{this.props.userName}</View>
              <View className={styles.friendGroup}>{this.props.userGroup}</View>
            </View>
          </View>

          {this.props.id != myid && (
            <View className={styles.friendAction}>
              {this.props.type === 'follow' && (
                <Button
                  type={'primary'}
                  className={styles.friendActionFollow}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await this.props.followHandler({
                      id: this.props.id,
                    });
                  }}
                >
                  <View>+ 关注</View>
                </Button>
              )}

              {this.props.type === 'friend' && (
                <Button
                  type={'primary'}
                  className={styles.friendActionFriend}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await this.props.unFollowHandler({
                      id: this.props.id,
                    });
                  }}
                >
                  <Icon size={10} name={'WithdrawOutlined'} />
                  <View>互关</View>
                </Button>
              )}

              {this.props.type === 'followed' && (
                <Button
                  type={'primary'}
                  className={styles.friendActionFollowed}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await this.props.unFollowHandler({
                      id: this.props.id,
                    });
                  }}
                >
                  <Icon size={10} name={'CheckOutlined'} />
                  <View>已关注</View>
                </Button>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default UserCenterFriends;
