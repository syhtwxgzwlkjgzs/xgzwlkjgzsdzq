import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readCategories, readStickList, readThreadList } from '@server';
import PayBox from '../components/payBox/index';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
// import HOCWithLogin from '@common/middleware/HOCWithLogin';

@inject('site')
@inject('index')
@inject('user')
@observer
class Index extends React.Component {
  page = 1;
  prePage = 10;
  static async getInitialProps(ctx) {
    const categories = await readCategories({}, ctx);
    const sticks = await readStickList({}, ctx);
    const threads = await readThreadList({ params: { filter: {}, sequence: 0, perPage: 10, page: 1 } }, ctx);

    return {
      serverIndex: {
        categories: categories && categories.code === 0 ? [{ name: '全部', pid: '', children: [] }, ...categories.data] : null,
        sticks: sticks && sticks.code === 0 ? sticks.data : null,
        threads: threads && threads.code === 0 ? threads.data : null,
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverIndex, index } = this.props;
    // 初始化数据到store中
    serverIndex && serverIndex.categories && index.setCategories(serverIndex.categories);
    serverIndex && serverIndex.sticks && index.setSticks(serverIndex.sticks);
    serverIndex && serverIndex.threads && index.setThreads(serverIndex.threads);
  }

  async componentDidMount() {
    PayBox.createPayBox({
      data: {
        amount: 0.1,
        type: 5,
        threadId: 4,
        payeeId: 16,
        isAnonymous: false,
      },
      success: (orderInfo) => {
        console.log(orderInfo);
      },
      failed: (orderInfo) => {
        console.log(orderInfo);
      },
    });
    const { serverIndex, index } = this.props;
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
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage/>;
    }
    return <IndexH5Page dispatch={this.dispatch} />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
