import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readCategories } from '@server';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const categories = await readCategories({}, ctx);
    return {
      serverIndex: {
        categories: categories.data,
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverIndex, index } = this.props;
    // 初始化数据到store中
    serverIndex && serverIndex.categories && index.setCategories(serverIndex.categories);
  }

  async componentDidMount() {
    const { serverIndex, index } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    if (!index.categories && (!serverIndex || !serverIndex.categories)) {
      const categories = await readCategories({});
      index.setCategories(categories.data);
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
// export default clientFetchSiteData(Index);

// export const getServerSideProps = (ctx) => compose([serverFetchSiteData, async (ctx, data) => {
//   // 获取分类数据
//   const categories = await readCategories({}, ctx);
//   return {
//     props: {
//       ...data,
//       serverIndex: {
//         categories: categories.data,
//       },
//     },
//     // redirect: {
//     //   destination: '/close',
//     //   permanent: false,
//     // },
//   };
// }], ctx);

// export const getServerSideProps = async (ctx) => {
//   // 获取分类数据
//   const categories = await readCategories({}, ctx);
//   return {
//     props: {
//       serverIndex: {
//         categories: categories.data,
//       },
//     },
//     // redirect: {
//     //   destination: '/close',
//     //   permanent: false,
//     // },
//   };
// }

