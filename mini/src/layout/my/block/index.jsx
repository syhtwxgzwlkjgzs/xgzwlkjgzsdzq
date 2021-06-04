import React from 'react';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import List from '@components/list';
import NoData from '@components/no-data';
import Spin from '@discuzq/design/dist/components/spin/index';
import Avatar from '@components/avatar';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

@inject('site')
@inject('user')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTop: false, // 列表位置
      loading: false,
      perPage: 20, // 定义每页显示条数
      height: '100%',
    };
  }

  async componentDidMount() {
    this.setState({
      loading: false,
      height: window.outerHeight - 95, // header 是 40px，留出 2px ，用以触发下拉事件
    });
    await this.props.user.getUserShieldList();
  }

  componentWillUnmount() {
    this.props.user.clearUserShield();
  }

  // 点击头像去到他人页面
  handleOnClick = (item) => {
    Router.push({ url: `/subPages/user/index?id=${item.denyUserId}` });
  };

  // 检查是否满足触底加载更多的条件
  checkLoadCondition() {
    const hasMorePage = this.props.user.userShieldTotalPage >= this.props.user.userShieldPage;
    if (this.state.loading) return false;
    if (!hasMorePage) return false;

    return true;
  }

  // 加载更多函数
  loadMore = async () => {
    await this.props.user.getUserShieldList();
    return;
  };

  render() {
    const { user } = this.props;
    const { userShield = [], userShieldPage, userShieldTotalCount, userShieldTotalPage } = user || {};
    return (
      <View className={styles.shieldBox}>
        {userShield.length > 0 && <View className={styles.titleBox}>{`共有${userShield.length}位用户`}</View>}
        {this.props.firstLoading && (
          <View className={styles.spinLoading}>
            <Spin type="spinner">加载中...</Spin>
          </View>
        )}
        {userShield?.length ? (
          <List
            height={this.state.height}
            immediateCheck={false}
            showPullDown={false}
            onRefresh={this.loadMore}
            noMore={userShieldTotalPage < userShieldPage}
          >
            <View className={styles.blockSplitLine} />
            {userShield.map((item, index) => (
              <View className={styles.haieldImg} key={index}>
                <View
                  className={styles.haieldImgBox}
                  onClick={() => {
                    this.handleOnClick(item);
                  }}
                >
                  <View className={styles.haieldImgHead}>
                    <Avatar className={styles.img} image={item.avatar} name={item.username} userId={item.denyUserId} />
                    <View className={styles.haieldName}>{item.nickname}</View>
                  </View>
                </View>
              </View>
            ))}
          </List>
        ) : (
          <>{!this.props.firstLoading && <NoData className={styles.noDataList} />}</>
        )}
      </View>
    );
  }
}

export default Index;
