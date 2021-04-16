import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/h5';
import IndexPCPage from '@layout/search/pc';
import { readTopicsList } from '@server';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithLogin from '@common/middleware/HOCWithLogin';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const topics = await readTopicsList({}, ctx);
    return {
      serverSearch: {
        topics: topics.Data,
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverSearch, index } = this.props;
    // 初始化数据到store中
    serverSearch && serverSearch.topics && index.setTopics(serverSearch.topics);
  }

  async componentDidMount() {
    const { serverSearch, index } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    if (!index.topics && (!serverSearch || !serverSearch.topics)) {
      const topics = await readTopicsList({});

      index.setTopics(topics.Data);
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage/>;
    }
    return <IndexH5Page/>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
