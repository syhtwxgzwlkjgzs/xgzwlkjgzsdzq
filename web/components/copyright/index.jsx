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
    const clsName = classnames(styles.container, {
      [`${styles.center}`]: center,
      [`${styles.line}`]: line,
      copyright: true,
    })
    return (
      <div className={clsName}>
        {setSite.siteRecord && <div className={styles.text}><a href="https://beian.miit.gov.cn/" target="_blank">{setSite.siteRecord}</a></div>}
        {setSite.siteRecordCode && <div className={styles.text}><a
          href={`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${setSite.siteRecordCode}`}
          target="_blank"
        >{setSite.siteRecordCode}</a></div>}
      </div>
    );
  }
}

export default CopyRight;
