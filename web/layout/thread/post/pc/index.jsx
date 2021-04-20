import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@inject('user')
@inject('thread')
@observer
class ThreadPCPage extends React.Component {
  render() {
    return (
      <div>
        PC
      </div>
    );
  }
}

export default ThreadPCPage;
