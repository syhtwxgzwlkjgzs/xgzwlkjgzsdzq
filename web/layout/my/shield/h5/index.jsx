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
  render() {
    console.log(this.props, '数据');
    const data = [1,2,3,4];
    const url = 'https://discuz-service-test-1258344699.cos.ap-guangzhou.myqcloud.com/public/attachments/2021/04/15/JLaJTCQwFQMCUZ0qOeyjke9LXcf1zuQEjwTiI8Ul.jpg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDCJAnwjKjthEk6HBm6fwzhCLFRRBlsBxG%26q-sign-time%3D1620378001%3B1620464461%26q-key-time%3D1620378001%3B1620464461%26q-header-list%3Dhost%26q-url-param-list%3D%26q-signature%3D1095d4caaf7c39f102449f8aaaf4c308d43f8266&x-cos-security-token=abc&imageMogr2/thumbnail/500x500';
    return (
      <div className={styles.shieldBox}>
        <Header />
        <div className={styles.titleBox}>
          共有2位用户
        </div>
        {
          data?.length
            ? (
              <List
                className={styles.list}
                noMore={true}
              >
                {
                  data.map((item, index) => (
                    <div className={styles.haieldImg} key={index}>
                      <div className={styles.haieldImgBox}>
                        <div className={styles.haieldImgHead}>
                          <Avatar 
                            className={styles.img}
                            image={url}
                            name={'名字'}
                            userId={1}
                          />
                          <p className={styles.haieldName}>名字</p>
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