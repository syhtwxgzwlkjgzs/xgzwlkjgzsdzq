import React from 'react';
import { Avatar, Input, Icon, Button, Divider } from '@discuzq/design';
import styles from './index.module.scss';

class UserCenterFriends extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.friendItem}>
          <div className={styles.friendInfo}>
            <div className={styles.friendAvatar}>
              <Avatar text={'黑'} circle />
            </div>
            <div className={styles.friendTextInfo}>
              <div className={styles.friendName}>I am a friend</div>
              <div className={styles.friendGroup}>I am friend group</div>
            </div>
          </div>
          <div className={styles.friendAction}>
            <Button type={'primary'}>
                <Icon name={'PlusOutlined'}/> 关注
            </Button>
          </div>
        </div>

        <Divider
          style={{
            margin: 0,
          }}
        />

        <div className={styles.friendItem}>
          <div className={styles.friendInfo}>
            <div className={styles.friendAvatar}>
              <Avatar text={'黑'} circle />
            </div>
            <div className={styles.friendTextInfo}>
              <div className={styles.friendName}>I am a friend</div>
              <div className={styles.friendGroup}>I am friend group</div>
            </div>
          </div>
          <div className={styles.friendAction}>
            <Button type={'primary'} className={styles.friendActionFriend}>
              <Icon name={'WithdrawOutlined'}/> 互关
            </Button>
          </div>
        </div>

        <Divider
          style={{
            marginTop: 0,
            marginBottom: 0,
          }}
        />

        <div className={styles.friendItem}>
          <div className={styles.friendInfo}>
            <div className={styles.friendAvatar}>
              <Avatar text={'黑'} circle />
            </div>
            <div className={styles.friendTextInfo}>
              <div className={styles.friendName}>I am a friend</div>
              <div className={styles.friendGroup}>I am friend group</div>
            </div>
          </div>
          <div className={styles.friendAction}>
            <Button type={'primary'} className={styles.friendActionFollowed}>
              <Icon name={'CheckOutlined'}/> 已关注
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserCenterFriends;
