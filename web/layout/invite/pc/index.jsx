import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Icon, Toast, Avatar, Spin } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import NoData from '@components/no-data';
import BaseLayout from '@components/base-layout';
import UserCenterFansPc from '@components/user-center/fans-pc';
import UserCenterFriendPc from '@components/user-center/friend-pc';
import { numberFormat } from '@common/utils/number-format';
import Copyright from '@components/copyright';
import { copyToClipboard } from '@common/utils/copyToClipboard';

@inject('site')
@inject('forum')
@inject('search')
@inject('invite')
@observer
class InvitePCPage extends React.Component {
  containerRef = React.createRef(null);

  async componentDidMount() {
    try {
      const { invite } = this.props;
      await invite.getInviteUsersList();
      if (!this.containerRef.current) return;
      this.containerRef.current.addEventListener('scroll', this.loadMore);
    } catch (e) {
      Toast.error({
        content: e.Message,
      });
    }
  }

  // 清理，防止内存泄露
  componentWillUnmount() {
    if (!this.containerRef.current) return;
    this.containerRef.current.removeEventListener('scroll', this.loadMore);
  }

  // 检查是否满足触底加载更多的条件
  checkLoadCondition() {
    const { invite } = this.props;
    const hasMorePage = invite.totalPage >= (invite.currentPage + 1);
    if (invite.inviteLoading) return false;
    if (!hasMorePage) return false;
    return true;
  }

  // 加载更多函数
  loadMore = async () => {
    const { invite } = this.props;
    const scrollDom = this.containerRef.current;
    if (scrollDom.clientHeight + scrollDom.scrollTop === scrollDom.scrollHeight) {
      if (!this.checkLoadCondition()) return;
      return await invite.getInviteUsersList(invite.currentPage + 1);
    }
  };

  createInviteLink = async () => {
    try {
      const { invite } = this.props;
      await this.props.invite.createInviteLink();
      copyToClipboard(`${window.location.origin}/forum/partner-invite?inviteCode=${invite.inviteCode}`);
      Toast.success({
        content: '创建邀请链接成功',
        duration: 1000,
      });
    } catch (e) {
      Toast.error({
        content: e.Message,
      });
    }
  }


  nextUsersPage = async () => {
    const { forum } = this.props;
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
              <div className={layout.user_info_name} title={inviteData.nickname}>{inviteData.nickname}</div>
              <div className={layout.user_info_tag}>{inviteData.groupName}</div>
              <div className={layout.user_info_invite}>
                <div className={layout.invite_num}>
                  <div className={layout.invite_num_title}>已邀人数</div>
                  <div className={layout.invite_num_content} title={numberFormat(inviteData.totalInviteUsers)}>{numberFormat(inviteData.totalInviteUsers)}</div>
                </div>
                <div className={layout.invite_money}>
                  <div className={layout.invite_num_title}>赚得赏金</div>
                  <div className={layout.invite_num_content} title={inviteData.totalInviteBounties}>{inviteData.totalInviteBounties || 0}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={layout.user_card_button} onClick={this.createInviteLink}>邀请朋友</div>
        </div>
        <UserCenterFriendPc className={layout.user_center_wrap}/>
        <UserCenterFansPc  className={layout.user_center_wrap}/>
        <Copyright/>
      </>
    );
  }
  render() {
    const { inviteUsersList, inviteLoading, isNoData, currentPage, totalPage } = this.props.invite;
    return (
      <BaseLayout
        // noMore={currentPage >= totalPage}
        right={ this.renderRight }
        // onRefresh={this.loadMore}
        // showRefresh={false}
      >
        <div
          className={layout.container}
          ref={this.containerRef}
          // style={{
          //   overflow: 'scroll',
          // }}
        >
          <div className={layout.invite_list}>
            <div className={layout.invite_list_title}>
              <Icon size={16} name='IncomeOutlined' color='#FFC300'/>
              <span className={layout.title_text}>邀请列表</span>
            </div>
            <div className={layout.invite_list_label}>
              <div className={layout.list_label_nickname}>成员昵称</div>
              <div className={layout.list_label_money}>获得赏金</div>
              <div className={layout.list_label_timer}>加入时间</div>
            </div>
            <div className={layout.invite_list_main}>
              {
                inviteUsersList?.map((item) => (
                  <div key={item.toUserId} className={layout.list_main_wrap}>
                      <div className={layout.list_main_nickname}>
                        <Avatar
                          className={layout.user_value_avatar}
                          image={item.avatar}
                          size='small'
                          text={item?.nickname?.substring(0, 1)}
                        />
                        <div className={layout.user_value_name} title={item.nickname}>{item.nickname || '匿名'}</div>
                      </div>
                      <div className={layout.list_main_money} title={`+${item.bounty}`}><span>+{item.bounty}</span></div>
                      <div className={layout.list_main_timer} title={item.joinedAt}><span>{item.joinedAt || '--'}</span></div>
                  </div>
                ))
              }
              {isNoData && <NoData className={layout.invite_list_nodata} text='没有更多内容了'/>}
              {inviteLoading && <div className={layout.loadMoreContainer}><Spin type={'spinner'}>加载中 ...</Spin></div>}
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }
}

export default withRouter(InvitePCPage);
