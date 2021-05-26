import React from 'react';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
import Header from '@components/header';
import List from '@components/list';
import NoData from '@components/no-data';
import { Button } from '@discuzq/design';
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
      loading: false,
      perPage: 20, // 定义每页显示条数
    }
  }

  async componentDidMount() {
    this.setState({
      loading: false,
    });
    await this.props.user.getUserShieldList()
  }

  // 点击头像去到他人页面
  handleOnClick = (item) => {
    Router.push({ url: `/user/${item.denyUserId}` });
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
    await this.props.user.getUserShieldList()
    return
  };


  render() {
    const { user } = this.props;
    const { userShield = [], userShieldPage, userShieldTotalCount, userShieldTotalPage } = user || {};
    // 
    return (
      <BaseLayout immediateCheck={false} showPullDown={false} onRefresh={this.loadMore} noMore={userShieldTotalPage < userShieldPage}>
        <div className={styles.titleBox}>{`共有${userShield.length}位用户`}</div>
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
                <p className={styles.haieldName}>{item.username}</p>
              </div>
            </div>
          </div>
        ))}
      </BaseLayout>
    )
    return (
      <div className={styles.shieldBox}>
        <Header />
        <div className={styles.titleBox}>{`共有${userShield.length}位用户`}</div>
        {userShield?.length ? (
          <List className={styles.list} onRefresh={this.loadMore} noMore={false}>
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
                    <p className={styles.haieldName}>{item.username}</p>
                  </div>
                  {/* <div className={styles.haieldName}>
                          <Button className={styles.haieldButton}>解除屏蔽</Button>
                        </div> */}
                </div>
              </div>
            ))}
          </List>
        ) : (
          <NoData />
        )}
      </div>
    );
  }
}

export default withRouter(Index);
