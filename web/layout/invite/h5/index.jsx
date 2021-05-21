import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Icon, Button, Toast, Avatar } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import { get } from '@common/utils/get';
import { ENV_CONFIG } from '@common/constants/site';

@inject('site')
@inject('user')
@inject('invite')
@observer
class InviteH5Page extends React.Component {
  async componentDidMount() {
    await this.props.invite.getInviteUsersList();
  }

  createInviteLink = async () => {
    try {
      await this.props.invite.createInviteLink();
      const clipboardObj = navigator.clipboard;
      await clipboardObj.writeText(`${window.location.origin}/forum/partner-invite?code=${this.props.invite.inviteLink}`);
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

  render() {
    const { inviteData } = this.props.invite;
    return (
      <>
        <div className={layout.content}>
          {/* 头部 start */}
          <div className={layout.header}></div>
          {/* 头部 end */}
          {/* 用户信息 start */}
          <div className={layout.user_info}>
            <div className={layout.user_info_author}>
              <Avatar
                size={'big'}
                image={inviteData.avatar}
                text={inviteData.nickname && inviteData.nickname.substring(0, 1)}
              />
            </div>
            <div className={layout.user_info_content}>
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
          {/* 用户信息 end */}
          {/* 邀请列表 start */}
          <div className={layout.invite_list}>
            <div className={layout.invite_list_title}>
              <Icon className={layout.invite_list_titleIcon} color='#FFC300' name='IncomeOutlined'/>
              <div className={layout.invite_list_titleText}>邀请列表</div>
            </div>
            <div className={layout.invite_list_header}>
              <span className={layout.invite_list_headerName}>成员昵称</span>
              <span className={layout.invite_list_headerMoney}>获得赏金</span>
              <span className={layout.invite_list_headerTime}>推广时间</span>
            </div>
            <div className={layout.invite_list_content}>
              {
                inviteData?.inviteUsersList?.map((item, index) => (
                  <div key={index} className={layout.invite_list_item}>
                      <div className={layout.invite_list_itemName}>
                        <img src={item.avatar} alt=""/>
                        <span>{item.nickname}</span>
                      </div>
                      <span className={layout.invite_list_itemMoney}>+{item.bounty}</span>
                      <span className={layout.invite_list_itemTime}>{item.joinedAt}</span>
                      <span className={layout.invite_list_itemLine}></span>
                  </div>
                ))
              }
              {
                inviteData?.inviteUsersList?.length
                  ? <></>
                  : <div className={layout.refreshView}>
                      <span>暂无信息</span>
                    </div>
              }
            </div>
          </div>
          {/* 邀请列表 end */}
          {/* 邀请朋友 start */}
          <div className={layout.invite_bottom}>
            <Button
              className={layout.invite_bottom_button}
              onClick={this.createInviteLink}
            >
              邀请朋友
            </Button>
          </div>
          {/* 邀请朋友 end */}
        </div>
      </>
    );
  }
}

export default withRouter(InviteH5Page);
