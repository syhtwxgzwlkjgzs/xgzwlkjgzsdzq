import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import List from '@components/list';
import { Button, Toast } from '@discuzq/design';
import NoData from '@components/no-data';
import SectionTitle from '@components/section-title';
import { get } from '@common/utils/get';
import ActiveUsers from '../../../search/h5/components/active-users';
import PopularContents from '../../../search/h5/components/popular-contents';
import layout from './index.module.scss';
import SiteInfo from '../site-info';
import { inviteDetail } from '@server';
import goToLoginPage from '@common/utils/go-to-login-page';
import PayBox from '@components/payBox';

@inject('site')
@inject('index')
@inject('forum')
@inject('search')
@inject('user')
@observer
class PartnerInviteH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.invitorName = '';
  }
  async componentDidMount() {
    try {
      const { forum, search } = this.props;
      const usersList = await forum.useRequest('readUsersList', {
        params: {
          filter: {
            hot: 1,
          },
        },
      });
      const threadList = await search.getThreadList();
      const { inviteCode } = this.props.router.query;
      const { user: {nickname = ''} } = await inviteDetail({ code: inviteCode });
      this.invitorName = nickname;

      forum.setUsersPageData(usersList);
      forum.setThreadsPageData(threadList);
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  onPostClick = data => console.log('post click', data);

  onUserClick = data => console.log('user click', data);

  handleJoinSite = () => {
    const { user, site } = this.props;
    if (!user?.isLogin()) {
      goToLoginPage({ url: '/user/login', query: { inviteCode: this.inviteCode } });
      return;
    }
    const { setSite: { siteMode, sitePrice, siteName } = {} } = site.webConfig;

    if (siteMode === 'pay' && user.paid === false) {
      PayBox.createPayBox({
        data: {      // data 中传递后台参数
          amount: sitePrice,
          title: siteName,
          type: 1, // 付费注册
        },
        isAnonymous: false, // 是否匿名
        success: (orderInfo) => {
          Toast.success({
            content: `订单 ${orderInfo.orderSn} 支付成功, 即将进入站点`,
            hasMask: false,
            duration: 3000,
          });
          setTimeout(() => {
            window.location.href = '/';
          }, 3100);
        }, // 支付成功回调
        failed: (orderInfo) => {
          Toast.error({
            content: `订单 ${orderInfo.orderSn} 支付失败`,
            hasMask: false,
            duration: 2000,
          });
        }, // 支付失败回调
        completed: (orderInfo) => {}, // 支付完成回调(成功或失败)
      });
      return;
    }
    window.location.href = '/';
  }

  render() {
    const { site, forum } = this.props;
    const inviteCode = this.inviteCode || '1';
    const { platform, webConfig } = site;
    const { setSite: { siteMode, siteExpire, sitePrice, siteMasterScale } = {} } = webConfig;
    const { usersPageData, threadsPageData } = forum;
    return (
      <List className={layout.page} allowRefresh={false}>
        {
          platform === 'h5'
            ? <HomeHeader/>
            : <Header/>
        }
        <div className={layout.content}>
          {/* 站点信息 start */}
          <SiteInfo/>
          {/* 站点信息 end */}
          {/* 站点用户 start */}
          <div className={layout.users}>
          <SectionTitle isShowMore={false} icon={{ type: 2, name: 'MemberOutlined' }} title="活跃用户" onShowMore={this.redirectToSearchResultUser} />
            {
              usersPageData?.length
                ? <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
                : <NoData />
            }
          </div>
          {/* 站点用户 end */}
          {/* 热门内容预览 start */}
          <div className={layout.hot}>
            <SectionTitle isShowMore={false} icon={{ type: 3, name: 'HotOutlined' }} title="热门内容预览" onShowMore={this.redirectToSearchResultPost} />
            {
              threadsPageData?.length
                ? <PopularContents data={threadsPageData} onItemClick={this.onPostClick} />
                : <NoData />
            }
          </div>
          {/* 热门内容预览 end */}
          <div className={layout.bottom}>
            {
              inviteCode
                ? <div className={layout.bottom_tips}>
                    <img className={layout.bottom_tips_img} src="/dzq-img/login-user.png" alt=""/>
                    <span className={layout.bottom_tips_text}>
                      <span>{this.invitorName} 邀请您加入站点</span>
                      {siteMode === 'pay' ? <span>，可获得返现 ¥{((10 - siteMasterScale) * sitePrice / 10).toFixed(2)}</span> : ''}
                    </span>
                    <span className={layout.bottom_tips_arrows}></span>
                </div>
                : <></>
            }
            {siteMode === 'pay' ? <div className={layout.bottom_title}>有效期：{siteExpire}<span>天</span></div> : <></>}
            <Button className={layout.bottom_button} onClick={this.handleJoinSite}>
              {siteMode === 'pay' ? `¥${sitePrice}` : ''} 立即加入
            </Button>
          </div>
        </div>
      </List>
    );
  }
}

export default withRouter(PartnerInviteH5Page);
