import React from 'react';
import styles from './index.module.scss';
import { Toast } from '@discuzq/design';
// import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';

@inject('site')
@inject('user')
@observer
class PayPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      target: 0,
    };
    this.keyboardClickHander = this.keyboardClickHander.bind(this);
    this.renderPwdItem = this.renderPwdItem.bind(this);
  }

  componentDidMount() {}

  keyboardClickHander(e) {
    console.log(e, 'sssssssss_e');
    // const key = e.target.getAttribute('data-key');
    const key = e.target.dataset?.key;
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

  renderPwdItem() {
    const { list } = this.state;
    const nodeList = list.map((item, key) => (
      <View className={`${styles.payListItem} ${styles.activation}`} key={key}>
        {'*'}
      </View>
    ));
    if (nodeList.length < 6) {
      let curr = false;
      for (let i = nodeList.length; i < 6; i++) {
        if (!curr) {
          curr = true;
          nodeList.push(<View className={`${styles.payListItem} ${styles.curr}`} key={i}></View>);
        } else {
          nodeList.push(<View className={styles.payListItem} key={i}></View>);
        }
      }
    }

    return nodeList;
  }

  render() {
    const { setPwdTitle } = this.props;
    return (
      <View>
        <Text className={styles.title}>{setPwdTitle || '输入支付密码'}</Text>
        <View className={styles.payList}>{this.renderPwdItem()}</View>
        <View className={styles.keyboard} onClick={this.keyboardClickHander}>
          <View className={styles.line}>
            <View data-key="1" className={styles.column}>
              1
            </View>
            <View data-key="2" className={styles.column}>
              2
            </View>
            <View data-key="3" className={styles.column}>
              3
            </View>
          </View>
          <View className={styles.line}>
            <View data-key="4" className={styles.column}>
              4
            </View>
            <View data-key="5" className={styles.column}>
              5
            </View>
            <View data-key="6" className={styles.column}>
              6
            </View>
          </View>
          <View className={styles.line}>
            <View data-key="7" className={styles.column}>
              7
            </View>
            <View data-key="8" className={styles.column}>
              8
            </View>
            <View data-key="9" className={styles.column}>
              9
            </View>
          </View>
          <View className={styles.line}>
            <View className={`${styles.column} ${styles.special}`}></View>
            <View data-key="0" className={styles.column}>
              0
            </View>
            <View data-key="-1" className={`${styles.column} ${styles.special}`}>
              取消
            </View>
          </View>
        </View>
      </View>
    );
  }
}

// eslint-disable-next-line new-cap
export default PayPassword;
