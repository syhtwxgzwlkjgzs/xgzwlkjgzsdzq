import React from 'react';
import { inject, observer } from 'mobx-react';
import MyDrafts from '@components/my-draft'
@inject('site')
@observer
class H5 extends React.Component {
  render() {
    return (
      <div>
        <MyDrafts></MyDrafts>
      </div>
    );
  }
}

export default H5;
