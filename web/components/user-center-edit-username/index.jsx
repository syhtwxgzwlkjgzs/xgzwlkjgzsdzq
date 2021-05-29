import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import Router from '@discuzq/sdk/dist/router';
import styles from './index.module.scss';

@inject('user')
@observer
export default class index extends Component {
  handleChangeNewUserName = (e) => {
    this.props.user.editUserName = e.target.value;
  };

  handleSubmit = async () => {
    try {
      await this.props.user.updateUsername();
      Toast.success({
        content: '修改用户名成功',
        duration: 1000
      })
      setTimeout(() => {
        Router.back();
      }, 1000);
    } catch (err) {
      console.log(err);
      if (err.Code) {
        Toast.error({
          content: err.Msg,
          duration: 1000
        });
      }
    }
  };

  render() {
    const { user } = this.props;
    const { editUserName } = user;
    return (
      <div id={styles.resetUserName}>
        <Header />
        <div className={styles.content}>
          <h3>设置新用户名</h3>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}>
              <Input
                value={editUserName}
                onChange={this.handleChangeNewUserName}
                placeholder="请输入新用户名"
                maxLength={30}
              />
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <Button full onClick={this.handleSubmit} type={'primary'} className={styles.btn}>
            提交
          </Button>
        </div>
      </div>
    );
  }
}
