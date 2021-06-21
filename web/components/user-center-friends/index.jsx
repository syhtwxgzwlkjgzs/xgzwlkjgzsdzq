import React from 'react';
import { Input, Icon, Button, Divider } from '@discuzq/design';
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
    customActionArea: null,
  };

  // 渲染操作区域
  renderActionArea() {
    if (this.props.id === this.props.user.id) return null;
    if (this.props.customActionArea) return this.props.customActionArea;
    return (
      <div className={styles.friendAction}>
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
            {/* <span>+</span> */}
            <Icon size={10} name={'PlusOutlined'} className={styles.iconScale} />
            <span>关注</span>
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
            <Icon size={10} name={'WithdrawOutlined'} className={styles.iconScale} />
            <span>互关</span>
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
            <Icon size={10} name={'CheckOutlined'} className={styles.iconScale} />
            <span>已关注</span>
          </Button>
        )}
      </div>
    );
  }

  render() {
    const myid = this.props.user.id;
    return (
      <div
        style={{
          ...this.props.itemWrapperStyle,
        }}
        onClick={async () => {
          await this.props.onContainerClick({
            id: this.props.id,
          });
        }}
      >
        <div
          style={{
            ...this.props.itemStyle,
          }}
          className={styles.friendItem}
        >
          <div className={styles.friendInfo}>
            <div className={styles.friendAvatar}>
              <Avatar
                image={this.props.imgUrl}
                userId={this.props.id}
                isShowUserInfo={this.props.withHeaderUserInfo}
                circle
                name={this.props.userName}
              />
            </div>
            <div className={styles.friendTextInfo}>
              <div className={styles.friendName}>
                <span title={this.props.userName}>{this.props.userName}</span>
              </div>
              <div className={styles.friendGroup}>
                <span title={this.props.userGroup}>{this.props.userGroup}</span>
              </div>
            </div>
          </div>
          {this.renderActionArea()}
        </div>
      </div>
    );
  }
}

export default UserCenterFriends;
