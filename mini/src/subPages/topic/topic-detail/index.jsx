import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPage from '@layout/topic/topic-detail';
import { readTopicsList } from '@server';
// import Toast from '@discuzq/design/dist/components/toast/index';
import { getCurrentInstance } from '@tarojs/taro';
import Page from '@components/page';
import withShare from '@common/utils/withShare/withShare'
@inject('search')
@inject('topic')
@inject('index')
@inject('user')
@observer
@withShare()
class Index extends React.Component {
  page = 1;
  perPage = 10;
  $getShareData ({}) {
    const topicTitle = topic.topicDetail?.pageData[0]?.content || ''
    const topicId = topic.topicDetail?.pageData[0]?.topicId || ''
    return {
      title: topicTitle,
      path: `/subPages/topic/topic-detail/index?id=${topicId}`
   }
  }
  $callBack (data) {
    const { user } = this.props
    const { threadId } = data
    this.props.index.updateThreadShare({ threadId }).then(result => {
      if (result.code === 0) {
          this.props.index.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.search.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
      }
    });
  }
  async componentDidMount() {
    const { topic } = this.props;
    const { id = '' } = getCurrentInstance().router.params;
    // if (!hasTopics) {
    //   this.toastInstance = Toast.loading({
    //     content: '加载中...',
    //     duration: 0,
    //   });

      this.page = 1;
      await topic.getTopicsDetail({ topicId: id });

      // this.toastInstance?.destroy();
    // }
    
  }
  render() {
    return <Page><IndexPage dispatch={this.dispatch} /></Page>;
  }
}

// eslint-disable-next-line new-cap
export default Index;