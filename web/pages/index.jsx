import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readCategories } from '@server';

import compose from '@common/utils/compose';

import clientFetchSiteData from '@common/middleware/clientFetchSiteData';
import serverFetchSiteData from '@common/middleware/serverFetchSiteData';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    const { server_index, index } = this.props;
    // 初始化数据到store中
    server_index.categories && index.setCategories(server_index.categories);
  }

  async componentDidMount() {
    const { server_index, index } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    if (!server_index.categories) {
      const categories = await readCategories({});
      index.setCategories(categories.data);
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    if (platform === 'h5') {
      return <IndexH5Page/>;
    }
    return <IndexPCPage/>;
  }
}

export default clientFetchSiteData(Index);

export const getServerSideProps = (ctx) => compose([serverFetchSiteData, async (ctx, data) => {
  // 获取分类数据
  const categories = await readCategories({}, ctx);
  return {
    props: {
      ...data,
      server_index: {
        categories: categories.data,
      },
    },
    // redirect: {
    //   destination: '/close',
    //   permanent: false,
    // },
  };
}], ctx);

// export const getServerSideProps = (ctx) => serverInitSiteData(ctx, async (ctx, siteData) => {
//   // 获取分类数据
  // const categories = await readCategories({}, ctx);
  // return {
  //   props: {
  //     ...siteData,
  //     server_index: {
  //       categories: categories.data,
  //     },
  //   },
  //   redirect: {
  //     destination: '/close',
  //     permanent: false,
  //   },
  // };
// })

