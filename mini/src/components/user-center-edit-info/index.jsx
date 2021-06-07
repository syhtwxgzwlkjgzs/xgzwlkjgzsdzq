import React, { Component } from 'react';
import UserCenterEditHeader from '../user-center-edit-header';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Input from '@discuzq/design/dist/components/input/index';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import { View, Text } from '@tarojs/components';

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

  componentDidMount() {
    this.initState();
    this.props.user.initEditInfo();
  }

  // 点击取消
  handleCancel = () => {
    Router.back();
  };

  handleClickNickName = () => {
    this.setState({
      isClickNickName: !this.state.isClickNickName,
    });
  };

  handleChangeNickName = (e) => {
    let value = e.target.value;
    this.props.user.editNickName = value;
  };

  handleBlurNickName = (e) => {
    let value = e.target.value;
    this.props.user.editNickName = value;
    this.setState({
      isClickNickName: false,
    });
  };

  // 渲染修改用户名
  renderInputNickName = () => {
    const { isClickNickName } = this.state;
    return (
      <View className={styles.userCenterEditLabel}>
        <Text>昵称</Text>
        <View>
          {isClickNickName ? (
            <Input
              focus={true}
              maxLength={10}
              value={this.user.editNickName}
              onChange={this.handleChangeNickName}
              onBlur={this.handleBlurNickName}
            />
          ) : (
            this.user.editNickName
          )}
        </View>
      </View>
    );
  };

  handleUpdateEditedUserInfo = () => {
    this.props.user.updateEditedUserInfo();
    Router.push({ url: `/my` });
  };

  handleGoToEditMobile = () => {
    Router.push({ url: `mobile/index` });
  };

  handleGoToEditAccountPwd = () => {
    Router.push({ url: `pwd/index` });
  };

  handleGoToEditPayPwd = () => {
    Router.push({ url: 'paypwd/index' });
  };

  render() {
    // 条件都满足时才显示微信
    const IS_WECHAT_ACCESSABLE = this.props.site.wechatEnv !== 'none' && !!this.user.wxNickname;
    return (
      <View>
        {/* 头部 */}
        <View>
          <UserCenterEditHeader />
        </View>
        {/* middle */}
        <View className={styles.userCenterEditMiddle}>
          <View className={styles.title}>个人信息</View>
          <View onClick={this.handleClickNickName} className={styles.userCenterEditItem}>
            {this.renderInputNickName()}
          </View>
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>用户名</Text>
              <View>{this.user.editUserName}</View>
            </View>
          </View>
          {this.props.site?.isSmsOpen && (
            <View className={styles.userCenterEditItem}>
              <View className={styles.userCenterEditLabel}>
                <Text>手机号码</Text>
                <View>{this.user.mobile || '去绑定'}</View>
              </View>

              <View className={styles.gotoIcon} onClick={this.handleGoToEditMobile}>
                <Icon name="RightOutlined" />
              </View>
            </View>
          )}
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>账户密码</Text>
              <View>修改</View>
            </View>
            <View className={styles.gotoIcon} onClick={this.handleGoToEditAccountPwd}>
              <Icon name="RightOutlined" />
            </View>
          </View>
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>支付密码</Text>
              <View>修改</View>
            </View>
            <View className={styles.gotoIcon} onClick={this.handleGoToEditPayPwd}>
              <Icon name="RightOutlined" />
            </View>
          </View>
          <View className={styles.userCenterEditItem} style={{ border: 'none' }}>
            <View className={styles.userCenterEditLabel}>
              <Text>微信</Text>
              <View className={styles.userCenterEditWeChat}>
                <Avatar size="small" image={this.user.avatarUrl} name={this.props.user.username} />{' '}
                <Text>
                  {this.props.user.wxNickname}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* bottom */}
        <View className={styles.userCenterEditBottom}>
          {/* <h3>实名认证</h3>
          <View className={styles.userCenterEditItem}>
            <View className={styles.userCenterEditLabel}>
              <Text>申请实名认证</Text>
              <View>去认证</View>
            </View>
            <View><Icon name="RightOutlined" /></View>
          </View> */}
          <View className={styles.userCenterEditBtn}>
            <Button onClick={this.handleCancel}>
              <View className={styles.actionButtonContentWrapper}>取消</View>
            </Button>
            <Button onClick={this.handleUpdateEditedUserInfo} type="primary">
              <View className={styles.actionButtonContentWrapper}>保存</View>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default index;
