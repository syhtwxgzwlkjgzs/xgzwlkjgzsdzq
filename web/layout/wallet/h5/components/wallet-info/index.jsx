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
        <div className={`${this.props.webPageType === 'h5' ? styles.containerH5 : styles.containerPC}`}>
            {
                this.props.webPageType === 'PC'
                  ? <div className={styles.header}>
                    <Avatar
                      image=''
                      name='头像'
                      circle={true}
                      size={'large'}
                      className={styles.avatar}>
                    </Avatar>
                    <div className={styles.name}>Amber</div>
                </div> : ''
            }
            <div className={`${this.props.webPageType === 'h5' ? styles.totalAmountH5 : styles.totalAmountPC}`}>
                <div className={styles.moneyTitle}>当前总金额</div>
                <div className={styles.moneyNum}>11866.12</div>
            </div>
            <div className={`${this.props.webPageType === 'h5' ? styles.amountStatusH5 : styles.amountStatusPC}`}>
                <div className={styles.frozenAmount} onClick={this.props.onFrozenAmountClick}>
                    <div className={styles.statusTitle}>
                        <span>冻结金额</span>
                        {
                            this.props.webPageType === 'PC'
                              ? <Icon name={'RightOutlined'} size='10' className={styles.icon}></Icon> : ''
                        }
                    </div>
                    <div className={styles.statusNum}>80.12</div>
                </div>
                <div className={styles.withdrawalAmount}>
                    <div className={styles.statusTitle}>可提现金额</div>
                    <div className={styles.statusNum}>11786.00</div>
                </div>
            </div>
            {
                this.props.webPageType === 'PC'
                  ? <div className={styles.footer}>
                        <Button type={'text'} className={styles.button}>提现</Button>
                    </div> : ''
            }
        </div>
    );
  }
}

export default withRouter(WalletInfo);