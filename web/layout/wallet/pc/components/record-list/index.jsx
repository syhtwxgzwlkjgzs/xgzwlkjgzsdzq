import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import Avatar from '@components/avatar';

import styles from './index.module.scss';

import { Icon, Button } from '@discuzq/design';


@observer
class WalletInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div className={styles.container}>
          <div className={styles.title}>
            <div className={styles.left}>收入明细</div>
            <div className={styles.rigth}>
              <div className={styles.type}>收入类型</div>
              <div className={styles.money}>收入金额</div>
              <div className={styles.time}>收入时间</div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.left}>那谁谁谁 打赏了你的主题</div>
            <div className={styles.rigth}>
              <div className={styles.type}>打赏收入</div>
              <div className={styles.money}>+{66.66}</div>
              <div className={styles.time}>{'2020-10-28 10:42'}</div>
            </div>
          </div>
        </div>
    );
  }
}

export default withRouter(WalletInfo);
