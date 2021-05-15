import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import { withRouter } from 'next/router';
import HOCFetchSiteData from '../../middleware/HOCFetchSiteData'
import Router from '@discuzq/sdk/dist/router';

@inject('user')
@observer
class index extends Component {

  // 点击去到下一步
  goToResetPayPwd = () => {
    Router.push({url: `/my/edit/reset-paypwd`})
  }

  // 点击忘记密码
  handleGoToFindPayPwd = () => {
    Router.push({url: `/my/edit/find-paypwd`})
  }

  // 如果没有设置支付密码 显示设置支付密码
  renderSetPayPwd = () => {
    return (
      <div className={styles.content}>
        <h3>设置支付密码</h3>
        <div className={styles.paypwdInput}>
          <Input placeholder="请输入您的支付密码" mode="password" />
        </div>
      </div>
    )
  }

  // 渲染已经设置了支付密码内容
  renderCanPayPwd = () => {
    return (
      <div className={styles.content}>
        <h3>修改支付密码</h3>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}>
            <Input mode="password" placeholder="请输入原密码" />
          </div>
          <div onClick={this.handleGoToFindPayPwd} className={styles.tips}>忘记密码？</div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Header />
        {
          this.props.user?.canWalletPay ? this.renderCanPayPwd() : this.renderSetPayPwd()
        }
        <div className={styles.bottom}>
          {
            this.props.user?.canWalletPay ? <Button onClick={this.goToResetPayPwd} type={"primary"} className={styles.btn}>下一步</Button> : <Button type={"primary"} className={styles.btn}>确定</Button>
          }
        </div>
      </div>
    )
  }
}

export default HOCFetchSiteData(withRouter(index));
