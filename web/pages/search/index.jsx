import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/h5';
import IndexPCPage from '@layout/search/pc';
import { getSearchData } from '../../../common/service/search';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import SearchAction from '../../../common/store/search/action';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  // static async getInitialProps(ctx) {
  //   const { res } = await getSearchData({}, ctx);

  //   return {
  //     serverSearch: {
  //       indexTopics: res[0],
  //       indexUsers: res[1],
  //       indexThreads: res[2],
  //     },
  //   };
  // }

  // constructor(props) {
  //   super(props);
  //   const { serverSearch, search } = this.props;
  //   // 初始化数据到store中
  //   serverSearch && serverSearch.indexTopics && search.setIndexTopics(serverSearch.indexTopics);
  //   serverSearch && serverSearch.indexUsers && search.setIndexUsers(serverSearch.indexUsers);
  //   serverSearch && serverSearch.indexThreads && search.setIndexThreads(serverSearch.indexThreads);
  // }

  async componentDidMount() {
    const { search, serverSearch } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    const isBool1 = !search.indexTopics && (!serverSearch || !serverSearch.indexTopics);
    const isBool2 = !search.indexUsers && (!serverSearch || !serverSearch.indexUsers);
    const isBool3 = !search.indexThreads && (!serverSearch || !serverSearch.indexThreads);

    if (!isBool1 && !isBool2 && !isBool3) {
      const { res } = await getSearchData();
      debugger;
      search.setIndexTopics(res[0]);
      search.setIndexUsers(res[1]);
      search.setIndexThreads(res[2]);
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage />;
    }

    return <IndexH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
