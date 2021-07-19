import React from 'react';
import RebindAuthorizationPage from '@layout/user/rebind-authorization';
import { inject } from 'mobx-react';
import Page from '@components/page';
import { getParamCode, getUserProfile } from '../common/utils';

@inject('site')
class RebindAuthorization extends React.Component {

  render() {
    return (
      <Page>
        <RebindAuthorizationPage />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default RebindAuthorization;
