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

@inject('site')
@inject('user')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef(null);
  }

  // 点击头像去到他人页面
  handleOnClick = (item) => {
    Router.push({ url: `/user/${item.userId}` });
  };

  render() {
    const { user } = this.props;
    const { userShield = [] } = user || {};
    return (
      <div className={styles.shieldBox}>
        <Header />
        <div className={styles.titleBox}>{`共有${pageData.length}位用户`}</div>
        {pageData?.length ? (
          <List className={styles.list} noMore={currentPage >= totalPage}>
            {pageData.map((item, index) => (
              <div className={styles.haieldImg} key={index}>
                <div
                  className={styles.haieldImgBox}
                  onClick={() => {
                    this.handleOnClick(item);
                  }}
                >
                  <div className={styles.haieldImgHead}>
                    <Avatar className={styles.img} image={item.avatar} name={item.nickname} userId={item.userId} />
                    <p className={styles.haieldName}>{item.nickname}</p>
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
