import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { getThreadList, getFirstData } from '@common/service/home';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
// import HOCWithLogin from '@common/middleware/HOCWithLogin';

@inject('site')
@inject('index')
@inject('user')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const { res } = await getFirstData({}, ctx);

    return {
      serverIndex: {
        categories: res[0] || [],
        sticks: res[1] || [],
        threads: res[2] || {},
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
    const { serverIndex, index } = this.props;

    // 当服务器无法获取数据时，触发浏览器渲染
    const isBool1 = !index.categories && (!serverIndex || !serverIndex.categories);
    const isBool2 = !index.sticks && (!serverIndex || !serverIndex.sticks);
    const isBool3 = !index.threads && (!serverIndex || !serverIndex.threads);

    if (!isBool1 && !isBool2 && !isBool3) {
      const { res } = await getFirstData({});

      index.setCategories(res[0] || []);
      index.setSticks(res[1] || []);
      index.setThreads(res[2] || {});
    }
  }

  dispatch = async (type, data = '') => {
    const { index } = this.props;
    const { categoryids, types, essence, sequence } = data;

    const { res } = await getThreadList({ filter: { categoryids, types, essence }, sequence });
    index.setSticks(res[1] || []);
    index.setThreads(res[0] || {});
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
