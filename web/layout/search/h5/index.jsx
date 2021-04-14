import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

// import SearchInput from '@components/dzp-search-input';
import SearchInput from '.././../../components/dzp-search-input';

import styles from './index.module.scss';
import '@discuzq/design/styles/index.scss';

@inject('site')
@observer
class SearchH5Page extends React.Component {
  onSearch = () => {
    // this.props.router.push('/search-result');
  };
  onCancel = () => {
    this.props.router.back();
  };

  render() {
    return (
      <div className={styles.page}>
        <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} />
      </div>
    );
  }
}

export default withRouter(SearchH5Page);
