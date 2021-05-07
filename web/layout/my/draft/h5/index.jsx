import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class H5 extends React.Component {
  render() {
    return (
      <div>
        我的草稿h5页面
      </div>
    );
  }
}

export default H5;
