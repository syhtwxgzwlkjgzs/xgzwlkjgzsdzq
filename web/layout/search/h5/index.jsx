import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class SearchPCPage extends React.Component {
  render() {
    return (
      <div>
        H5
      </div>
    );
  }
}

export default SearchPCPage;
