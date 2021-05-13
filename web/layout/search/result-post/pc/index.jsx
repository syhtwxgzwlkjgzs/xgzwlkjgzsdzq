import React from 'react';
import { inject, observer } from 'mobx-react';
import BaseLayout from '@components/base-layout';
import SidebarPanel from '@components/sidebar-panel';
import ThreadContent from '@components/thread';
import { withRouter } from 'next/router';
import styles from './index.module.scss';

@inject('site')
@inject('search')
@observer
class SearchResultPostH5Page extends React.Component {
  constructor(props) {
    super(props);

    const keyword = this.props.router.query.keyword || '';

    this.state = {
      keyword,
      refreshing: false,
    };
  }

  fetchMoreData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    return dispatch('moreData', keyword);
  };

  renderContent = (pageData) => {
    return (
      <SidebarPanel 
        title="热门内容" 
        type='normal'
        isShowMore={false}
        isLoading={!pageData}
        noData={!pageData?.length}
        icon={{ type: 3, name: 'HotOutlined' }}
      >
        {
          pageData?.map((item, index) => <ThreadContent className={styles.wrapper} data={item} key={index} />)
        }
      </SidebarPanel>
    )
  }

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (value) => {
    this.setState({ keyword: value }, () => {
      this.searchData(value);
    });
  }

  render() {
    const { pageData, currentPage, totalPage } = this.props.search.threads || {};

    return (
      <BaseLayout
        onSearch={this.onSearch}
        noMore={currentPage >= totalPage}
        onRefresh={this.fetchMoreData}
        showRefresh={false}
      >
        { this.renderContent(pageData) }
      </BaseLayout>
    );
  }
}

export default withRouter(SearchResultPostH5Page);
