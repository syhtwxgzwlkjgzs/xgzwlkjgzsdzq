import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { time } from '@discuzq/sdk/dist/index';
import { diffDate } from '@common/utils/diff-date';
import BaseLayout from '@components/base-layout'

import styles from './index.module.scss';

@inject('wallet')
@observer
class FrozenAmount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      totalCount: 0,
      totalPage: 1,
    };
  }

  async componentDidMount() {
    const { getUserWalletInfo } = this.props.wallet;
    await getUserWalletInfo();
  }

  listRenderDataFilter = () => {
    if (Object.values(this.props.wallet.freezeDetail).length === 0) return [];
    return Object.values(this.props.wallet.freezeDetail).reduce((fullData, pageData) => [...fullData, ...pageData]);
  };

  fetchFreezeDetail = async () => {
    const freezeRes = await this.props.wallet.getFreezeDetail({
      page: this.state.page
    });
    const { totalCount, totalPage } = freezeRes;
    const pageData = {
      totalCount,
      totalPage,
    };
    if (this.state.page <= totalPage) {
      pageData.page = this.state.page + 1;
    }
    this.setState(pageData);

    return
  };

  render() {
    return (
      <BaseLayout
        className={styles.container}
        immediateCheck
        onRefresh={this.fetchFreezeDetail}
        noMore={this.state.page > this.state.totalPage}
      >
        <div className={styles.header}>
          <div className={styles.totalMoney}>共有{this.state.totalCount}条记录</div>
          {/* TODO: 后台未返回涉及金额字段 */}
          <div className={styles.totalMoney}>
            涉及金额 
            <span className={styles.num}>{this.props.wallet.walletInfo.freezeAmount}元</span> 
          </div>
        </div>
   
        {this.listRenderDataFilter().map(value => (
          <div className={styles.content} key={value.id}>
            <div className={styles.upper}>
              <div>{value.title || value.changeDesc}</div>
              <div>{value.amount}</div>
            </div>
            <div className={styles.lower}>
              <div>{diffDate(time.formatDate(value.createdAt, 'YYYY-MM-DD'))}</div>
              <div>
                ID: <span>{value.id}</span>
              </div>
            </div>
          </div>
        ))}
      </BaseLayout>
    );
  }
}

export default withRouter(FrozenAmount);
