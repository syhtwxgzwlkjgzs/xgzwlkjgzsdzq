import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import UserCenterEditHeader from '../user-center-edit-header';
import { Button, Icon, Input, Toast } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import throttle from '@common/utils/thottle.js';
import { View, Text } from '@tarojs/components';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
@inject('site')
@inject('user')
@observer
class index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isClickNickName: false,
    };
    this.user = this.props.user || {};
  }

  initState = () => {
    this.setState({
      isClickNickName: false,
    });
  };

  async componentDidMount() {
    this.initState();
    const id = this.props.user?.id;
    await this.props.user.updateUserInfo(id);
    await this.props.user.initEditInfo();
  }

  // 点击取消
  handleCancel = () => {
    Router.back();
    this.props.user.initEditInfo();
  };

  handleClickNickName = () => {
    this.setState({
      isClickNickName: !this.state.isClickNickName,
    });
  };

  handleChangeNickName = (e) => {
    const { value } = e.target;
    this.props.user.editNickName = value;
  };

  handleBlurNickName = (e) => {
    const { value } = e.target;
    this.props.user.editNickName = value;
    this.setState({
      isClickNickName: false,
    });
  };

  handleUpdateEditedUserInfo = throttle(() => {
    this.props.user
      .updateEditedUserInfo()
      .then((res) => {
        Toast.success({
          content: '更新信息成功',
          hasMask: false,
          duration: 1000,
        });
        setTimeout(() => {
          Taro.navigateTo({ url: '/subPages/my/index' });
        }, 200)
      })
      .catch((error) => {
        Toast.error({
          content: error.message || '更新用户信息失败',
          hasMask: false,
          duration: 1000,
        });
        setTimeout(() => {
          Taro.navigateTo({ url: '/subPages/my/index' });
        }, 200)
      });
  }, 300);

  handleGoToEditMobile = () => {
    // FIXME: 暂时页面缺失
    if (!this.user.mobile) {
      Router.push({ url: '/user/bind-phone' });
      return;
    }
    Taro.navigateTo({ url: '/subPages/my/edit/mobile/index' });
  };

  handleGoToEditUserName = () => {
    // FIXME: 页面缺失
    return
    if (!this.props.user.canEditUsername) {
      Toast.error({
        content: '用户名一年只能修改一次',
        duration: 1000,
      });
      return;
    }
    Taro.navigateTo({ url: '/subPages/my/edit/username/index' });
  };

  handleGoToEditAccountPwd = () => {
    Taro.navigateTo({ url: '/subPages/my/edit/pwd/index' });
  };

  handleGoToEditPayPwd = () => {
    Taro.navigateTo({ url: '/subPages/my/edit/paypwd/index' });
  };

  // 渲染修改用户名
  renderInputNickName = () => {
    const { isClickNickName } = this.state
    return (
      <View className={styles.userCenterEditLabel}>
        <Text className={styles.userLabelName}>昵称</Text>
        <View className={styles.uerInputItem}>{isClickNickName ? <Input focus={true} maxLength={10} value={this.user.editNickName} onChange={this.handleChangeNickName} onBlur={this.handleBlurNickName} /> : this.user.editNickName}</View>
      </View>
    )
  }

  render() {
    // 条件都满足时才显示微信
    const IS_WECHAT_ACCESSABLE = this.props.site.wechatEnv !== 'none' && !!this.user.wxNickname;
    return (
      <ToastProvider>
        <View>
          {/* 头部 */}
          <View><UserCenterEditHeader /></View>
          {/* middle */}
          <View className={styles.userCenterEditMiddle}>
            <View className={styles.title}>个人信息</View>
            <View onClick={this.handleClickNickName} className={styles.userInputContent}>
              {this.renderInputNickName()}
            </View>
            <View className={styles.userCenterEditItem}>
              <View className={styles.userCenterEditLabel}>
                <Text className={styles.userLabelName}>用户名</Text>
              </View>
              <View className={styles.userCenterEditValue} onClick={this.handleGoToEditUserName}>
                <View className={styles.ucText}>{this.user.editUserName}</View>
                <Icon name="RightOutlined" size={12} />
              </View>
            </View>
            {
              this.props.site?.isSmsOpen && (
                <View className={styles.userCenterEditItem}>
                  <View className={styles.userCenterEditLabel}>
                    <Text className={styles.userLabelName}>手机号码</Text>
                  </View>
                  <View className={styles.userCenterEditValue} onClick={this.handleGoToEditMobile}>
                    <View className={styles.ucText}>{this.user.mobile || '去绑定'}</View>
                    <Icon name="RightOutlined" size={12} />
                  </View>
                </View>
              )
            }
            <View className={styles.userCenterEditItem}>
              <View className={styles.userCenterEditLabel}>
                <Text className={styles.userLabelName}>账户密码</Text>
              </View>
              <View className={styles.userCenterEditValue} onClick={this.handleGoToEditAccountPwd}>
                <View className={styles.ucText}>{this.props.user?.hasPassword ? '修改' : '设置'}</View>
                <Icon name="RightOutlined" size={12} />
              </View>
            </View>
            <View className={styles.userCenterEditItem}>
              <View className={styles.userCenterEditLabel}>
                <Text className={styles.userLabelName}>支付密码</Text>
              </View>
              <View className={styles.userCenterEditValue} onClick={this.handleGoToEditPayPwd}>
                <View className={styles.ucText}>{this.props.user?.canWalletPay ? '修改' : '设置'}</View>
                <Icon name="RightOutlined" size={12} />
              </View>
            </View>
            {
              IS_WECHAT_ACCESSABLE && (
                <View className={styles.userCenterEditItem} style={{ border: 'none' }}>
                  <View className={styles.userCenterEditLabel}>
                    <Text className={styles.userLabelName}>微信</Text>
                    <View className={styles.userCenterEditWeChat}>
                      <Avatar size="small" image={this.user.wxHeadImgUrl} name={this.user.wxNickname} />
                      <Text className={styles.wxNickname}>{this.user.wxNickname}</Text>
                    </View>
                  </View>
                </View>
              )
            }
          </View>
          {/* bottom */}
          <View className={styles.userCenterEditBottom}>
            <View className={styles.userCenterEditBtn}>
              <Button full onClick={this.handleCancel} className={styles.btn}>
                取消
            </Button>
              <Button full className={styles.btn} onClick={this.handleUpdateEditedUserInfo} type="primary">
                保存
            </Button>
            </View>
          </View>
        </View>
      </ToastProvider>
    )
  }
}

export default index
