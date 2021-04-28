import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '../../layout/search';
import { readUsersList, readTopicsList, readThreadList } from '@server';
import { Toast } from '@discuzq/design';
import Page from '@components/page';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {

  constructor(props) {
    super(props);
    const { serverSearch, search } = this.props;
    // 初始化数据到store中
    // serverSearch && serverSearch.indexTopics && search.setIndexTopics(serverSearch.indexTopics);
    // serverSearch && serverSearch.indexUsers && search.setIndexUsers(serverSearch.indexUsers);
    // serverSearch && serverSearch.indexThreads && search.setIndexThreads(serverSearch.indexThreads);
  }

  async componentDidMount() {
    const { search } = this.props;

    // this.toastInstance = Toast.loading({
    //   content: '加载中...',
    //   duration: 0,
    // });
    await search.getSearchData();
    // this.toastInstance?.destroy();
  }

  render() {
    return (
      <Page>
        <IndexH5Page dispatch={this.dispatch}/>
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
