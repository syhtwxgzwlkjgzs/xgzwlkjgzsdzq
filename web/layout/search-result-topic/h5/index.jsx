import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class SearchResultTopicH5Page extends React.Component {
  render() {
    return (
      <div>
        搜索话题结果 H5
      </div>
    );
  }
}

export default SearchResultTopicH5Page;
