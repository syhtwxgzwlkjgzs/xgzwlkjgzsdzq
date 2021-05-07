import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Popup, Icon } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { get } from '@common/utils/get';


@inject('site')
@inject('forum')
@observer
class StatusH5Page extends React.Component {
  render() {
    const { site, forum } = this.props;
    const { platform } = site;
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
            ? <HomeHeader/>
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
                    ? <img className={layout.forum_agent_img} src={siteAuthor.avatar} alt=""/>
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
                <img className={layout.forum_member_img} src="/dzq-img/login-user.png" alt=""/>
                <img className={layout.forum_member_img} src="/dzq-img/login-user.png" alt=""/>
                <img className={layout.forum_member_img} src="/dzq-img/login-user.png" alt=""/>
                <Icon site={10} color='#8590A6' name='RightOutlined'/>
              </div>
            </div>
          </div>
          {/* 成员 end */}
          {/* 我的角色 start */}
          <div className={layout.list}>
            <div className={layout.label}>我的角色</div>
            <div className={layout.right}>UI专用</div>
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
        >
          <h1>成员</h1>
        </Popup>
      </>
    )
  }
}

export default withRouter(StatusH5Page);
