import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class SearchResultPCPage extends React.Component {
  render() {
    return (
      <div>
        PC
      </div>
    );
  }
}

export default SearchResultPCPage;
