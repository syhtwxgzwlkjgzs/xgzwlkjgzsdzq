import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Toast, Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import styles from './index.module.scss';
import JoinBanner from '@components/join-banner-pc';
import WeixinQrCode from '@components/login/wx-qr-code';
import { get } from '@common/utils/get';
import Router from '@discuzq/sdk/dist/router';
import PcBodyWrap from '../components/pc-body-wrap';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, isExtFieldsOpen } from '@common/store/login/util';
import { MOBILE_LOGIN_STORE_ERRORS } from '@common/store/login/mobile-login-store';

@inject('site')
@inject('user')
@inject('commonLogin')
@inject('h5QrCode')
@observer
class RebindPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      explain: [
        '电脑登录站点',
        '进入个人中心-编辑资料-微信换绑',
        '手机登录新微信扫码完成换绑'
      ],
      currentStatus: '',
      statusInfo: {
        success: '换绑成功',
        error: '网络错误'
      }
    };

    this.timer = null;
    this.isDestroy = false;
  }

  async componentDidMount() {
    this.props.site.platform === 'pc' && await this.generateQrCode();
  }

  componentWillUnmount() {
    this.isDestroy = true;
    clearInterval(this.timer);
  }

  async generateQrCode() {
    try {
      const { sessionToken, nickname } = this.props.router.query;
      const { platform, wechatEnv } = this.props.site;
      const qrCodeType = platform === 'h5' ? 'mobile_browser_bind' : 'pc_bind';
      const { user } = this.props;
      let name = nickname;
      if (user.loginStatus) {
        this.props.commonLogin.setUserId(user.id);
        name = user.nickname;
      }

      const redirectUri = `${wechatEnv === 'miniProgram' ? '/subPages/user/wx-auth/index' : `${window.location.origin}/user/wx-auth`}?loginType=${platform}&action=wx-bind&nickname=${name}`;
      await this.props.h5QrCode.generate({
        params: {
          sessionToken,
          type: wechatEnv === 'miniProgram' ? 'pc_bind_mini' : qrCodeType,
          redirectUri: encodeURIComponent(redirectUri),
        },
      });
      // 组件销毁后，不执行后面的逻辑
      if (this.isDestroy) {
        return;
      }
      this.queryLoginState(wechatEnv === 'miniProgram' ? 'pc_bind_mini' : qrCodeType);
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  queryLoginState(type) {
    this.timer = setInterval(async () => {
      try {
        const res = await this.props.h5QrCode.bind({
          type,
          params: { sessionToken: this.props.h5QrCode.sessionToken },
        });
        const uid = get(res, 'data.uid');
        this.props.user.updateUserInfo(uid);
        // FIXME: 使用 window 跳转用来解决，获取 forum 在登录前后不同的问题，后续需要修改 store 完成
        window.location.href = '/';
        clearInterval(this.timer);
      } catch (e) {
        const { site, h5QrCode, commonLogin, router } = this.props;
        if (h5QrCode.countDown > 0) {
          h5QrCode.countDown = h5QrCode.countDown - 3;
        } else {
          clearInterval(this.timer);
        }
        if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_COMPLETE_REQUIRED_INFO.Code) {
          if (isExtFieldsOpen(site)) {
            commonLogin.needToCompleteExtraInfo = true;
            router.push('/user/supplementary');
            return;
          }
          return window.location.href = '/';
        }
        // 跳转状态页
        if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
          const uid = get(e, 'uid', '');
          uid && this.props.user.updateUserInfo(uid);
          commonLogin.setStatusMessage(e.Code, e.Message);
          router.push(`/user/status?statusCode=${e.Code}&statusMsg=${e.Message}`);
        }
      }
    }, 3000);
  }

  render() {
    const { site, h5QrCode } = this.props;
    const { currentStatus, explain, statusInfo } = this.state;
    const { platform } = site;

    if (platform === 'h5') {
      return (
        <PcBodyWrap>
          <JoinBanner />
          <div className={styles.content}>
            <div className={styles.title}>换绑流程说明</div>
            {
              explain.map((item, index) => (
                <div key={index} className={styles.rebind_explain_list}>
                  <div className={styles.rebind_explain_index}>{index + 1}</div>
                  <div className={styles.rebind_explain_value}>{item}</div>
                </div>
              ))
            }
          </div>
        </PcBodyWrap>
      );
    }

    return (
      <PcBodyWrap>
      <div className={styles.pc_container}>
        <JoinBanner />
        <div
            className={styles.userCenterReturn}
            onClick={() => {
              Router.back();
            }}
          >
            <Icon name="ReturnOutlined" size={16} className={styles.userCenterReturnIcon} />
            返回我的主页
          </div>
        <div className={styles.pc_content}>
          <div className={styles.pc_title}>{currentStatus === 'success' ? '换绑成功' : '微信换绑'}</div>
          {/* 二维码 start */}
          {
            !currentStatus
            && <WeixinQrCode
                  refresh={() => {this.generateQrCode()}}
                  isValid={h5QrCode.isQrCodeValid}
                  orCodeImg={h5QrCode.qrCode}
                  orCodeTips='请用新微信扫码完成换绑'
                />
          }
          {/* 二维码 end */}
          {/* 状态图标 start */}
          {
            currentStatus
            && <div className={styles.statusWrap}>
                { currentStatus === 'success' && <Icon color='#3AC15F' name="SuccessOutlined" size={80} className={styles.statusIcon} /> }
                { currentStatus === 'error' && <Icon color='#E02433' name="WrongOutlined" size={80} className={styles.statusIcon} /> }
                <p className={styles.statusBottom}>
                  { currentStatus === 'success'
                    ? <>
                        <Icon name="FunnelOutlined" size={18} className={styles.statusBottomIcon} />
                        页面自动跳转中…
                        </>
                    : statusInfo.error
                  }
                </p>
              </div>
          }
          {/* 状态图标 end */}
        </div>

      </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(RebindPage);
