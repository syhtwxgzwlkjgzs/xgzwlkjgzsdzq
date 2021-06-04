import React from 'react';
import { inject, observer } from 'mobx-react';
import MiniIndexPage from '@layout/my/block/index';
import Page from '@components/page';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  render() {
    return (
      <Page>
        <MiniIndexPage />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
