import React, { Component } from 'react'
import { inject } from 'mobx-react';
import layout from './index.module.scss';
import { get } from '@common/utils/get';
import SectionTitle from '@components/section-title'

@inject('site')
@inject('forum')
class SiteInfo extends Component {

  render() {
    const { site, forum } = this.props;
    const { userTotal, threadTotal, updataTime } = forum;
    // 站点介绍
    const siteIntroduction = get(site, 'webConfig.setSite.siteIntroduction', '');
    return (
      <div className={layout.site}>
        <SectionTitle isShowMore={false} icon={{ color: '#2469F6', name: 'NotepadOutlined' }} title="站点介绍" onShowMore={this.redirectToSearchResultUser} />
        <div className={layout.site_introduce}>
          {siteIntroduction}
        </div>
        <div className={layout.site_status}>
          <div className={layout.site_status_list}>
              <span className={layout.site_status_label}>更新</span>
              <span className={layout.site_status_item}>{updataTime}</span>
          </div>
          <div className={layout.site_status_list}>
              <span className={layout.site_status_label}>成员</span>
              <span className={layout.site_status_item}>{userTotal}</span>
          </div>
          <div className={layout.site_status_list}>
              <span className={layout.site_status_label}>主题</span>
              <span className={layout.site_status_item}>{threadTotal}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default SiteInfo;
