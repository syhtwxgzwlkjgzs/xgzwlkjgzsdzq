import React from 'react';
import UserCenterEditUserName from '../../../../components/user-center-edit-username/index';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

function index() {
  return (
    <div>
      <UserCenterEditUserName />
    </div>
  );
}

export default HOCFetchSiteData(HOCUserInfo(index));
