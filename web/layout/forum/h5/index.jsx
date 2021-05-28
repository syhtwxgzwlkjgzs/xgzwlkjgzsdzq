import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Popup, Icon, Avatar } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import List from '@components/list';
import { get } from '@common/utils/get';
import layout from './index.module.scss';
import UserCenterFriends from '@components/user-center-friends';

@inject('site')
@inject('forum')
@inject('user')
@observer
class ForumH5Page extends React.Component {
  async componentDidMount() {
    const { forum ,site,user} = this.props;
    console.log(forum,site,user);
    const usersList = await forum.useRequest('readUsersList', {
      params: {
        filter: {
          hot: 0,
        },
      },
    });

    forum.setUsersPageData(usersList);
  }
  render() {
    const { site, forum } = this.props;
    const { platform } = site;
    const { usersPageData = [] } = forum;
    // 站点介绍
    const siteIntroduction = get(site, 'webConfig.setSite.siteIntroduction', '');
    // 创建时间
    const siteInstall = get(site, 'webConfig.setSite.siteInstall', '');
    // 站点模式
    const siteMode = get(site, 'webConfig.setSite.siteMode', '');
    // 站长信息
    const siteAuthor = get(site, 'webConfig.setSite.siteAuthor', '');
    return (
      <>
        {
          platform === 'h5'
            ? <>
                <Header/>
                <HomeHeader/>
              </>
            : <Header/>
        }
        <div className={layout.content}>
          {/* 站点介绍 start */}
          <div className={layout.list}>
            <div className={layout.label}>站点介绍</div>
            <div className={layout.right}>{siteIntroduction}</div>
          </div>
          {/* 站点介绍 end */}
          {/* 创建时间 start */}
          <div className={layout.list}>
            <div className={layout.label}>创建时间</div>
            <div className={layout.right}>{siteInstall}</div>
          </div>
          {/* 创建时间 end */}
          {/* 站点模式 start */}
          <div className={layout.list}>
              <div className={layout.label}>站点模式</div>
              <div className={layout.right}>
                {
                  siteMode === 'public'
                    ? '公开模式'
                    : '付费模式'
                }
              </div>
          </div>
          {/* 站点模式 end */}
          {/* 站长 start */}
          <div className={layout.list}>
            <div className={layout.label}>站长</div>
            <div className={layout.right}>
              <div className={layout.forum_agent}>
                {
                  siteAuthor.avatar
                    ? <Avatar size='small' className={layout.forum_agent_img} image={siteAuthor.avatar}/>
                    : <></>
                }
                <span className={layout.forum_agent_name}>{siteAuthor.username}</span>
              </div>
            </div>
          </div>
          {/* 站长 end */}
          {/* 成员 start */}
          <div className={layout.list}>
            <div className={layout.label}>成员</div>
            <div className={layout.right} onClick={() => forum.setIsPopup(true)}>
              <div className={layout.forum_member}>
                {
                    usersPageData.slice(0, 3).map(item => (
                      <Avatar size='small' key={item.userId} text={item.nickname.substring(0, 1)} className={layout.forum_member_img} image={item.avatar}/>
                    ))
                }
                <Icon site={10} color='#8590A6' name='RightOutlined'/>
              </div>
            </div>
          </div>
          {/* 成员 end */}
          {/* 我的角色 start */}
          <div className={layout.list}>
            <div className={layout.label}>我的角色</div>
            <div className={layout.right}>{this.props.user?.userInfo?.group?.groupName}</div>
          </div>
          {/* 我的角色 end */}
          {/* 当前版本 start */}
          <div className={layout.list}>
            <div className={layout.label}>当前版本</div>
            <div className={layout.right}>v2.1.20121231</div>
          </div>
          {/* 当前版本 end */}
        </div>
        {/* 成员列表弹出 */}
        <Popup
          position="bottom"
          visible={forum.isPopup}
          onClose={() => forum.setIsPopup(false)}
          containerClassName={layout.forum_users_popup}
        >
          <List
            className={layout.forum_users_list}
          >
            {usersPageData.map((user, index) => {
              if (index + 1 > this.props.limit) return null;
              return (
                <div key={index}>
                  <UserCenterFriends
                    id={user.id}
                    type='follow'
                    imgUrl={user.avatar}
                    withHeaderUserInfo={true}
                    userName={user.nickname}
                  />
                  <div></div>
                </div>
              );
            })}
          </List>
        </Popup>
      </>
    );
  }
}

export default withRouter(ForumH5Page);
