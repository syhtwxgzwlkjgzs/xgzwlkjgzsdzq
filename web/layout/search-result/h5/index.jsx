import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class SearchResultH5Page extends React.Component {
  render() {
    return (
      <div>
        搜索结果页面 H5
      </div>
    );
  }
}

export default SearchResultH5Page;
