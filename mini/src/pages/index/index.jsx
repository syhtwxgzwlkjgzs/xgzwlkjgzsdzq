import React from 'react';
import IndexPage from '@layout/index';
import Page from '@components/page';
import withShare from '@common/utils/withShare'
@withShare({
  needLogin: true
})
class Index extends React.Component {
  render() {
    return (
      <Page>
        <IndexPage getThreadId={this.getThreadId}/>
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
