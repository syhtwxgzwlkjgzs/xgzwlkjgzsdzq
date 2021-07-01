import React from 'react';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { observer, inject } from 'mobx-react';
import UnreadRedDot from '@components/unread-red-dot';
@inject('user')
@inject('message')
@observer
class UserCenterAction extends React.Component {
  // 点击我的消息
  handleMyMessage = () => {
    Router.push({ url: '/message' });
  }

  // 点击我的钱包
  handleMyWallet = () => {
    Router.push({ url: '/wallet' });
  }

  // 点击站点信息
  handleMySiteInfo = () => {
    Router.push({ url: '/forum' });
  }

  // 点击推广信息
  handleMyInvite = () => {
    Router.push({ url: '/invite' });
  }

  // 点击我的屏蔽
  handleMyBan = () => {
    Router.push({ url: '/my/block' });
  }

  // 点击我的购买
  handleMyBuy = () => {
    Router.push({ url: '/my/buy' });
  }

  // 点击我的草稿箱
  handleMyDraft = () => {
    Router.push({ url: '/my/draft' });
  }

  // 点击我的收藏
  handleMyCollect = () => {
    Router.push({ url: '/my/collect' });
  }
  // 点击点赞
  handleMyLike = () => {
    Router.push({ url: '/my/like' });
  }

  render() {
    const { message } = this.props;
    const { totalUnread } = message;
    return (
      <div className={`${styles.userCenterAction} ${this.props.user.isAdmini && styles.userCenterColumnStyle}`}>
        <div onClick={this.handleMyMessage} className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <div className={styles.userMessage}>
              <UnreadRedDot unreadCount={totalUnread}>
                <Icon name={'MailOutlined'} size={20} />
              </UnreadRedDot>
            </div>
          </div>
          <div className={styles.userCenterActionItemDesc}>我的消息</div>
        </div>

        <div onClick={this.handleMyWallet} className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Icon name={'PayOutlined'} size={20} />
          </div>
          <div className={styles.userCenterActionItemDesc}>我的钱包</div>
        </div>

        <div onClick={this.handleMyCollect} className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Icon name={'CollectOutlinedBig'} size={20} />
          </div>
          <div className={styles.userCenterActionItemDesc}>我的收藏</div>
        </div>

        <div onClick={this.handleMyLike} className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Icon name={'LikeOutlined'} size={20} />
          </div>
          <div className={styles.userCenterActionItemDesc}>我的点赞</div>
        </div>

        <div onClick={this.handleMyBan} className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Icon name={'ShieldOutlined'} size={20} />
          </div>
          <div className={styles.userCenterActionItemDesc}>我的屏蔽</div>
        </div>

        <div onClick={this.handleMyBuy} className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Icon name={'ShoppingCartOutlined'} size={20} />
          </div>
          <div className={styles.userCenterActionItemDesc}>我的购买</div>
        </div>

        <div onClick={this.handleMyDraft} className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Icon name={'RetrieveOutlined'} size={20} />
          </div>
          <div className={styles.userCenterActionItemDesc}>我的草稿箱</div>
        </div>

        <div onClick={this.handleMySiteInfo} className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Icon name={'NotepadOutlined'} size={20} />
          </div>
          <div className={styles.userCenterActionItemDesc}>站点信息</div>
        </div>
        {
          !this.props.user.isAdmini && (
            <div onClick={this.handleMyInvite} className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Icon name={'NotbookOutlined'} size={20} />
              </div>
              <div className={styles.userCenterActionItemDesc}>推广邀请</div>
            </div>
          )
        }
      </div>
    );
  }
}

export default UserCenterAction;
