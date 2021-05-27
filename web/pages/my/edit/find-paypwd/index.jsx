import React from 'react';
import UserCenterEditFindPayPwd from '../../../../components/user-center-edit-paypwd/find-paypwd/index';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

function index() {
  return (
    <div>
      <UserCenterEditFindPayPwd />
    </div>
  )
}

export default HOCFetchSiteData(HOCUserInfo(index));