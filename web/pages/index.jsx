import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readStickList, readCategories } from '@server';
import { sticks, categories, threads } from './data';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
// import HOCWithLogin from '@common/middleware/HOCWithLogin';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  // static async getInitialProps(ctx) {
  //   const categories = await readCategories({}, ctx);
  //   const sticks = await readStickList({}, ctx);
  //   return {
  //     serverIndex: {
  //       categories: categories.Data,
  //       sticks: sticks.Data,
  //     },
  //   };
  // }

  constructor(props) {
    super(props);
    const { serverIndex, index } = this.props;
    // 初始化数据到store中
    // serverIndex && serverIndex.categories && index.setCategories(serverIndex.categories);
    // serverIndex && serverIndex.sticks && index.setSticks(serverIndex.sticks);
    index.setCategories(categories);
    index.setSticks(sticks);
    index.setThreads(threads);
  }

  async componentDidMount() {
    const { serverIndex, index } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    if (!index.categories && (!serverIndex || !serverIndex.categories)) {
      const categories = await readCategories({});
      index.setCategories(categories.data);
    }

    // 如果还没有获取用户名登录入口是否展示接口，那么请求来赋予初始值
    if (this.props.site.isUserLoginVisible === null) {
      try {
        this.props.site.getUserLoginEntryStatus();
      } catch (error) {
        console.log(error);
      }
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
