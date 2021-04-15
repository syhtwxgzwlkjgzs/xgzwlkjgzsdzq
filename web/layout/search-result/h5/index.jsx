import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/search-input';
import SearchInput from '.././../../components/search-input';

import styles from './index.module.scss';

@inject('site')
@observer
class SearchResultH5Page extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

    this.state = {
      keyword,
    };

    // 进入页面时搜索
    this.onSearch(keyword);
  }

  onCancel = () => {
    this.props.router.back();
  };
  onSearch = () => {};

  render() {
    const { keyword } = this.state;

    return (
      <div className={styles.page}>
        <div className={styles.section}>
          <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />
        </div>
      </div>
    );
  }
}

export default withRouter(SearchResultH5Page);
