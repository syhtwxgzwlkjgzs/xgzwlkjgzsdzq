import React from 'react'
import UserCenterEditMobile from '../../../../components/user-center-edit-mobile/index';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCTencentCaptcha from '@middleware/HOCTencentCaptcha';
import ViewAdapter from '@components/view-adapter';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class EditMobilePage extends React.Component {
  render() {
    return <ViewAdapter
      h5={(
        <div>
          <UserCenterEditMobile {...this.props} />
        </div>
      )}
      pc={null}
      title={`修改手机 - ${this.props.site?.siteName}`}
    />
  }
}

export default HOCFetchSiteData(HOCUserInfo(HOCTencentCaptcha(EditMobilePage)));
