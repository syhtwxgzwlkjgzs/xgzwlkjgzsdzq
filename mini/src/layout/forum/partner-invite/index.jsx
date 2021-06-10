import React from 'react';
import { inject, observer } from 'mobx-react';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import List from '@components/list';
import { View, Button } from '@tarojs/components';
import Toast from '@discuzq/design/dist/components/toast/index';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import Spin from '@discuzq/design/dist/components/spin/index';
import NoData from '@components/no-data';
import SectionTitle from '@components/section-title';
import { get } from '@common/utils/get';
import ActiveUsers from '../../search/components/active-users';
import PopularContents from '../../search/components/popular-contents';
import layout from './index.module.scss';
import SiteInfo from '../site-info';
import { inviteDetail } from '@server';
import goToLoginPage from '@common/utils/go-to-login-page';
import PayBox from '@components/payBox';
import { simpleRequest } from '@common/utils/simple-request';
import Router from '@discuzq/sdk/dist/router';
import { getCurrentInstance } from '@tarojs/taro';

@inject('site')
@inject('index')
@inject('forum')
@inject('search')
@inject('user')
@inject('invite')
@observer
class PartnerInviteH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitorName: '',
      invitorAvatar: '/dzq-img/login-user.png',
    };
  }

  async componentDidMount() {
    try {
      const { forum, search, invite } = this.props;
      // 获取url上的inviteCode
      const { params } = getCurrentInstance().router;
      const { inviteCode } = params;
      if (inviteCode) invite.setInviteCode(inviteCode);
      
      const usersList = await simpleRequest('readUsersList', {
        params: {
          filter: {
            hot: 1,
          },
        },
      });
      const threadList = await search.getThreadList({
        params: {
          pay: 1,
        },
      });
      const inviteResp = await inviteDetail({
        params: {
          code: inviteCode,
        },
      });
      const nickname = get(inviteResp, 'data.user.nickname', '');
      const avatar = get(inviteResp, 'data.user.avatar', '');
      this.setState({
        invitorName: nickname,
        invitorAvatar: avatar,
      });

      forum.setUsersPageData(usersList);
      forum.setThreadsPageData(threadList);
      forum.setIsLoading(false);

    } catch (e) {
      Toast.error({
        content: e?.Message || e,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  gotoIndex = () => {
    Router.push({ url: '/pages/index/index' });
  };

  handleJoinSite = () => {
    const { user, site } = this.props;
    if (!user?.isLogin()) {
      goToLoginPage({ url: '/subPages/user/wx-auth/index' });
      return;
    }

    const { setSite: { siteMode, sitePrice, siteName } = {} } = site.webConfig;
    if (siteMode === 'pay' && user.paid === false) {
      PayBox.createPayBox({
        data: {
          // data 中传递后台参数
          amount: sitePrice,
          title: siteName,
          type: 1, // 站点付费注册
        },
        isAnonymous: false, // 是否匿名
        success: async () => {
        await user.updateUserInfo(user.id);
        await site.getSiteInfo();
        this.gotoIndex();
      }, // 支付成功回调
        completed: (orderInfo) => {}, // 支付完成回调(成功或失败)
      });
      return;
    }
    this.gotoIndex();
  };

  render() {
    const { site, forum, invite } = this.props;
    const { inviteCode } = invite;
    const { webConfig } = site;
    const { setSite: { siteMode, siteExpire, sitePrice, siteMasterScale } = {} } = webConfig;
    const { usersPageData = [], threadsPageData = [], isLoading } = forum;
    const { invitorName, invitorAvatar } = this.state;

    return (
      <List className={layout.page} allowRefresh={false}>
        <HomeHeader hideInfo hideMinibar mode="join" />
        <View className={layout.content}>
          {/* 站点信息 start */}
          <SiteInfo />
          {/* 站点信息 end */}
          {/* 站点用户 start */}
          <View className={layout.users}>
            <SectionTitle
              isShowMore={false}
              icon={{ type: 2, name: 'MemberOutlined' }}
              title="活跃用户"
              onShowMore={this.redirectToSearchResultUser}
            />
            {!isLoading && usersPageData?.length ? (
              <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
            ) : (
              <></>
            )}
            {!isLoading && !threadsPageData?.length ? <NoData /> : <></>}
            {isLoading ? (
              <View className={layout.spinner}>
                <Spin type="spinner" />
              </View>
            ) : (
              <></>
            )}
          </View>
          {/* 站点用户 end */}
          {/* 热门内容预览 start */}
          <View className={layout.hot}>
            <SectionTitle
              isShowMore={false}
              icon={{ type: 3, name: 'HotOutlined' }}
              title="热门内容预览"
              onShowMore={this.redirectToSearchResultPost}
            />
            {!isLoading && threadsPageData?.length ? (
              <PopularContents data={threadsPageData} onItemClick={this.onPostClick} />
            ) : (
              <></>
            )}
            {!isLoading && !threadsPageData?.length ? <NoData /> : <></>}
            {isLoading ? (
              <View className={layout.spinner}>
                <Spin type="spinner" />
              </View>
            ) : (
              <></>
            )}
          </View>
          {/* 热门内容预览 end */}
          <View className={layout.maskLayer}></View>
          <View className={layout.bottom}>
            {inviteCode ? (
              <View className={layout.bottom_tips}>
                {/* <img className={layout.bottom_tips_img} src={ invitorAvatar } alt=""/> */}
                <Avatar
                  size="small"
                  text={invitorName?.substring(0, 1)}
                  className={layout.bottom_tips_img}
                  image={invitorAvatar}
                />
                <View className={layout.bottom_tips_text}>
                  <View>{invitorName} 邀请您加入站点</View>
                  {/* {siteMode === 'pay' ? (<View>，可获得返现 ¥{(((10 - siteMasterScale) * sitePrice) / 10).toFixed(2)}</View>) : ('')} */}
                </View>
                <View className={layout.bottom_tips_arrows}></View>
              </View>
            ) : (
              <></>
            )}
            {(siteMode === 'pay' && siteExpire) ? (
              <View className={layout.bottom_title}>
                有效期：<View>{siteExpire}天</View>
              </View>
            ) : (
              <></>
            )}
            <Button className={layout.bottom_button} onClick={this.handleJoinSite}>
              {siteMode === 'pay' ? `¥${sitePrice}` : ''} 立即加入
            </Button>
          </View>
        </View>
      </List>
    );
  }
}

export default PartnerInviteH5Page;
