import React from 'react';
import styles from './index.module.scss';
import Header from '@components/header';
import { Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import CommonPayoffPwd from '../../common';

@inject('site')
@inject('user')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      target: 0,
    };
    this.keyboardClickHander = this.keyboardClickHander.bind(this);
  }

  updatePwd = (set_num, type) => {
    const { list = [] } = this.state;
    if (type == 'add') {
      let list_ = [...list];
      if (list.length >= 6) {
        list_ = list_.join('').substring(0, 5).split('');
      }
      this.setState(
        {
          list: [].concat(list_, [set_num]),
        },
        () => {
          if (this.state.list.length === 6) {
            // this.submitPwa();
            alert(`设置成功,密码为${this.state.list.join(',')}`);
          }
        },
      );
    } else if (type == 'delete') {
      this.setState({
        list: list.slice(0, list.length - 1),
      });
    }
  };

  keyboardClickHander(e) {
    const key = e.target.getAttribute('data-key');
    if (key == null) {
      return null;
    }
    const { list } = this.state;

    if (key === '-1') {
      this.setState({
        list: list.slice(0, list.length - 1),
      });
    } else if (list.length < 6) {
      this.setState(
        {
          list: [].concat(list, [key]),
        },
        () => {
          if (this.state.list.length === 6) {
            // this.submitPwa();
          }
        },
      );
    }
  }

  async submitPwa() {
    const { list } = this.state;
    const { router, user } = this.props;
    const { userInfo } = user;
    const { id } = userInfo;
    const { query } = router;
    const { token = '' } = query;
    ('');
    const data = {
      id,
      payPasswordToken: token,
      payPassword: list.join(''),
      payPasswordConfirmation: list.join(''),
    };
    if (!id) return;
    const target = Toast.loading({
      content: '提交中...',
      duration: 0,
    });

    const result = await user.updateUserInfo(id);
    target.hide();
    if (result) {
      Toast.error({
        content: '更新用户信息错误！',
        duration: 1000,
      });
    }
    router.back();
  }

  render() {
    const { list = [] } = this.state;
    return (
      <div>
        <Header />
        <CommonPayoffPwd list={list} updatePwd={this.updatePwd} />
        <div className={styles.keyboard} onClick={this.keyboardClickHander}>
          <div className={styles.line}>
            <div data-key="1" className={styles.column}>
              1
            </div>
            <div data-key="2" className={styles.column}>
              2
            </div>
            <div data-key="3" className={styles.column}>
              3
            </div>
          </div>
          <div className={styles.line}>
            <div data-key="4" className={styles.column}>
              4
            </div>
            <div data-key="5" className={styles.column}>
              5
            </div>
            <div data-key="6" className={styles.column}>
              6
            </div>
          </div>
          <div className={styles.line}>
            <div data-key="7" className={styles.column}>
              7
            </div>
            <div data-key="8" className={styles.column}>
              8
            </div>
            <div data-key="9" className={styles.column}>
              9
            </div>
          </div>
          <div className={styles.line}>
            <div className={`${styles.column} ${styles.special}`}></div>
            <div data-key="0" className={styles.column}>
              0
            </div>
            <div data-key="-1" className={`${styles.column} ${styles.special}`}>
              取消
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
