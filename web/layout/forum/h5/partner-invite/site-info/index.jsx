import React, { Component } from 'react'
import { inject } from 'mobx-react';
import layout from './index.module.scss';
import { get } from '@common/utils/get';
import SectionTitle from '@components/section-title'
import { numberFormat } from '@common/utils/number-format';
import { getSiteUpdateTime } from '@common/utils/get-site-uptade-time';

@inject('site')
@inject('forum')
class SiteInfo extends Component {

  render() {
    const { site, updataTime, threadTotal } = this.props;
    const { platform } = site;
    // 站点介绍
    const siteIntroduction = get(site, 'webConfig.setSite.siteIntroduction', '');
    return (
      <div className={`${layout.site} ${platform === 'pc' && layout.pc_site}`}>
        <SectionTitle className={platform === 'pc' && layout.pc_site_title} isShowMore={false} icon={{ color: '#2469F6', name: 'IntroduceOutlined' }} title="站点介绍" onShowMore={this.redirectToSearchResultUser} />
        <div className={layout.site_introduce}>
          {siteIntroduction}
        </div>
        {
          platform === 'h5'
            ? (
              <div className={layout.site_status}>
                <div className={layout.site_status_list}>
                    <span className={layout.site_status_label}>更新</span>
                    <span className={layout.site_status_item}>{updataTime && getSiteUpdateTime(updataTime)}</span>
                </div>
                <div className={layout.site_status_list}>
                    <span className={layout.site_status_label}>成员</span>
                    <span className={layout.site_status_item}>{numberFormat(site?.webConfig?.other?.countUsers)}</span>
                </div>
                <div className={layout.site_status_list}>
                    <span className={layout.site_status_label}>主题</span>
                    <span className={layout.site_status_item}>{numberFormat(threadTotal)}</span>
                </div>
              </div>
            )
            : <></>
        }
      </div>
    )
  }
}

export default SiteInfo;
