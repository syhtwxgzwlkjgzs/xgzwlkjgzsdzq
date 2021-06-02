import React from 'react';
import InviteH5Page from '@layout/invite';
import Page from '@components/page';
import withShare from '@common/utils/withShare/withShare';

@withShare({})
class Invite extends React.Component {
  // 配置邀请好友地址
  $getShareData(data) {
    return {
      path: data.path,
    };
  }

  render() {
    return (
      <Page>
        <InviteH5Page />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Invite;
