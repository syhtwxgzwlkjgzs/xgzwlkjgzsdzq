import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readCategories, readStickList, readThreadList } from '@server';
import PayBox from '../components/payBox/index';
import { Toast } from '@discuzq/design'
import HOCFetchSiteData from '../middleware/HOCFetchSiteData';
// import HOCWithLogin from '@middleware/HOCWithLogin';

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
        categories: categories && categories.code === 0 ? categories.data : null,
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
    const { categoryids, types, essence, sequence, attention, sort } = data;

    let newTypes = []
    if (types && !(types instanceof Array)) {
      newTypes = [types]
    }

    if (type === 'click-filter') {
      this.toastInstance = Toast.loading({
        content: '加载中...',
        duration: 0,
      });

      this.page = 1;
      await index.screenData({ filter: { categoryids, types: newTypes, essence, attention, sort }, sequence });

      this.toastInstance?.destroy();
    } else if (type === 'moreData') {
      this.page += 1;
      await index.getReadThreadList({
        perPage: this.prePage,
        page: this.page,
        filter: { categoryids, types: newTypes, essence, attention, sort },
        sequence,
      });

      return;
    } else if (type === 'refresh-recommend') {
      await index.getRecommends({ categoryIds: categoryids });
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    if (platform === 'pc') {
      return <IndexPCPage dispatch={this.dispatch} />;
    }
    return <IndexH5Page dispatch={this.dispatch} />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
