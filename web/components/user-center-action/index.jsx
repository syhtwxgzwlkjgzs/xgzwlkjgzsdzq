import React from 'react';
import { Icon, Badge } from '@discuzq/design';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { observer, inject } from 'mobx-react';

@inject('message')
@observer
class UserCenterAction extends React.Component {
  // 点击我的消息
  handleMyMessage = () => {
    Router.push({ url: '/message' });
  };

  // 点击我的钱包
  handleMyWallet = () => {
    Router.push({ url: '/wallet' });
  };

  // 点击站点信息
  handleMySiteInfo = () => {
    Router.push({ url: '/forum' });
  };

  // 点击推广信息
  handleMyInvite = () => {
    Router.push({ url: '/invite' });
  };

  // 点击我的屏蔽
  handleMyBan = () => {
    Router.push({ url: '/my/block' });
  };

  // 点击我的购买
  handleMyBuy = () => {
    Router.push({ url: '/my/buy' });
  };

  // 点击我的草稿箱
  handleMyDraft = () => {
    Router.push({ url: '/my/draft' });
  };

  // 点击我的收藏
  handleMyCollect = () => {
    Router.push({ url: '/my/collect' });
  };

  componentDidMount() {
    this.props.message.readUnreadCount();
  }

  render() {
    const { message } = this.props;
    const { totalUnread } = message;
    return (
      //   移动端实现
      <div className={styles.userActionMobile}>
        <div className={styles.userCenterAction}>
          <div className={styles.userCenterActionItemContainer}>
            <div onClick={this.handleMyMessage} className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                {totalUnread ? (
                  <Badge info={totalUnread} circle>
                    <Icon name={'MailOutlined'} color={'#4F5A70'} size={20} />
                  </Badge>
                ) : (
                  <Icon name={'MailOutlined'} color={'#4F5A70'} size={20} />
                )}
              </div>
              <div className={styles.userCenterActionItemDesc}>我的消息</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div onClick={this.handleMyWallet} className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'PayOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的钱包</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div onClick={this.handleMyCollect} className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'CollectOutlinedBig'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的收藏</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div onClick={this.handleMyBan} className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'ShieldOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的屏蔽</div>
            </div>
          </div>
        </div>
        <div className={styles.userCenterAction}>
          <div onClick={this.handleMyBuy} className={styles.userCenterActionItemContainer}>
            <div className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'ShoppingCartOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的购买</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div onClick={this.handleMyDraft} className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'RetrieveOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的草稿箱</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div onClick={this.handleMySiteInfo} className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'NotepadOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>站点信息</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div onClick={this.handleMyInvite} className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'NotbookOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>推广邀请</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserCenterAction;
