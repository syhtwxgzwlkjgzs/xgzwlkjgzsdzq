import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '../../layout/search';
import Page from '@components/page';
import Taro from '@tarojs/taro'
import withShare from '@common/utils/withShare/withShare'
import { priceShare } from '@common/utils/priceShare';

@inject('search')
@inject('topic')
@inject('index')
@inject('user')
@inject('site')
@observer
@withShare({
  needShareline: false
})
class Index extends React.Component {

  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const { search } = this.props;
    Taro.hideHomeButton();
    await search.getSearchData();
  }
  getShareData (data) {
    const { site } = this.props
    const siteName = site.webConfig?.setSite?.siteName || ''
    if(data.from === 'menu') {
      return {
        title: `${siteName} - 在这里，发现更多热门内容`,
        path: '/subPages/search/index'
      }
    }
    const { title, path, comeFrom, threadId, isAnonymous, isPrice} = data
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
    return priceShare({isAnonymous, isPrice, path}) || {
      title,
      path
    }
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
