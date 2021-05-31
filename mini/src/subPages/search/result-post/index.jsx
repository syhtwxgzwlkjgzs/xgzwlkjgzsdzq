import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-post';
import Page from '@components/page';
import { getCurrentInstance } from '@tarojs/taro';
import withShare from '@common/utils/withShare'
@inject('search')
@observer
@withShare({
  needShareline: false
})
class Index extends React.Component {

  page = 1;
  perPage = 10;

  async componentDidMount() {
    const { search, router } = this.props;
    const { keyword = '' } = getCurrentInstance().router.params;
      this.page = 1;
      await search.getThreadList({ search: keyword });
  }

  dispatch = async (type, data) => {
    const { search } = this.props;

    if (type === 'refresh') {
      this.page = 1;
    } else if (type === 'moreData') {
      this.page += 1;
    }

    await search.getThreadList({ search: data, perPage: this.perPage, page: this.page });
    return;
  }
  render() {
    return (
      <Page>
        <IndexH5Page dispatch={this.dispatch} />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
