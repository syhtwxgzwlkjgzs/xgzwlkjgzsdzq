import React, { Component, Suspense } from 'react';
import Header from '@components/header';
import UserCenterEditHeader from '../../user-center-edit-header/index';
import BaseLaout from '@components/base-layout';
import { Button, Icon, Input } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import HOCFetchSiteData from '../../../middleware/HOCFetchSiteData';
import UserCenterEditAccountPwd from '../../user-center-edit-account-pwd-pc';
import UserCenterEditMobile from '../../user-center-edit-mobile-pc';
import UserCenterEditPaypwd from '../../user-center-edit-paypwd-pc';

@inject('site')
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClickNickName: false,
      accountEditorVisible: false,
      payPwdEditorVisible: false,
      mobileEditorVisible: false,
      editorConfig: [
        {
          name: '昵称',
          display: 'show',
          condition: () => true,
          render: () => this.props.user.nickname,
          operation: () => <p className={styles.pcEditNicknameCallMsodify}>修改</p>,
          onSave: () => {},
        },
        {
          name: '用户名',
          display: 'show',
          condition: () => true,
          render: () => this.props.user.username,
          operation: () => {
            if (this.props.user.canEditUsername) {
              return <p className={styles.pcEditNicknameCallMsodifyDisable}>暂无法修改（一年一次）</p>;
            }
            return <p className={styles.pcEditNicknameCallMsodify}>修改</p>;
          },
          onSave: () => {},
        },
        {
          name: '个性签名',
          display: 'show',
          condition: () => true,
          render: () => this.props.user.signature,
          operation: () => <p className={styles.pcEditNicknameCallMsodify}>修改</p>,
          onSave: () => {},
        },
        {
          name: '手机号码',
          display: 'show',
          render: () => this.props.user.mobile,
          condition: () => this.props.site?.isSmsOpen,
          operation: () => <p className={styles.pcEditNicknameCallMsodify}>修改</p>,
        },
        {
          name: '账户密码',
          display: 'show',
          condition: () => true,
          render: () => {
            if (this.props.user.hasPassword) {
              return '已设置';
            }
            return '未设置';
          },
          operation: () => (
            <p
              onClick={() => {
                this.setState({
                  accountEditorVisible: true,
                });
              }}
              className={styles.pcEditNicknameCallMsodify}
            >
              {this.props.user?.hasPassword ? '修改' : '设置'}
            </p>
          ),
        },
        {
          name: '支付密码',
          display: 'show',
          condition: () => true,
          render: () => {
            if (this.props.user.canWalletPay) {
              return '已设置';
            }
            return '未设置';
          },
          operation: () => (
            <p
              onClick={() => {
                this.setState({
                  payPwdEditorVisible: true,
                });
              }}
              className={styles.pcEditNicknameCallMsodify}
            >
              {this.props.user?.canWalletPay ? '修改' : '设置'}
            </p>
          ),
        },
        {
          name: '微信',
          display: 'show',
          condition: () => true,
          render: () => (
            <div className={styles.pcEditNicknameImgs}>
              <Avatar className={styles.pcEditNicknameImg} image={this.user.wxHeadImgUrl} name={this.user.wxNickname} />
              <p className={styles.pcEditWeiName}>{this.user.wxNickname}</p>
            </div>
          ),
          operation: () => <p className={styles.pcEditNicknameCallMsodify}>换绑</p>,
        },
      ],
    };
    this.user = this.props.user || {};
  }
  editorialpresentation(item, type, index) {
    // render content
    const content = item.render() || null;
    // 如果不满足条件，不渲染
    if (!item.condition()) return null;
    return (
      <>
        <div className={styles.pcEditNickname}>
          <div className={styles.pcEditNicknameText}>{item.name}</div>
          <div className={styles.box}>
            {item.display === 'show' && (
              <div className={styles.pcEditNicknameCall}>
                <p className={styles.pcEditNicknameCallText}>{content}</p>
                {item.operation() || null}
              </div>
            )}
            {item.display === 'edit' && (
              <div className={item.display === 1 ? styles.pcEditAutographCall : styles.pcEditAutographBox}>
                <Input className={styles.pcEditAutographInput} placeholder="这个人很懒，什么也没留下~" />
                <div className={styles.preservation}>
                  <Button className={styles.preservationButton} type="primary" onClick={() => item.onSave}>
                    保存
                  </Button>
                  <Button className={styles.preservationButton2} onClick={() => this.modifyFun(index, 0)}>
                    取消
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  render() {
    const { editorConfig } = this.state;
    return (
      <div className={styles.pcEditBox}>
        <Header className={styles.pcEditHeaser} />
        <div className={styles.pcEditContent}>
          <div className={styles.pcEdit}>
            {/* 头部 */}
            <div>
              <UserCenterEditHeader />
            </div>
            {/* 资料展示 */}
            {editorConfig.map((item, index) => (
              <div key={index}>{this.editorialpresentation(item, item.type, index)}</div>
            ))}
          </div>
          <div className={styles.bottomText}>Powered By Discuz! Q © 2021 粤ICP备20008502号-1</div>
        </div>

        {/* Popups */}
        <>
          <UserCenterEditAccountPwd
            visible={this.state.accountEditorVisible}
            onClose={() => {
              this.setState({
                accountEditorVisible: false,
              });
            }}
          />
          <UserCenterEditMobile
            visible={this.state.mobileEditorVisible}
            onClose={() => {
              this.setState({
                mobileEditorVisible: false,
              });
            }}
          />
          <UserCenterEditPaypwd
            visible={this.state.payPwdEditorVisible}
            onClose={() => {
              this.setState({
                payPwdEditorVisible: false,
              });
            }}
          />
        </>
      </div>
    );
  }
}

export default index;
