import React from 'react';
import { inject, observer } from 'mobx-react';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import List from '@components/list';
import { View, Button } from '@tarojs/components';
import Toast from '@discuzq/design/dist/components/toast/index';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import Spin from '@discuzq/design/dist/components/spin/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import NoData from '@components/no-data';
import SectionTitle from '@components/section-title';
import { get } from '@common/utils/get';
import ActiveUsers from '../../search/components/active-users';
import PopularContents from '../../search/components/popular-contents';
import layout from './index.module.scss';
import SiteInfo from '../site-info';
import PayBox from '@components/payBox';
import { simpleRequest } from '@common/utils/simple-request';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { readUser } from '@server';
import LoginHelper from '@common/utils/login-helper';

const MAX_THREAD_COUNT = 10

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
      isHot: false,
    };
  }

  setNavigationBarStyle = () => {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    })
  }

  async componentDidMount() {
    this.setNavigationBarStyle();
    
    try {
      await Promise.all([
        this.initInviteCode(),
        this.initUserList(),
        this.initThreadList()
      ]);
    } catch (e) {
      Toast.error({
        content: e?.Message || e,
        hasMask: false,
        duration: 1000,
      });
    }

    const { forum } = this.props;
    forum.setIsLoading(false);
  }

  async initInviteCode() {
    const { invite } = this.props;
    const { params } = getCurrentInstance().router;
    const { inviteCode } = params;

    if (inviteCode) {
      invite.setInviteCode(inviteCode);
      const inviteResp = await readUser({
        params: {
          pid: inviteCode.length === 32 ? 1 : inviteCode,
        },
      });

      const nickname = get(inviteResp, 'data.nickname', '');
      const avatar = get(inviteResp, 'data.avatarUrl', '');

      this.setState({
        invitorName: inviteCode.length === 32 ? '站长' : nickname,
        invitorAvatar: avatar,
      });
    }
  }

  async initUserList() {
    const { forum } = this.props;
    const usersList = await simpleRequest('readUsersList', {
      params: {
        filter: {
          hot: 1,
        },
      },
    });

    forum.setUsersPageData(usersList);
  }

  async initThreadList() {
    const { forum, search } = this.props;

    // 1.获取后台设置的付费推荐内容，最多10条。pay===1时，后台默认返回10条，无法修改
    const threadList = await search.getThreadList({
      site: 1, // 后台设置的热门推荐
      params: {
        pay: 1,
      },
    });

    // 2.推荐内容数量大于0则title为精彩内容预览，否则为热门内容预览
    this.setState({
      isHot: !(threadList?.pageData?.length > 0),
    });

    // 3.如果付费推荐少于MAX_THREAD_COUNT条，取热门推荐，凑齐MAX_THREAD_COUNT条
    if (threadList?.pageData?.length < MAX_THREAD_COUNT) {
      const repeatedIds = threadList?.pageData?.map(item => item.threadId);
      const hotThreads = await search.getThreadList({
        repeatedIds,
        params: {
          pay: 1,
        },
      });

      threadList?.pageData?.push(...hotThreads?.pageData?.slice(0, MAX_THREAD_COUNT - threadList?.pageData?.length));
    }

    forum.setThreadsPageData(threadList);
  }

  handleJoinSite = () => {
    const { user, site } = this.props;
    if (!user?.isLogin()) {
      LoginHelper.saveAndLogin();
      return;
    }

    const { setSite: { siteMode, sitePrice, siteName } = {} } = site.webConfig;
    if (siteMode === 'pay' && user.paid === false) {
      PayBox.createPayBox({
        data: {
          // data 中传递后台参数
          amount: sitePrice,
          title: siteName,
          // type: user?.userInfo?.expiredAt ? 8 : 1, // 续费传8，新付费传1.站点付费注册
          type: 1
        },
        isAnonymous: false, // 是否匿名
        success: async () => {
          await user.updateUserInfo(user.id);
          await site.getSiteInfo();
          // page组件做了跳转拦截。此处需要先判断一下当前是否仍滞留付费页，如果非滞留，则恢复登录前页面
          const path = getCurrentInstance().router.path;
          if (path === '/subPages/forum/partner-invite/index') {
            LoginHelper.restore();
          }
        }, // 支付成功回调
        completed: (orderInfo) => {}, // 支付完成回调(成功或失败)
      });
      return;
    }
    LoginHelper.restore();
  };

  render() {
    const { site, forum, invite, user } = this.props;
    const { inviteCode } = invite;
    const { webConfig } = site;
    const { setSite: { siteMode, siteExpire, sitePrice, siteMasterScale } = {} } = webConfig;
    const { usersPageData = [], threadsPageData = [], isLoading } = forum;
    const { invitorName, invitorAvatar, isHot } = this.state;

    const icon = { type: 3, name: isHot ? 'HotOutlined' : 'WonderfulOutlined' };
    const title = `${isHot ? '热门' : '精彩'}内容预览`

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
              onShowMore={this.handleJoinSite}
            />
            {!isLoading && usersPageData?.length ? (
              <ActiveUsers data={usersPageData} onItemClick={this.handleJoinSite} />
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
              icon={icon}
              title={title}
              onShowMore={this.handleJoinSite}
            />
            {!isLoading && threadsPageData?.length ? (
              <PopularContents data={threadsPageData} onItemClick={this.handleJoinSite} unifyOnClick={this.handleJoinSite} />
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
          <View className={layout.bottom}>
            {inviteCode ? (
              <View className={layout.bottom_tips}>
                {/* <img className={layout.bottom_tips_img} src={ invitorAvatar } alt=""/> */}
                <Avatar
                  size="small"
                  text={invitorName?.substring(0, 1)}
                  className={layout.bottom_tips_img}
                  image={invitorAvatar}
                  onClick={this.handleJoinSite}
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

            <View className={layout.bottom_button_wrap}>
              {siteMode === 'pay' ? (
                <View className={layout.bottom_title}>
                  { user.isLogin() ? <></> : <View>新用户加入 <View className={layout.tips}>¥{sitePrice}</View></View> }
                  <View className={!user.isLogin() ? layout.expire : ''}>有效期{ user.isLogin() ? '：' : ' '}<View className={layout.tips}>{siteExpire ? `${siteExpire}天` : '永久'}</View></View>
                </View>
              ) :
                <></>
              }
              <Button className={layout.bottom_button} onClick={this.handleJoinSite}>
                { user.isLogin() ? `${siteMode === 'pay' ? `¥${sitePrice} ` : ''}立即加入` : '登录浏览更多内容'}
              </Button>
            </View>
          </View>
        </View>
      </List>
    );
  }
}

export default PartnerInviteH5Page;
