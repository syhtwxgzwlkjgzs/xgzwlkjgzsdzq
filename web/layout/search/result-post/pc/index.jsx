import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '@components/section-title';
import ThreadContent from '@components/thread';
import { withRouter } from 'next/router';
import List from '@components/list'
import NoData from '@components/no-data'

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
  
  onPostClick = data => console.log('post click', data);

  fetchMoreData = () => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    return dispatch('moreData', keyword);
  };

  renderContent = () => {
    const { pageData = [] } = this.props.search.threads || { pageData: [] };
    return (
      <div className={styles.searchContent}>
        <div className={styles.postTitle}>
          <SectionTitle
            title="热门内容"
            isShowMore={false}
            icon={{ type: 3, name: 'HotOutlined' }}
          />
        </div>
        {
          pageData?.length
            ? pageData?.map((item, index) => <ThreadContent className={styles.threadContent} data={item} key={index} />)
            : <NoData />
        }
      </div>
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
    const { currentPage, totalPage } = this.props.search.threads || { pageData: [] };

    return (
      <List className={styles.searchWrap} noMore={currentPage >= totalPage}  onRefresh={this.fetchMoreData}>
        <BaseLayout
          onSearch={this.onSearch}
          left={() => <div></div>}
          right={() => <div></div>}
        >
          { this.renderContent }
        </BaseLayout>
      </List>
    );
  }
}

export default withRouter(SearchResultPostH5Page);
