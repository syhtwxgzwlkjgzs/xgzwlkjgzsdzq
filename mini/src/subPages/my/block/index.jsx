import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexMiniPage from '@layout/my/block';
import { readUsersList } from '@server';
import { Toast } from '@discuzq/design';
import Page from '@components/page';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  static async getInitialProps() {
    const result = await readUsersList({ params: { filter: {} } });
    return {
      serverSearch: {
        users: result?.data
      },
    };
  }

  page = 1;
  perPage = 10;

  constructor(props) {
    super(props);
    const { serverSearch, search } = this.props;
    // 初始化数据到store中
    serverSearch && serverSearch.users && search.setUsers(serverSearch.users);
  }

  async componentDidMount() {
    const { search, router } = this.props;
    const  keyword = '';
    // const { keyword = '' } = router.query;
    // 当服务器无法获取数据时，触发浏览器渲染
    const hasUsers = !!search.users;
    const hasTopics = !!search.topics;

    if (!hasUsers || !hasTopics) {
      this.toastInstance = Toast.loading({
        content: '加载中...',
        duration: 0,
      });

      this.page = 1;
      await this.getData(keyword);

      this.toastInstance?.destroy();
    }
  }
  getData = (keyword) => {
    const { search } = this.props;
    search.getUsersList({ search: keyword, perPage: this.perPage, page: this.page  });
  }
  dispatch = async (type, data) => {
    const { search } = this.props;

    if (type === 'refresh') {
      this.page = 1;
    } else if (type === 'moreData') {
      this.page += 1;
    }

    await this.getData(data);
    return;
  }

  render() {
    return (
      <Page>
        <IndexMiniPage dispatch={this.dispatch} />
      </Page>
    )
  }
}

// eslint-disable-next-line new-cap
export default Index;