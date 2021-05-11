import React from 'react';
import { Icon, Badge } from '@discuzq/design';
import styles from './index.module.scss';

class UserCenterAction extends React.Component {
  render() {
    return (
      //   移动端实现
      <div className={styles.userActionMobile}>
        <div className={styles.userCenterAction}>
          <div className={styles.userCenterActionItemContainer}>
            <div className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge info={12}>
                  <Icon name={'MailOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的消息</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'PayOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的钱包</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'CollectOutlinedBig'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的收藏</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div className={styles.userCenterActionItem}>
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
          <div className={styles.userCenterActionItemContainer}>
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
            <div className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'RecycleBinOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>我的草稿箱</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div className={styles.userCenterActionItem}>
              <div className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'NotepadOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </div>
              <div className={styles.userCenterActionItemDesc}>站点信息</div>
            </div>
          </div>

          <div className={styles.userCenterActionItemContainer}>
            <div className={styles.userCenterActionItem}>
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
