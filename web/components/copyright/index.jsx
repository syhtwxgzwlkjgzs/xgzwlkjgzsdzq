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
    if ( !site || !site.webConfig) return null;
    const { setSite } = site.webConfig;
    const clsName = classnames(styles.container, {
      [`${styles.center}`]: center,
      [`${styles.line}`]: line,
    })
    return (
      <div className={clsName}>
        {setSite.siteRecord && <div className={styles.text}>{setSite.siteRecord}</div>}
        {setSite.siteRecordCode && <div className={styles.text}>{setSite.siteRecordCode}</div>}
      </div>
    );
  }
}

export default CopyRight;
