import React from 'react';
import IndexPage from '@layout/index';
import Page from '@components/page';
import withShare from '@common/utils/withShare/withShare'
import { inject, observer} from 'mobx-react'
@inject('site')
@inject('search')
@inject('topic')
@inject('index')
@inject('user')
@observer
@withShare({
  needLogin: true
})
class Index extends React.Component {
  $getShareData (data) {
    const { site } = this.props 
    const title = site.webConfig?.setSite?.siteName || ''
    const path='pages/index/index'
    if(!data) {
      return {
        title,
        path
      }
    }
    if (data.from === 'menu') {
      return {
        title:title,
        path:path
      }
    }
    const shareData = data.target.dataset.shareData
    const { from } = shareData
    if(from && from === 'thread') {
      const { user } = this.props
      const { threadId } = shareData
      this.props.index.updateThreadShare({ threadId }).then(result => {
      if (result.code === 0) {
          this.props.index.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.search.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
      }
    });
    }
    return shareData
  }
  render() {
    return (
      <Page>
        <IndexPage getThreadId={this.getThreadId}/>
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
