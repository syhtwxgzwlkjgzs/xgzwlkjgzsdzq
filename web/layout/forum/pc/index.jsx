import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Icon, Avatar, ScrollView } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import BaseLayout from '@components/base-layout';
import Copyright from '@components/copyright';
import TrendingTopic from '@layout/search/pc/components/trending-topics';
import SidebarPanel from '@components/sidebar-panel';
import Time from '@discuzq/sdk/dist/time';
import UserCenterUsersPc from '@components/user-center/users-pc';
import { COMMON_PERMISSION, PERMISSION_PLATE } from '@common/constants/site';
import { simpleRequest } from '@common/utils/simple-request';
import { get } from '@common/utils/get';

@inject('site')
@inject('forum')
@inject('search')
@inject('user')
@observer
class ForumPCPage extends React.Component {
  async componentDidMount() {
    await this.setUsersPageData(1);
  }

  nextUsersPage = async () => {
    const { forum} = this.props;
    return await this.setUsersPageData(forum.userPage + 1);
  }

  setUsersPageData = async (page = 1) => {
    const { forum } = this.props;
    const usersList = await simpleRequest('readUsersList', {
      params: {
        page,
        perPage: 10,
        filter: {
          hot: 0,
        },
      },
    });
    forum.setUsersPageData(usersList);
  }

  onUserClick = (id) => {
    this.props.router.push(`/user/${id}`);
  };
  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => (
      <>
        <UserCenterUsersPc/>
        <Copyright/>
      </>
  );
  render() {
    const { site, forum, user } = this.props;
    const { platform } = site;
    const usersCount = forum.userTotal;
    // 站点介绍
    const siteIntroduction = get(site, 'webConfig.setSite.siteIntroduction', '');
    // 创建时间
    const siteInstall = get(site, 'webConfig.setSite.siteInstall', '');
    // 站点模式
    const siteMode = get(site, 'webConfig.setSite.siteMode', '');
    // 站长信息
    const siteAuthor = get(site, 'webConfig.setSite.siteAuthor', '');
    console.log(user);
    return (
      <BaseLayout
        right={ this.renderRight }
      >
        <div className={layout.container}>
          {/* 头部 start */}
          <div className={layout.title}>
            <Icon size={16} name='IncomeOutlined' color='#FFC300'/>
            <span className={layout.title_text}>站点信息</span>
          </div>
          {/* 头部 end */}
          {/* 站长 start */}
          <div className={layout.forum_agent}>
            <div className={layout.user_info_label}>
              <div className={layout.user_label_item}>站长</div>
              <div className={layout.user_label_item}>成员</div>
              <div className={layout.user_label_item}>内容</div>
              <div className={layout.user_label_item}>创建时间</div>
            </div>
            <div className={layout.user_info_value}>
              <div className={layout.user_value_item}>
                {
                  siteAuthor.avatar
                    ? <Avatar
                        size='small'
                        className={layout.user_value_avatar}
                        image={siteAuthor.avatar}
                      />
                    : <></>
                }
                <div className={layout.user_value_name}>{siteAuthor.username}</div>
              </div>
              <div className={layout.user_value_item}>{usersCount}</div>
              <div className={layout.user_value_item}>5778</div>
              <div className={layout.user_value_item}>{Time.formatDate(siteInstall, 'YYYY-MM-DD')}</div>
            </div>
          </div>
          {/* 站长 end */}
          {/* 站点介绍 start */}
          <div className={layout.site_introduction}>
            <div className={layout.mode_title}>站点介绍</div>
            <div className={layout.mode_text}>{siteIntroduction}</div>
          </div>
          {/* 站点介绍 end */}
          {/* 站点模式 start */}
          <div className={layout.site_mode}>
            <div className={layout.mode_title}>站点模式 \ 费用</div>
            <div className={layout.mode_text}>
                {
                  siteMode === 'public'
                    ? '公开模式 \\ 免费'
                    : '付费模式 \\ 付费'
                }
              </div>
          </div>
          {/* 站点模式 end */}
          {/* 我的角色 start */}
          <div className={layout.my_role}>
            <div className={layout.mode_title}>我的角色</div>
            <div className={layout.user_info_label}>
              <div className={layout.user_label_item}>头像</div>
              <div className={layout.user_label_item}>成员</div>
              <div className={layout.user_label_item}>内容</div>
              <div className={layout.user_label_item}>创建时间</div>
            </div>
            <div className={layout.user_info_value}>
              <div className={layout.user_value_item}>
                <Avatar
                  size='small'
                  text='1'
                  className={layout.user_value_avatar}
                  // image={item.avatar}
                />
              </div>
              <div className={layout.user_value_item}>1460</div>
              <div className={layout.user_value_item}>5778</div>
              <div className={layout.user_value_item}>2020-12-7</div>
            </div>
          </div>
          {/* 我的角色 end */}
          {/* 我的权限 start */}
          <div className={layout.my_permission}>
            <div className={layout.mode_title}>我的权限</div>
            {/* 权限板块 start */}
            <div className={layout.my_permission_plate}>
              {/* <div className={layout.plate_left_label}> */}
              <table className={layout.plate_left_label}>
                <thead>
                  <tr className={layout.plate_th}>
                    <td className={layout.plate_td}>版权模块</td>
                    <td className={layout.plate_td}>我是分类</td>
                    <td className={layout.plate_td}>我是分类/我是二级分类</td>
                    <td className={layout.plate_td}>我是分类</td>
                    <td className={layout.plate_td}>我是分类/我是二级分类</td>
                    <td className={layout.plate_td}>我是分类</td>
                    <td className={layout.plate_td}>我是分类/我是二级分类</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    PERMISSION_PLATE?.map((item, index) => (
                        <tr className={layout.plate_tr} key={index}>
                          <td className={layout.plate_td}>{item}</td>
                          <td className={layout.plate_td}>
                            <Icon size={16} color='#2469F6' name='CheckOutlined'/>
                          </td>
                          <td className={layout.plate_td}>
                            <Icon size={16} color='#2469F6' name='CheckOutlined'/>
                          </td>
                          <td className={layout.plate_td}>
                            <Icon size={16} color='#2469F6' name='CheckOutlined'/>
                          </td>
                          <td className={layout.plate_td}>
                            <Icon size={16} color='#2469F6' name='CheckOutlined'/>
                          </td>
                          <td className={layout.plate_td}>
                            <Icon size={16} color='#2469F6' name='CheckOutlined'/>
                          </td>
                          <td className={layout.plate_td}>
                            <Icon size={16} color='#2469F6' name='CheckOutlined'/>
                          </td>
                        </tr>
                    ))
                  }
                </tbody>
              </table>
              {/* </div> */}
            </div>
            <div className={layout.plate_right_scroll}></div>
            <div className={layout.plate_left_scroll}></div>
            <div className={layout.common_right_scroll}></div>
            {/* 权限板块 start */}
            {/* 通用权限 start */}
            <div className={layout.my_permission_common}>
              <div className={layout.permission_common_left}>通用权限</div>
              <div className={layout.permission_common_right}>
                <div className={layout.permission_common_label}>
                  {
                    COMMON_PERMISSION?.map((item, index) => (
                      <div className={layout.common_label_item} key={index}>{item}</div>
                    ))
                  }
                </div>
                <div className={layout.permission_common_value}>
                  {
                    COMMON_PERMISSION?.map((item, index) => (
                      <div className={layout.common_value_item} key={index}>
                        <Icon size={16} color='#2469F6' name='CheckOutlined'/>
                      </div>
                    ))
                  }
                </div>
                {/* <div className={layout.permission_common_scroll}>
                </div> */}
              </div>
            </div>
            {/* 通用权限 end */}
          </div>
          {/* 我的权限 end */}
        </div>
      </BaseLayout>
    )
  }
}

export default withRouter(ForumPCPage);
