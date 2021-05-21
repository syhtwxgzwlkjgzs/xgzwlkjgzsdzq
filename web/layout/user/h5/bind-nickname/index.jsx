import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Input, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import clearLoginStatus from '@common/utils/clear-login-status';
import PcBodyWrap from '../components/pc-body-wrap';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';

@inject('site')
@inject('user')
@inject('thread')
@inject('commonLogin')
@inject('nicknameBind')
@observer
class BindNicknameH5Page extends React.Component {
  handleNicknameChange = (e) => {
    this.props.nicknameBind.nickname = e.target.value;
  };

  handleBindButtonClick = async () => {
    try {
      await this.props.nicknameBind.bindNickname();
      this.props.commonLogin.needToSetNickname = false;
      Toast.success({
        content: '昵称设置成功',
        hasMask: false,
        duration: 1000,
      });

      setTimeout(() => {
        const { router } = this.props;
        const { needToCompleteExtraInfo: isNeedToCompleteExtraInfo } = router.query;

        const needToCompleteExtraInfo = this.props.commonLogin.needToCompleteExtraInfo || isNeedToCompleteExtraInfo;
        if (needToCompleteExtraInfo) {
          this.props.router.push('/user/supplementary');
          return;
        }
        // TODO: 这里的路由堆栈需要再梳理规则
        window.location.href = '/';
      }, 1000);
    } catch (e) {
      // 跳转状态页
      if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(e.Code, e.Message);
        this.props.router.push(`/user/status?statusCode=${e.Code}&statusMsg=${e.Message}`);
        return;
      }
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };

  render() {
    const { site, nicknameBind } = this.props;
    const { platform } = site;
    return (
      <PcBodyWrap>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo mode='login'/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.title : layout.pc_title}>设置昵称</div>
          <Input
            className={platform === 'h5' ? layout.input : layout.pc_input}
            value={nicknameBind.nickname}
            placeholder="昵称"
            clearable={true}
            onChange={this.handleNicknameChange}
          />
          <Button
            className={platform === 'h5' ? layout.button : layout.pc_button}
            type="primary"
            onClick={this.handleBindButtonClick}
          >
            下一步
          </Button>
          <div className={platform === 'h5' ? layout.functionalRegion : layout.pc_functionalRegion}>
            <span className={layout.clickBtn} onClick={() => {
              clearLoginStatus(); // 清除登录态
              window.location.replace('/');
            }}>
              退出登录
            </span>
          </div>
        </div>
      </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(BindNicknameH5Page);
