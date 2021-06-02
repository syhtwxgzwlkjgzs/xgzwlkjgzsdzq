import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '../../layout/search';
import Page from '@components/page';
import Taro from '@tarojs/taro'
import withShare from '@common/utils/withShare/withShare'
@inject('search')
@inject('topic')
@inject('index')
@inject('user')
@observer
@withShare({
  needShareline: false
})
class Index extends React.Component {

  constructor(props) {
    super(props);
  }
  $getShareData (data) {
    if(data.from === 'menu') {
      return {
      }
    }
    const { title, path, comeFrom, threadId } = data
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
    return {
      title,
      path
    }
  }
  async componentDidMount() {
    const { search } = this.props;
    Taro.hideHomeButton();
    await search.getSearchData();
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
export default Index;
