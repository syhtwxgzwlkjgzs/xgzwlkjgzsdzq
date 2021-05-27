import React from 'react';
import UserCenterEditResetPayPwd from '../../../../components/user-center-edit-paypwd/reset-paypwd/index';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

function index() {
  return (
    <div>
      <UserCenterEditResetPayPwd />
    </div>
  )
}

export default HOCFetchSiteData(HOCUserInfo(index));
