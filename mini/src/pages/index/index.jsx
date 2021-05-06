import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexMiniPage from '@layout/index';
import Page from '@components/page';

@inject('site')
@inject('index')
@inject('user')
@observer
class Index extends React.Component {
  page = 1;
  prePage = 10;

  async componentDidMount() {
    const { index } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    const hasCategoriesData = !!index.categories;
    const hasSticksData = !!index.sticks;
    const hasThreadsData = !!index.threads;

    if (!hasCategoriesData) {
      this.props.index.getReadCategories();
    }
    if (!hasSticksData) {
      this.props.index.getRreadStickList();
    }
    if (!hasThreadsData) {
      this.props.index.getReadThreadList();
    }

  }

  dispatch = async (type, data = {}) => {
    const { index } = this.props;
    const { categoryids, types, essence, sequence } = data;

    if (type === 'click-filter') {
      this.page = 1;
      index.screenData({ filter: { categoryids, types, essence }, sequence });
    } else if (type === 'moreData') {
      this.page += 1;
      await index.getReadThreadList({
        perPage: this.prePage,
        page: this.page,
        filter: { categoryids, types, essence },
        sequence,
      });

      return;
    }
  }

  render() {
    return (
      <Page>
          <IndexMiniPage dispatch={this.dispatch} />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
