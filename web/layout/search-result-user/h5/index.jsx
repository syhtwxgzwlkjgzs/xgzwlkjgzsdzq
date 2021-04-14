import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class SearchResultUserH5Page extends React.Component {
  render() {
    return (
      <div>
        搜索用户结果 H5
      </div>
    );
  }
}

export default SearchResultUserH5Page;
