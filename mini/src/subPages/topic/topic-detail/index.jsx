import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPage from '@layout/topic/topic-detail';
import { readTopicsList } from '@server';
// import Toast from '@discuzq/design/dist/components/toast/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import { getCurrentInstance } from '@tarojs/taro';
import Page from '@components/page';
import Taro from '@tarojs/taro'
import goToLoginPage from '@common/utils/go-to-login-page';

@inject('site')
@inject('topic')
@inject('index')
@inject('user')
@inject('search')
@observer
class Index extends React.Component {
  page = 1;
  perPage = 10;

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
  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
  }
  onShareTimeline(){
    const { topic } = this.props
    const topicTitle = topic.topicDetail?.pageData[0]?.content || ''    
    return {
      title: topicTitle
    }
  }
  onShareAppMessage = (res) => {
    const { user, index, topic } = this.props;
    const thread = index.threads?.pageData || []
    const threadId = parseInt(res.target.dataset.threadId)
    let threadTitle = ''
    for(let i of thread) {
      if(i.threadId == threadId) {
        threadTitle =  i.title
        break
      }
    }
    const topicTitle = topic.topicDetail?.pageData[0]?.content || ''
    const topicId = topic.topicDetail?.pageData[0]?.topicId || ''
    const from = res.target.dataset.from || ''
    //是否必须登录
    if (!user.isLogin()) {
      Toast.info({ content: '请先登录!' });
      goToLoginPage({ url: '/subPages/user/wx-authorization/index' });
      const promise = Promise.reject()
      return {
        promise
      }
    } else {
      {
        if(from && from === 'head') {
          return {
            title: topicTitle,
            path: `/subPages/topic/topic-detail/index?id=${topicId}`
          } 
        } else {
          this.props.index.updateThreadShare({ threadId }).then(result => {
            if (result.code === 0) {
              this.props.index.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
              this.props.search.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
              this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
            }
          });
          return {
            title: threadTitle,
            path: `/subPages/thread/index?id=${threadId}`
          }
        }
      }
    }
  }
  render() {
    return <Page><IndexPage dispatch={this.dispatch} /></Page>;
  }
}

// eslint-disable-next-line new-cap
export default Index;