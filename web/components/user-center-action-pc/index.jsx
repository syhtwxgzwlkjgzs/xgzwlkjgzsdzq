import React from 'react';
import { Icon, Badge } from '@discuzq/design';
import styles from './index.module.scss';

class UserCenterAction extends React.Component {
  render() {
    return (
      <div className={styles.userCenterAction}>
        <div className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Badge info={12}>
              <Icon name={'MailOutlined'} size={20} />
            </Badge>
          </div>
          <div className={styles.userCenterActionItemDesc}>我的消息</div>
        </div>

        <div className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Badge>
              <Icon name={'PayOutlined'} size={20} />
            </Badge>
          </div>
          <div className={styles.userCenterActionItemDesc}>我的钱包</div>
        </div>

        <div className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Badge>
              <Icon name={'CollectOutlinedBig'} size={20} />
            </Badge>
          </div>
          <div className={styles.userCenterActionItemDesc}>我的收藏</div>
        </div>

        <div className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Badge>
              <Icon name={'LikeOutlined'} size={20} />
            </Badge>
          </div>
          <div className={styles.userCenterActionItemDesc}>我的点赞</div>
        </div>

        <div className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Badge>
              <Icon name={'ShieldOutlined'} size={20} />
            </Badge>
          </div>
          <div className={styles.userCenterActionItemDesc}>我的屏蔽</div>
        </div>

        <div className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Badge>
              <Icon name={'ShoppingCartOutlined'} size={20} />
            </Badge>
          </div>
          <div className={styles.userCenterActionItemDesc}>我的购买</div>
        </div>

        <div className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Badge>
              <Icon name={'RecycleBinOutlined'} size={20} />
            </Badge>
          </div>
          <div className={styles.userCenterActionItemDesc}>我的草稿箱</div>
        </div>

        <div className={styles.userCenterActionItem}>
          <div className={styles.userCenterActionItemIcon}>
            <Badge>
              <Icon name={'NotepadOutlined'} size={20} />
            </Badge>
          </div>
          <div className={styles.userCenterActionItemDesc}>站点信息</div>
        </div>

          <div className={styles.userCenterActionItem}>
            <div className={styles.userCenterActionItemIcon}>
              <Badge>
                <Icon name={'NotbookOutlined'} size={20} />
              </Badge>
            </div>
            <div className={styles.userCenterActionItemDesc}>推广邀请</div>
          </div>
        </div>
    );
  }
}

export default UserCenterAction;
