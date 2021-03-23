import React from 'react';
import { inject, observer } from 'mobx-react';
@inject('site')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  render() {
    return (
        <div>
            <h1>PC</h1>
        </div>
    );
  }
}

export default IndexPCPage;
