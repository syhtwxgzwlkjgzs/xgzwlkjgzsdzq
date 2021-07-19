import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Toast, Icon } from '@discuzq/design';
import JoinBanner from '@components/join-banner-pc';
import LoadingBox from '@components/loading-box';
import PcBodyWrap from '../components/pc-body-wrap';
import styles from './index.module.scss';

@inject('site')
@observer
class RebindAuthorizationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStatus: '',
      statusInfo: {
        success: '扫码成功',
        error: '扫码失败'
      }
    };
  }

  render() {
    const { currentStatus, statusInfo } = this.state;
    return (
      <PcBodyWrap>
        <div className={styles.container}>
          <JoinBanner />
          <div className={styles.content}>
              { currentStatus === 'success' && <Icon color='#3AC15F' name="SuccessOutlined" size={80} className={styles.statusIcon} /> }
              { currentStatus === 'error' && <Icon color='#E02433' name="WrongOutlined" size={80} className={styles.statusIcon} /> }
              <p className={styles.statusBottom}>{ currentStatus && (currentStatus === 'success' ? statusInfo.success : statusInfo.error) }</p>
              { !currentStatus && <LoadingBox style={{ minHeight: '100%' }} />}
          </div>
        </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(RebindAuthorizationPage);
