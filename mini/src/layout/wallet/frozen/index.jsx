import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import List from '@components/list';
import { time } from '@discuzq/sdk/dist/index';
import { diffDate } from '@common/utils/diff-date';
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
      height: '100vh'
    };
  }

  async componentDidMount() {
    const { getUserWalletInfo } = this.props.wallet;
    await getUserWalletInfo();
    this.fetchFreezeDetail()
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
  };

  render() {
    return (
      <View className={styles.container}>
        {/* <Header></Header> */}
        <List
          onRefresh={this.fetchFreezeDetail}
          noMore={this.state.page > this.state.totalPage}
          hasOnScrollToLower={true}
          height={this.state.height}
        >
          <View className={styles.header}>
            <View className={styles.record}>共有{this.state.totalCount}条记录</View>
            {/* TODO: 后台未返回涉及金额字段 */}
            <View className={styles.totalMoney}>涉及金额 <Text className={styles.totalMoneyNumber}>{this.props.wallet.walletInfo.freezeAmount} 元</Text></View>
          </View>
            <View className={styles.body}>
            {this.listRenderDataFilter().map((value) => (
              <View className={styles.content} key={value.id}>
                <View className={styles.upper}>
                  <View className={styles.title}>{value.title || value.changeDesc}</View>
                  <View className={styles.amount}>{value.amount}</View>
                </View>
                <View className={styles.lower}>
                  <View>{diffDate(time.formatDate(value.createdAt, 'YYYY-MM-DD'))}</View>
                  <View>
                    ID: <Text>{value.id}</Text>
                  </View>
                </View>
              </View>
            ))}
            </View>
        </List>
      </View>
    );
  }
}

export default FrozenAmount;
