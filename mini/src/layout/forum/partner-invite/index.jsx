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
        invitorName: inviteCode.length === 32 ? '??????' : nickname,
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

    const INVITE_THREADLIST_SCOPE = 3;
    const threadList = await search.getThreadList({
      scope: INVITE_THREADLIST_SCOPE,
    });

     forum.setThreadsPageData(threadList);

    // ????????????????????????0???title???????????????????????????????????????????????????
    const isHot = !threadList?.pageData?.some(item => item.isSite);
    this.setState({
      isHot,
    });
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
          // data ?????????????????????
          amount: sitePrice,
          title: siteName,
          // type: user?.userInfo?.expiredAt ? 8 : 1, // ?????????8???????????????1.??????????????????
          type: 1
        },
        isAnonymous: false, // ????????????
        success: async () => {
          await user.updateUserInfo(user.id);
          await site.getSiteInfo();
          // page?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
          const path = getCurrentInstance().router.path;
          if (path === '/subPages/forum/partner-invite/index') {
            LoginHelper.restore();
          }
        }, // ??????????????????
        completed: (orderInfo) => {}, // ??????????????????(???????????????)
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
    const title = `${isHot ? '??????' : '??????'}????????????`

    return (
      <List className={layout.page} allowRefresh={false}>
        <HomeHeader hideInfo hideMinibar mode="join" />
        <View className={layout.content}>
          {/* ???????????? start */}
          <SiteInfo />
          {/* ???????????? end */}
          {/* ???????????? start */}
          <View className={layout.users}>
            <SectionTitle
              isShowMore={false}
              icon={{ type: 2, name: 'MemberOutlined' }}
              title="????????????"
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
          {/* ???????????? end */}
          {/* ?????????????????? start */}
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
          {/* ?????????????????? end */}
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
                  <View>{invitorName} ?????????????????????</View>
                  {/* {siteMode === 'pay' ? (<View>?????????????????? ??{(((10 - siteMasterScale) * sitePrice) / 10).toFixed(2)}</View>) : ('')} */}
                </View>
                <View className={layout.bottom_tips_arrows}></View>
              </View>
            ) : (
              <></>
            )}

            <View className={layout.bottom_button_wrap}>
              {siteMode === 'pay' ? (
                <View className={layout.bottom_title}>
                  { user.isLogin() ? <></> : <View>??????????????? <View className={layout.tips}>??{sitePrice}</View></View> }
                  <View className={!user.isLogin() ? layout.expire : ''}>?????????{ user.isLogin() ? '???' : ' '}<View className={layout.tips}>{siteExpire ? `${siteExpire}???` : '??????'}</View></View>
                </View>
              ) :
                <></>
              }
              <Button className={layout.bottom_button} onClick={this.handleJoinSite}>
                { user.isLogin() ? `${siteMode === 'pay' ? `??${sitePrice} ` : ''}????????????` : '????????????????????????'}
              </Button>
            </View>
          </View>
        </View>
      </List>
    );
  }
}

export default PartnerInviteH5Page;
