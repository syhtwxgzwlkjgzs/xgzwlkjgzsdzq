import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import H5OthersUserCenter from '@layout/my/others-users/h5';
import PCOthersUserCenter from '@layout/my/others-users/pc';
import HOCFetchSiteData from '../../middleware/HOCFetchSiteData';
import ViewAdapter from '@components/view-adapter';

@inject('site')
@inject('user')
@observer
class Index extends Component {
  render() {
    return (
      <ViewAdapter
        h5={<H5OthersUserCenter />}
        pc={<PCOthersUserCenter />}
        title={this.props.user?.targetUserNickname ? `${this.props.user?.targetUserNickname}的主页` : '他人主页'}
      />
    );
  }
}

export default HOCFetchSiteData(Index);
