import React from 'react'
import UserCenterEditMobile from '../../../../components/user-center-edit-mobile/index';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

function index() {
  return (
    <div>
      <UserCenterEditMobile />
    </div>
  )
}

export default HOCFetchSiteData(HOCUserInfo(index));
