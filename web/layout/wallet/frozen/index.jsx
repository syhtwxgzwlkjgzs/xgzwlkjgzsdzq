import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

import styles from './index.module.scss';

import Header from '@components/header/h5';

// import { Tabs, Icon, Button } from '@discuzq/design';


@observer
class FrozenAmount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.frozenType = [
      '问答冻结',
      '长文贴红包冻结',
      '文字红包贴冻结',
    ];
  }

  render() {
    // 伪造的数据
    const frozenData = [
      {
        id: 1,
        type: 1,
        time: '2021-3-25 14:50',
        ID: 123456789,
      },
      {
        id: 2,
        type: 2,
        time: '2021-3-25 14:50',
        ID: 123456789,
      },
      {
        id: 3,
        type: 3,
        time: '2021-3-25 14:50',
        ID: 123456789,
      },
    ];

    return (
        <div className={styles.container}>
          <Header></Header>
          <div className={styles.header}>
            <div className={styles.record}>共有{3}条记录</div>
            <div className={styles.totalMoney}>涉及金额 {15.00}元</div>
          </div>
          <div className={styles.body}>
          {
            frozenData.map(value => (
              <div className={styles.content} key={value.id}>
                <div className={styles.upper}>
                  <div>问答冻结</div>
                  <div>1.00</div>
                </div>
                <div className={styles.lower}>
                  <div>2021-3-25 14:50</div>
                  <div>ID: <span>180617</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
    );
  }
}

export default withRouter(FrozenAmount);
