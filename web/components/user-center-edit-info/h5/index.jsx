import React, { Component } from 'react';
import UserCenterEditHeader from '../../user-center-edit-header/index';
import { Button, Icon, Input, Toast } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router'
import throttle from '@common/utils/thottle.js';
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
  }

  componentDidMount() {
    this.initState()
    const id = this.props.user?.id
    this.props.user.updateUserInfo(id)
    this.props.user.initEditInfo()
  }

  // 点击取消
  handleCancel = () => {
    Router.back();
  }

  handleClickNickName = () => {
    this.setState({
      isClickNickName: !this.state.isClickNickName,
    });
  }

  handleChangeNickName = (e) => {
    const { value } = e.target;
    this.props.user.editNickName = value;
  }

  handleBlurNickName = (e) => {
    const { value } = e.target;
    this.props.user.editNickName = value;
    this.setState({
      isClickNickName: false,
    });
  }

  // 渲染修改用户名
  renderInputNickName = () => {
    const { isClickNickName } = this.state;
    return (
      <>
        <label>昵称</label>
        <div className={styles.uerInputItem}>
          {isClickNickName ?
            <Input focus={true} maxLength={10} value={this.user.editNickName} onChange={this.handleChangeNickName} onBlur={this.handleBlurNickName} />
            : this.user.editNickName}
        </div>
      </>
    );
  }

  handleUpdateEditedUserInfo = throttle(() => {
    this.props.user.updateEditedUserInfo().then(res => {
      Toast.success({
        content: "更新信息成功",
        hasMask: false,
        duration: 1000,
      })
      Router.push({ url: '/my' });
    }).catch((error) => {
      Toast.error({
        content: error.message || '更新用户信息失败',
        hasMask: false,
        duration: 1000,
      })
      Router.push({ url: '/my' });
    });
  }, 300)

  handleGoToEditMobile = () => {
    Router.push({ url: '/my/edit/mobile' });
  }

  handleGoToEditAccountPwd = () => {
    Router.push({ url: '/my/edit/pwd' });
  }

  handleGoToEditPayPwd = () => {
    Router.push({ url: '/my/edit/paypwd' });
  }

  render() {
    return (
      <div>
        {/* 头部 */}
        <div><UserCenterEditHeader /></div>
        {/* middle */}
        <div className={styles.userCenterEditMiddle}>
          <h3>个人信息</h3>
          <div onClick={this.handleClickNickName} className={styles.userInputContent}>
            {this.renderInputNickName()}
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>用户名</label>
              <div>{this.user.editUserName}</div>
            </div>
          </div>
          {
            this.props.site?.isSmsOpen && (
              <div className={styles.userCenterEditItem}>
                <div className={styles.userCenterEditLabel}>
                  <label>手机号码</label>
                </div>
                <div className={styles.userCenterEditValue} onClick={this.handleGoToEditMobile}>
                  <div className={styles.ucText}>{this.user.mobile}</div>
                  <Icon name="RightOutlined" />
                </div>
              </div>
            )
          }
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>账户密码</label>
            </div>
            <div className={styles.userCenterEditValue} onClick={this.handleGoToEditAccountPwd}>
              <div className={styles.ucText}>{this.props.user?.hasPassword ? '修改' : '设置'}</div>
              <Icon name="RightOutlined" />
            </div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>支付密码</label>
            </div>
            <div className={styles.userCenterEditValue} onClick={this.handleGoToEditPayPwd}>
              <div className={styles.ucText}>{this.props.user?.canWalletPay ? "修改" : "设置"}</div>
              <Icon name="RightOutlined" />
            </div>
          </div>
          {
            this.props.wechatEnv !== 'none' && (
              <div className={styles.userCenterEditItem} style={{ border: 'none' }}>
                <div className={styles.userCenterEditLabel}>
                  <label>微信</label>
                  <div className={styles.userCenterEditWeChat}>
                    <Avatar size="small" image={this.user.avatarUrl} name={this.user.username} />
                    <span>{this.user.nickname}</span>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        {/* bottom */}
        <div className={styles.userCenterEditBottom}>
          {/* <h3>实名认证</h3>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>申请实名认证</label>
              <div>去认证</div>
            </div>
            <div><Icon name="RightOutlined" /></div>
          </div> */}

        </div>
        <div className={styles.userCenterEditBtn}>
          <Button full onClick={this.handleCancel}>取消</Button>
          <Button full onClick={this.handleUpdateEditedUserInfo} type="primary">保存</Button>
        </div>
      </div>
    );
  }
}

export default index;
