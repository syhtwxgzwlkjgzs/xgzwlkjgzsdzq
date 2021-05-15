import React from 'react';
import IndexPage from '@layout/index';
import Page from '@components/page';

class Index extends React.Component {
  render() {
    return (
      <Page>
        <IndexPage/>
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
