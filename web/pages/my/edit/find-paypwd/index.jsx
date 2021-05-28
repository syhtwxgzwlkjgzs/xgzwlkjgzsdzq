import React from 'react';
import UserCenterEditFindPayPwd from '../../../../components/user-center-edit-paypwd/find-paypwd/index';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCTencentCaptcha from '@middleware/HOCTencentCaptcha';

function index(props) {
  return (
    <div>
      <UserCenterEditFindPayPwd {...props} />
    </div>
  )
}

export default HOCFetchSiteData(HOCUserInfo(HOCTencentCaptcha(index)));