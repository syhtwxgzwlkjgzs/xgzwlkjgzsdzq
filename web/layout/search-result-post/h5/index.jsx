import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class SearchResultPostH5Page extends React.Component {
  render() {
    return (
      <div>
        搜索帖子内容结果 H5
      </div>
    );
  }
}

export default SearchResultPostH5Page;
