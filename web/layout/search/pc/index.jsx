import React from 'react';
import { inject, observer } from 'mobx-react';
import ThreadContent from '@components/thread';

@inject('site')
@observer
class SearchPCPage extends React.Component {
  render() {
    return <ThreadContent />;
  }
}

export default SearchPCPage;
