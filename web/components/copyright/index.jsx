import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class CopyRight extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { site } = this.props;
    if ( !site || !site.webConfig) return null;
    const { setSite } = site.webConfig;
    const clsName = this.props.center ? `${styles.container} ${styles.center}` : styles.container;
    return (
      <div className={clsName}>
        {setSite.siteRecord && <div className={styles.text}>{setSite.siteRecord}</div>}
        {setSite.siteRecordCode && <div className={styles.text}>{setSite.siteRecordCode}</div>}
      </div>
    );
  }
}

export default CopyRight;
