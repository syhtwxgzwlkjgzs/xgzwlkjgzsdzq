import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Icon, Button } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import { get } from '@common/utils/get';

const testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@inject('site')
@observer
class InvitePCPage extends React.Component {
  render() {
    return (
      <>
        <div className={layout.content}>
          {/* 头部 start */}
          <div className={layout.header}></div>
          {/* 头部 end */}
          {/* 用户信息 start */}
          <div className={layout.user_info}>
            <img className={layout.user_info_author} src="/dzq-img/login-user.png" alt=""/>
            <div className={layout.user_info_content}>
              <div className={layout.user_info_name}>Amber</div>
              <div className={layout.user_info_tag}>官方团队</div>
              <div className={layout.user_info_invite}>
                <div className={layout.invite_num}>
                  <div className={layout.invite_num_title}>已邀人数</div>
                  <div className={layout.invite_num_content}>62</div>
                </div>
                <div className={layout.invite_money}>
                  <div className={layout.invite_num_title}>赚得赏金</div>
                  <div className={layout.invite_num_content}>1024.00</div>
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
                testArr.map((item, index) => (
                  <div key={index} className={layout.invite_list_item}>
                      <div className={layout.invite_list_itemName}>
                        <img src="/dzq-img/login-user.png" alt=""/>
                        <span>嘻嘻哈哈嘻嘻哈哈</span>
                      </div>
                      <span className={layout.invite_list_itemMoney}>+1288.00</span>
                      <span className={layout.invite_list_itemTime}>2020-10-28 10:42</span>
                      <span className={layout.invite_list_itemLine}></span>
                  </div>
                ))
              }
            </div>
          </div>
          {/* 邀请列表 end */}
          {/* 邀请朋友 start */}
          <div className={layout.invite_bottom}>
            <Button className={layout.invite_bottom_button}>邀请朋友</Button>
          </div>
          {/* 邀请朋友 end */}
        </div>
      </>
    )
  }
}

export default withRouter(InvitePCPage);
