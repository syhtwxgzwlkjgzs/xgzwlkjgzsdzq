import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import H5UserCenterEditInfo from './h5/index';
import PcUserCenterEditInfo from './pc/index';
import HOCFetchSiteData from '../../middleware/HOCFetchSiteData';

@inject('site')
@inject('user')
@observer
class index extends Component {
  componentDidMount() {
    // 如果缺失 userInfo，页面中进行一次初始化获取
    if (!this.props.user.userInfo) {
      this.props.user.updateUserInfo(this.props.user.id);
    }
  }
  
  render() {
    const { site } = this.props;
    const { platform } = site;
    return (
      <div>
        {
          platform === 'h5' && (
            <H5UserCenterEditInfo />
          )
        }
        {
          platform === 'pc' && (
            <PcUserCenterEditInfo />
          )
        }
      </div>
    )
  }
}

export default HOCFetchSiteData(index)

