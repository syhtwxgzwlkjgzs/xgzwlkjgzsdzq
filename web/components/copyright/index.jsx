import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

@inject('site')
@observer
class CopyRight extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { site, center, line } = this.props;
    if ( !site || !site.webConfig || !site.webConfig.setSite) return null;

    const { setSite } = site.webConfig;

    const { platform } = site;
    const isH5 = platform === 'h5';

    const clsName = classnames(styles.container, {
      copyright: true,
      [styles.center]: center || isH5,
      [styles.h5]: isH5
    })

    const curSiteUrl = window.location.origin;
    const curYear = new Date().getFullYear();

    return (
      <div className={clsName}>
        <div className={styles.text}>
          <a href="https://discuz.chat" target="_blank">
            Powered By Discuz！Q
          </a>
        </div>
        <div className={styles.text}>
          <a href={curSiteUrl} target="_blank">
            &copy; {curYear} {setSite.siteName}
          </a>
        </div>
        {
          setSite.siteRecordCode && (
            <div className={styles.text}>
              <a href={`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${setSite.siteRecordCode}`} target="_blank">
                {setSite.siteRecordCode}
              </a>
            </div>
          )
        }
      </div>
    );
  }
}

export default CopyRight;
