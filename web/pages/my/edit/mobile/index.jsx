import React from 'react'
import UserCenterEditMobile from '../../../../components/user-center-edit-mobile/index';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCTencentCaptcha from '@middleware/HOCTencentCaptcha';

function index(props) {
  return (
    <div>
      <UserCenterEditMobile {...props} />
    </div>
  )
}

export default HOCFetchSiteData(HOCUserInfo(HOCTencentCaptcha(index)));
