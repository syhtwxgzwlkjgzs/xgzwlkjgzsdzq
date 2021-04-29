import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

@inject('site')
@observer
class H5CloseSite extends React.Component {
  render() {
    const { site } = this.props;
    const { closeSiteConfig } = site;

    return (
      <div className={styles.page}>
        <h1 className={styles.main}>关闭站点</h1>
        {closeSiteConfig && <p className={styles.sub}>{closeSiteConfig.detail}</p>}
      </div>
    );
  }
}


export default H5CloseSite;
