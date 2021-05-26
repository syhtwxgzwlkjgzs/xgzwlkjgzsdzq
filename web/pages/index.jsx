import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readCategories, readStickList, readThreadList } from '@server';
import { Toast } from '@discuzq/design';
import HOCFetchSiteData from '../middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@inject('user')
@observer
class Index extends React.Component {
  page = 1;
  prePage = 10;
  static async getInitialProps(ctx, { user, site }) {
    const categories = await readCategories({}, ctx);
    const sticks = await readStickList({}, ctx);
    const sequence = site && site.webConfig && site.webConfig.setSite ? site.webConfig.setSite.siteOpenSort : 0;

    const threads = await readThreadList({ params: { filter: {}, sequence, perPage: 10, page: 1 } }, ctx);

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
    const { categoryids, types, essence, sequence, attention, sort } = index.filter;

    // 当服务器无法获取数据时，触发浏览器渲染
    const hasCategoriesData = !!index.categories;
    const hasSticksData = !!index.sticks;
    const hasThreadsData = !!index.threads;

    if (!hasCategoriesData) {
      this.props.index.getReadCategories();
    }
    if (!hasSticksData) {
      this.props.index.getRreadStickList(categoryids);
    }
   
    if (!hasThreadsData) {
      this.props.index.getReadThreadList({
        sequence: sequence || (this.props.site.checkSiteIsOpenDefautlThreadListData() ? 1 : 0), 
        filter: { categoryids, types, essence, attention, sort } 
      });
    } else {
      // 如果store中有值，则需要获取之前的分页数
      this.page = index.threads.currentPage || 1
    }
  }

  dispatch = async (type, data = {}) => {
    const { index } = this.props;
    const { categoryids, types, essence, sequence, attention, sort, page } = data;

    let newTypes = [];
    if (types) {
      if (!(types instanceof Array)) {
        newTypes = [types];
      } else {
        newTypes = types;
      }
    }

    let categoryIds = [];
    if (categoryids) {
      if (!(categoryids instanceof Array)) {
        categoryIds = [categoryids];
      } else {
        categoryIds = categoryids;
      }
    }

    if (type === 'click-filter') { // 点击tab
      this.toastInstance = Toast.loading({
        content: '加载中...',
        duration: 0,
      });

      this.page = 1;
      await index.screenData({ filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort }, sequence, page: this.page, });

      this.toastInstance?.destroy();
    } else if (type === 'moreData') {
      this.page += 1;
      return await index.getReadThreadList({
        perPage: this.prePage,
        page: this.page,
        filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort },
        sequence,
      });
    } else if (type === 'refresh-recommend') {
      await index.getRecommends({ categoryIds });
    } else if (type === 'update-page') {// 单独更新页数
      this.page = page
    } else if (type === 'refresh-thread') { // 点击帖子更新数的按钮，刷新帖子数据
      this.page = 1;
      return await index.getReadThreadList({ filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort }, sequence, page: this.page, });
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
