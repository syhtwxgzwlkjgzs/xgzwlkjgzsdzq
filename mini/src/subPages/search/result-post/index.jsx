import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-post';
import Page from '@components/page';
import { getCurrentInstance } from '@tarojs/taro';
import withShare from '@common/utils/withShare/withShare'
import { priceShare } from '@common/utils/priceShare';

@inject('search')
@inject('topic')
@inject('index')
@inject('user')
@observer
@withShare({
  needShareline: false
})
class Index extends React.Component {

  page = 1;
  perPage = 10;

  constructor(props) {
    super(props);
    this.state = {
      repeatedIds: []
    }
  }

  async componentDidMount() {
    const { search, router } = this.props;
    const { keyword = '' } = getCurrentInstance().router.params;
    this.page = 1;
    const res = await search.getThreadList({ search: keyword });

    this.handleFirstRequest(res)
  }
  getShareData (data) {
    const shareData = data.target?.dataset?.shareData
    if(data.from === 'menu') {
      return {
      }
    }
    const { title, path, comeFrom, threadId, isAnonymous, isPrice } = data
    if(comeFrom && comeFrom === 'thread') {
      const { user } = this.props
      this.props.index.updateThreadShare({ threadId }).then(result => {
      if (result.code === 0) {
          this.props.index.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.search.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
      }
    });
    }
    return priceShare({isPrice, isAnonymous, path}) || {
      title,
      path
    }
  }
  dispatch = async (type, data) => {
    const { search } = this.props;

    if (type === 'refresh') {
      this.page = 1;
      search.setThreads(null);
    } else if (type === 'moreData') {
      this.page += 1;
    }
    const res = await search.getThreadList({ search: data, perPage: this.perPage, page: this.page });
    if (this.page === 1) {
      this.handleFirstRequest(res)
    }

    return;
  }

  handleFirstRequest = (res) => {
    if (!res) {
      return
    }

    const ids = res.pageData?.map(item => item.threadId)
    this.setState({ repeatedIds: ids })

    if (ids.length < 10) {
      this.dispatch('moreData', keyword, { repeatedIds: ids })
    }
  }

  render() {
    return (
      <Page>
        <IndexH5Page dispatch={this.dispatch} />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
