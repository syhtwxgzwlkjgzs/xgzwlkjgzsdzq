import React from 'react';
import Card from '../index1';
import HomeHeader from '@components/home-header';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class SiteCard extends React.Component {
  getSiteInfo() {
    const { site } = this.props;
    const { webConfig } = site;
    const siteInfo = {
      countUsers: 0,
      countThreads: 0,
    };
    if (webConfig && webConfig.other) {
      siteInfo.countUsers = webConfig.other.countUsers;
      siteInfo.countThreads = webConfig.other.countThreads;
    }
    return siteInfo;
  }
  getBgHeaderStyle(bgColor) {
    const { site } = this.props;
    const siteData = site.webConfig || {};

    if (siteData.setSite?.siteBackgroundImage) {
      return { backgroundImage: `url(${siteData.setSite.siteBackgroundImage})` };
    }
    return (bgColor
      ? { background: bgColor }
      : { background: '#2469f6' }
    );
  }
  render() {
    const { bgColor = '', hideInfo = false, style = {}, digest = null, mode = '', site } = this.props;
    const { countUsers, countThreads } = this.getSiteInfo();
    return (
        <Card>
          <div
              className={`${styles.container} ${mode ? styles[`container_mode_${mode}`] : ''}`}
              style={{ ...style, ...this.getBgHeaderStyle(bgColor) }}
          >
            <ul className={styles.siteInfo}>
            {/* <img src="https://bbsv3.techo.chat/emoji/qq/haixiu.gif" alt=":--haixiu:emoji" /> */}
              <li className={styles.item}>
                <span className={styles.text}>成员</span>
                <span className={styles.content}>{countUsers}</span>
              </li>
              <li className={styles.item}>
                <span className={styles.text}>内容</span>
                <span className={styles.content}>{countThreads}</span>
              </li>
              <img crossOrigin="anonymous" src={'https://discuzq-img-1258344699.cos.ap-guangzhou.myqcloud.com/public/attachments/2021/07/14/070d18a8f8689095b92bd7b8fb1732df_blur.jpg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDCJAnwjKjthEk6HBm6fwzhCLFRRBlsBxG%26q-sign-time%3D1626349674%3B1626436134%26q-key-time%3D1626349674%3B1626436134%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3Daf364b8c1d95c173a499bd8803a5e69e6edc4c82&amp;imageMogr2/format/webp/quality/40/interlace/1'} />
            </ul>
          </div>
        </Card>
    );
  }
}

export default SiteCard;
