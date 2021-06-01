import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Icon, Toast, Avatar } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import { get } from '@common/utils/get';
import List from '@components/list';
import BaseLayout from '@components/base-layout';
import TrendingTopic from '@layout/search/pc/components/trending-topics';
import SidebarPanel from '@components/sidebar-panel';
import Copyright from '@components/copyright';

@inject('site')
@inject('forum')
@inject('search')
@inject('invite')
@observer
class InvitePCPage extends React.Component {
  async componentDidMount() {
    try {
      await this.props.invite.getInviteUsersList();
    } catch (e) {
      Toast.error({
        content: e.Message,
      });
    }
  }

  nextUsersPage = async () => {
    const { forum} = this.props;
    return await this.setUsersPageData(forum.userPage + 1);
  }

  setUsersPageData = async (page = 1) => {
    await this.props.invite.getInviteUsersList();
  }

  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => {
    const { inviteData } = this.props.invite;
    const { pageData = [] } = this.props.search.topics || { pageData: [] };
    return (
      <>
        <div className={layout.user_card_wrap}>
          <div className={layout.user_card_main}>
            <div className={layout.user_card_avatar}>
              <Avatar
                size={'big'}
                image={inviteData.avatar}
                text={inviteData.nickname && inviteData.nickname.substring(0, 1)}
              />
            </div>
            <div className={layout.user_card_info}>
              <div className={layout.user_info_name}>{inviteData.nickname}</div>
              <div className={layout.user_info_tag}>{inviteData.groupName}</div>
              <div className={layout.user_info_invite}>
                <div className={layout.invite_num}>
                  <div className={layout.invite_num_title}>已邀人数</div>
                  <div className={layout.invite_num_content}>{inviteData.totalInviteUsers}</div>
                </div>
                <div className={layout.invite_money}>
                  <div className={layout.invite_num_title}>赚得赏金</div>
                  <div className={layout.invite_num_content}>{inviteData.totalInviteBounties}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={layout.user_card_button}>邀请朋友</div>
        </div>
        <SidebarPanel
          title="好友"
          leftNum="18"
          noData={true}
          isLoading={false}
          onShowMore={this.redirectToSearchResultTopic}
        >
          <TrendingTopic data={pageData} onItemClick={this.onTopicClick}/>
        </SidebarPanel>
        <SidebarPanel
          title="粉丝"
          leftNum="2880"
          noData={true}
          isLoading={false}
          onShowMore={this.redirectToSearchResultTopic}
        >
          <TrendingTopic data={pageData} onItemClick={this.onTopicClick}/>
        </SidebarPanel>
        <Copyright/>
      </>
    );
  }
  render() {
    const { inviteData } = this.props.invite;
    return (
      <BaseLayout
        right={ this.renderRight }
      >
        <div className={layout.container}>
          <div className={layout.invite_list}>
            <div className={layout.invite_list_title}>
              <Icon size={16} name='IncomeOutlined' color='#FFC300'/>
              <span className={layout.title_text}>站点信息</span>
            </div>
            <div className={layout.invite_list_label}>
              <div className={layout.list_label_nickname}>成员昵称</div>
              <div className={layout.list_label_money}>获得赏金</div>
              <div className={layout.list_label_timer}>加入时间</div>
            </div>
            <div className={layout.invite_list_main}>
              {
                inviteData?.inviteUsersList?.map((item, index) => (
                  <div key={index} className={layout.list_main_wrap}>
                      <div className={layout.list_main_nickname}>
                        <Avatar
                          className={layout.user_value_avatar}
                          image={item.avatar}
                          size='small'
                          text={item?.nickname?.substring(0, 1)}
                        />
                        <div className={layout.user_value_name}>{item.nickname}</div>
                      </div>
                      <div className={layout.list_main_money}>+{item.bounty}</div>
                      <div className={layout.list_main_timer}>{item.joinedAt || '--'}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }
}

export default withRouter(InvitePCPage);
