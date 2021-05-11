import React from 'react';
import { inject } from 'mobx-react';
import { readCommentDetail } from '@server';
import { getCurrentInstance } from '@tarojs/taro';
import Frozen from '../../../layout/wallet/frozen/index';


class FrozenPage extends React.Component {

  render() {
    return <Frozen></Frozen>
  }
}

export default FrozenPage;
