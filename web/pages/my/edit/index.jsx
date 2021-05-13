import React, { Component } from 'react';
import UserCenterEditInfo from '@components/user-center-edit-info';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

function Index() {
  return (
    <div>
      <UserCenterEditInfo />
    </div>
  );
}

export default HOCFetchSiteData(Index);

