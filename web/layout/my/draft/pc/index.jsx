import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class PC extends React.Component {
  render() {
    return (
      <div>
        我的草稿pc页面
      </div>
    );
  }
}

export default PC;
