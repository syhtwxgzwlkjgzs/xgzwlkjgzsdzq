import React from 'react';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
import Header from '@components/header';
import List from '@components/list';
import NoData from '@components/no-data';
import { Button, Spin } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import throttle from '@common/utils/thottle';
import BaseLayout from '@components/base-layout';

@inject('site')
@inject('user')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTop: false, // 列表位置
      perPage: 20, // 定义每页显示条数
      height: '100%',
    };
  }

  async componentDidMount() {
    this.setState({
      height: window.outerHeight - 40, // header 是 40px，留出 2px ，用以触发下拉事件
    });
    await this.props.user.getUserShieldList();
  }

  componentWillUnmount() {
    this.props.user.clearUserShield();
  }

  // 点击头像去到他人页面
  handleOnClick = (item) => {
    Router.push({ url: `/user/${item.denyUserId}` });
  };

  // 加载更多函数
  loadMore = async () => {
    await this.props.user.getUserShieldList();
    return;
  };

  render() {
    const { user } = this.props;
    const { userShield = [], userShieldPage, userShieldTotalCount, userShieldTotalPage } = user || {};
    return (
      <div className={styles.shieldBox}>
        <Header />
        {userShield.length > 0 && <div className={styles.titleBox}>{`共有${userShieldTotalCount}位用户`}</div>}
        <List
          height={this.state.height}
          immediateCheck={false}
          showPullDown={false}
          onRefresh={this.loadMore}
          noMore={userShieldTotalPage < userShieldPage}
        >
          <div className={styles.blockSplitLine} />
          {userShield.map((item, index) => (
            <div className={styles.haieldImg} key={index}>
              <div
                className={styles.haieldImgBox}
                onClick={() => {
                  this.handleOnClick(item);
                }}
              >
                <div className={styles.haieldImgHead}>
                  <Avatar className={styles.img} image={item.avatar} name={item.username} userId={item.denyUserId} />
                  <p className={styles.haieldName}>{item.nickname}</p>
                </div>
              </div>
            </div>
          ))}
        </List>
      </div>
    );
  }
}

export default withRouter(Index);
