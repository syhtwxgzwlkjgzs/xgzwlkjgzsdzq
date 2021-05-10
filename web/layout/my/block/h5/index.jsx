import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import Header from '@components/header';
import List from '@components/list';
import NoData from '@components/no-data';
import { Button } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { search } = this.props;
    const { pageData = [], currentPage, totalPage } = search.users;
   
    return (
      <div className={styles.shieldBox}>
        <Header />
        <div className={styles.titleBox}>
          {`共有${pageData.length}位用户`}
        </div>
        {
          pageData?.length
            ? (
              <List
                className={styles.list}
                noMore={currentPage >= totalPage}
              >
                {
                  pageData.map((item, index) => (
                    <div className={styles.haieldImg} key={index}>
                      <div className={styles.haieldImgBox}>
                        <div className={styles.haieldImgHead}>
                          <Avatar 
                            className={styles.img}
                            image={item.avatar}
                            name={item.nickname}
                            userId={item.userId}
                          />
                          <p className={styles.haieldName}>{item.nickname}</p>
                        </div>
                        <div className={styles.haieldName}>
                          <Button className={styles.haieldButton}>解除屏蔽</Button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </List>
            )
            : <NoData />
        }
      </div>
    );
  }
}

export default withRouter(Index);