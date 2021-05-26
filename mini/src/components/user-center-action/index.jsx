import React from 'react';
import { View } from '@tarojs/components';
import Icon from '@discuzq/design/dist/components/icon/index';
import Badge from '@discuzq/design/dist/components/badge/index';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';

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
    Router.push({ url: 'invite' });
  }

  render() {
    return (
      <View className={styles.userActionMobile}>
        <View className={styles.userCenterAction}>
          <View className={styles.userCenterActionItemContainer}>
            <View onClick={this.handleMyMessage} className={styles.userCenterActionItem}>
              <View className={styles.userCenterActionItemIcon}>
                <Badge info={12}>
                  <Icon name={'MailOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </View>
              <View className={styles.userCenterActionItemDesc}>我的消息</View>
            </View>
          </View>
          <View className={styles.userCenterActionItemContainer}>
            <View onClick={this.handleMyWallet} className={styles.userCenterActionItem}>
              <View className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'PayOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </View>
              <View className={styles.userCenterActionItemDesc}>我的钱包</View>
            </View>
          </View>

          <View className={styles.userCenterActionItemContainer}>
            <View className={styles.userCenterActionItem}>
              <View className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'CollectOutlinedBig'} color={'#4F5A70'} size={20} />
                </Badge>
              </View>
              <View className={styles.userCenterActionItemDesc}>我的收藏</View>
            </View>
          </View>

          <View className={styles.userCenterActionItemContainer}>
            <View className={styles.userCenterActionItem}>
              <View className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'ShieldOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </View>
              <View className={styles.userCenterActionItemDesc}>我的屏蔽</View>
            </View>
          </View>
        </View>
        <View className={styles.userCenterAction}>
          <View className={styles.userCenterActionItemContainer}>
            <View className={styles.userCenterActionItem}>
              <View className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'ShoppingCartOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </View>
              <View className={styles.userCenterActionItemDesc}>我的购买</View>
            </View>
          </View>

          <View className={styles.userCenterActionItemContainer}>
            <View className={styles.userCenterActionItem}>
              <View className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'RecycleBinOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </View>
              <View className={styles.userCenterActionItemDesc}>我的草稿箱</View>
            </View>
          </View>

          <View className={styles.userCenterActionItemContainer}>
            <View onClick={this.handleMySiteInfo} className={styles.userCenterActionItem}>
              <View className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'NotepadOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </View>
              <View className={styles.userCenterActionItemDesc}>站点信息</View>
            </View>
          </View>

          <View className={styles.userCenterActionItemContainer}>
            <View onClick={this.handleMyInvite} className={styles.userCenterActionItem}>
              <View className={styles.userCenterActionItemIcon}>
                <Badge>
                  <Icon name={'NotbookOutlined'} color={'#4F5A70'} size={20} />
                </Badge>
              </View>
              <View className={styles.userCenterActionItemDesc}>推广邀请</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default UserCenterAction;
