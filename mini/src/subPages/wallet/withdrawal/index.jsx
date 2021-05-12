import React from 'react';
import { inject } from 'mobx-react';
import { readCommentDetail } from '@server';
import { getCurrentInstance } from '@tarojs/taro';
import Withdrawal from '../../../layout/wallet/withdrawal/index';


class WithdrawalPage extends React.Component {

  render() {
    return <Withdrawal></Withdrawal>
  }
}

export default WithdrawalPage;
