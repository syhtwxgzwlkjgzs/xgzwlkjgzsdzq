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
    followHandler: async () => {},
    unFollowHandler: async () => {},
    onContainerClick: async ({ id }) => {},
  };

  render() {
    return (
      <div onClick={async () => {
        await this.props.onContainerClick({
          id: this.props.id,
        });
      }}>
        <div className={styles.friendItem}>
          <div className={styles.friendInfo}>
            <div className={styles.friendAvatar}>
              <Avatar
                image={this.props.imgUrl}
                userId={this.props.id}
                isShowUserInfo={this.props.withHeaderUserInfo}
                circle
              />
            </div>
            <div className={styles.friendTextInfo}>
              <div className={styles.friendName}>{this.props.userName}</div>
              <div className={styles.friendGroup}>{this.props.userGroup}</div>
            </div>
          </div>

          <div className={styles.friendAction}>
            {this.props.type === 'follow' && (
              <Button
                type={'primary'}
                className={styles.friendActionFollow}
                onClick={async () => {
                  await this.props.followHandler({
                    id: this.props.id,
                  });
                }}
              >
                <Icon size={14} name={'PlusOutlined'} />
                <span>关注</span>
              </Button>
            )}

            {this.props.type === 'friend' && (
              <Button
                type={'primary'}
                className={styles.friendActionFriend}
                onClick={async () => {
                  await this.props.unFollowHandler({
                    id: this.props.id,
                  });
                }}
              >
                <Icon size={14} name={'WithdrawOutlined'} />
                <span>互关</span>
              </Button>
            )}

            {this.props.type === 'followed' && (
              <Button
                type={'primary'}
                className={styles.friendActionFollowed}
                onClick={async () => {
                  await this.props.unFollowHandler({
                    id: this.props.id,
                  });
                }}
              >
                <Icon size={14} name={'CheckOutlined'} />
                <span>已关注</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default UserCenterFriends;
