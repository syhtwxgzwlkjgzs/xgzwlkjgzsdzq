import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss'

export default class index extends Component {
  render() {
    return (
      <div>
        <Header />
        账户密码修改页面
      </div>
    )
  }
}
