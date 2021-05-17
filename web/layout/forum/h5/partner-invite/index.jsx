import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import List from '@components/list';
import { Button } from '@discuzq/design';
import NoData from '@components/no-data';
import SectionTitle from '@components/section-title';
import { get } from '@common/utils/get';
import ActiveUsers from '../../../search/h5/components/active-users';
import PopularContents from '../../../search/h5/components/popular-contents';
import layout from './index.module.scss';
import SiteInfo from '../site-info';

@inject('site')
@inject('index')
@inject('forum')
@inject('search')
@observer
class ParnerInviteH5Page extends React.Component {
  async componentDidMount() {
    const { forum, search } = this.props;
    const usersList = await forum.useRequest('readUsersList', {
      params: {
        filter: {
          hot: 1
        }
      }
    });
    const threadList = await search.getThreadList();

    forum.setUsersPageData(usersList);
    forum.setThreadsPageData(threadList);
  }

  onPostClick = data => console.log('post click', data);

  onUserClick = data => console.log('user click', data);

  render() {
    const { site, forum, router } = this.props;
    const { inviteCode = '我是邀请码' } = router.query;
    const { platform } = site;
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
                    <span className={layout.bottom_tips_text}>奶罩 邀请您加入站点，可获得返现 ¥120</span>
                    <span className={layout.bottom_tips_arrows}></span>
                </div>
                : <></>
            }
            <div className={layout.bottom_title}>有效期：<span>20天</span></div>
            <Button className={layout.bottom_button}>
              ¥1266 立即加入
            </Button>
          </div>
        </div>
      </List>
    )
  }
}

export default withRouter(ParnerInviteH5Page);
