import React from 'react';
import { inject, observer } from 'mobx-react';
import MyDrafts from '@components/my-draft'
@inject('site')
@observer
class PC extends React.Component {
  render() {
    return (
      <div>
        <MyDrafts pc ></MyDrafts>
      </div>
    );
  }
}

export default PC;
