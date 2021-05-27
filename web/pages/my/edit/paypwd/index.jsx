import React from 'react'
import UserCenterEditPayPwd from '../../../../components/user-center-edit-paypwd';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

function index() {
  return (
    <div>
      <UserCenterEditPayPwd />
    </div>
  )
}

export default HOCFetchSiteData(HOCUserInfo(index));
