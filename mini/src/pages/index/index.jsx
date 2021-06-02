import React from 'react';
import IndexPage from '@layout/index';
import Page from '@components/page';
import withShare from '@common/utils/withShare/withShare'
import { inject, observer } from 'mobx-react'
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
  $getShareData(data) {
    const { site } = this.props
    const defalutTitle = site.webConfig?.setSite?.siteName || ''
    const defalutPath = 'pages/index/index'
    if (data.from === 'timeLine') {
      return {
        title: defalutTitle
      }
    }
    if (data.from === 'menu') {
      return {
        title: defalutTitle,
        path: defalutPath
      }
    }
    const { title, path, comeFrom, threadId } = data
    if (comeFrom && comeFrom === 'thread') {
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
  render() {
    return (
      <Page>
        <IndexPage getThreadId={this.getThreadId} />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
