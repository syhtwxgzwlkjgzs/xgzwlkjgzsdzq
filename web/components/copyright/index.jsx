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
    return (
      <div>
        {setSite.siteRecord && <div className={styles.text}>{setSite.siteRecord}</div>}
        {setSite.siteRecordCode && <div className={styles.text}>{setSite.siteRecordCode}</div>}

        <div className={styles.text}>Powered By Discuz! Q © 2021</div>
        <div className={styles.text}>粤ICP备20008502号-1</div>
      </div>
    );
  }
}

export default CopyRight;
