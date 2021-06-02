import React from 'react';
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import Popup from '@discuzq/design/dist/components/popup/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import List from '@components/list';
import UserItem from '@components/thread/user-item';
import { get } from '@common/utils/get';
import layout from './index.module.scss';
// import UserCenterFriends from '@components/user-center-friends';
import { simpleRequest } from '@common/utils/simple-request';
// import Router from '@discuzq/sdk/dist/router';

@inject('site')
@inject('forum')
@inject('user')
@observer
class ForumH5Page extends React.Component {
  async componentDidMount() {
    await this.setUsersPageData(1);
  }

  nextUsersPage = async () => {
    const { forum } = this.props;
    return await this.setUsersPageData(forum.userPage + 1);
  };

  setUsersPageData = async (page = 1) => {
    const { forum } = this.props;
    const usersList = await simpleRequest('readUsersList', {
      params: {
        page,
        filter: {
          hot: 0,
        },
      },
    });
    forum.setUsersPageData(usersList);
  };

  // @TODO
  onUserClick = (id) => {
    // Router.push(`/user/${id}`);
  };

  render() {
    const { site, forum } = this.props;
    const { usersPageData = [], isNoMore } = forum;
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
        <HomeHeader showToolbar />
        <View className={layout.content}>
          {/* 站点介绍 start */}
          <View className={layout.list}>
            <View className={layout.label}>站点介绍</View>
            <View className={layout.right}>{siteIntroduction}</View>
          </View>
          {/* 站点介绍 end */}
          {/* 创建时间 start */}
          <View className={layout.list}>
            <View className={layout.label}>创建时间</View>
            <View className={layout.right}>{siteInstall}</View>
          </View>
          {/* 创建时间 end */}
          {/* 站点模式 start */}
          <View className={layout.list}>
            <View className={layout.label}>站点模式</View>
            <View className={layout.right}>{siteMode === 'public' ? '公开模式' : '付费模式'}</View>
          </View>
          {/* 站点模式 end */}
          {/* 站长 start */}
          <View className={layout.list}>
            <View className={layout.label}>站长</View>
            <View className={layout.right}>
              <View className={layout.forum_agent}>
                {siteAuthor.avatar ? (
                  <Avatar size="small" className={layout.forum_agent_img} image={siteAuthor.avatar} />
                ) : (
                  <></>
                )}
                <View className={layout.forum_agent_name}>{siteAuthor.username}</View>
              </View>
            </View>
          </View>
          {/* 站长 end */}
          {/* 成员 start */}
          <View className={layout.list}>
            <View className={layout.label}>成员</View>
            <View className={layout.right} onClick={() => forum.setIsPopup(true)}>
              <View className={layout.forum_member}>
                {usersPageData?.slice(0, 3).map((item) => (
                  <Avatar
                    size="small"
                    key={item.userId}
                    text={item.nickname.substring(0, 1)}
                    className={layout.forum_member_img}
                    image={item.avatar}
                  />
                ))}
                <Icon site={10} color="#8590A6" name="RightOutlined" />
              </View>
            </View>
          </View>
          {/* 成员 end */}
          {/* 我的角色 start */}
          <View className={layout.list}>
            <View className={layout.label}>我的角色</View>
            <View className={layout.right}>{this.props.user?.userInfo?.group?.groupName}</View>
          </View>
          {/* 我的角色 end */}
          {/* 当前版本 start */}
          <View className={layout.list}>
            <View className={layout.label}>当前版本</View>
            <View className={layout.right}>v2.1.20121231</View>
          </View>
          {/* 当前版本 end */}
        </View>
        {/* 成员列表弹出 */}
        <Popup
          position="bottom"
          visible={forum.isPopup}
          onClose={() => forum.setIsPopup(false)}
          containerClassName={layout.forum_users_popup}
        >
          <List
            className={layout.forum_users_list}
            onRefresh={this.nextUsersPage}
            noMore={isNoMore}
            immediateCheck={false}
          >
            {usersPageData?.map((user, index) => {
              if (index + 1 > this.props.limit) return null;
              return (
                <UserItem
                  key={index}
                  title={user.nickname}
                  imgSrc={user.avatar}
                  label={user.groupName}
                  userId={user.userId}
                  onClick={this.onUserClick}
                />
              );
            })}
          </List>
        </Popup>
      </>
    );
  }
}

export default ForumH5Page;
