import React from 'react';
import UserCenterEditAccountPwd from '../../../../components/user-center-edit-account-pwd';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

function index() {
  return (
    <div>
      <UserCenterEditAccountPwd />
    </div>
  )
}

export default HOCFetchSiteData(HOCUserInfo(index));
