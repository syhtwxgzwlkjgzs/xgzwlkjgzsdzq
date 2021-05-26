import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import List from '@components/list';
import NoData from '@components/no-data';
import { time } from '@discuzq/sdk/dist/index';
import { diffDate } from '@common/utils/diff-date';

import styles from './index.module.scss';

import Header from '@components/header/h5';

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
    const freezeRes = await this.props.wallet.getFreezeDetail();
    const { totalCount, totalPage } = freezeRes;
    const pageData = {
      totalCount,
      totalPage,
    };
    if (this.state.page <= totalPage) {
      pageData.page = this.state.page + 1;
    }
    this.setState(pageData);
  };

  render() {
    return (
      <div className={styles.container}>
        <Header></Header>
        <div className={styles.header}>
          <div className={styles.record}>共有{this.state.totalCount}条记录</div>
          {/* TODO: 后台未返回涉及金额字段 */}
          <div className={styles.totalMoney}>涉及金额 {this.props.wallet.walletInfo.freezeAmount} 元</div>
        </div>
        <List
          className={styles.body}
          onRefresh={this.fetchFreezeDetail}
          noMore={this.state.page > this.state.totalPage}
        >
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
        </List>
      </div>
    );
  }
}

export default withRouter(FrozenAmount);
