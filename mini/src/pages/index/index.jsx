import React from 'react';
import IndexPage from '@layout/index';
import Page from '@components/page';
import Taro from '@tarojs/taro'
import { observer, inject } from 'mobx-react';
import Toast from '@discuzq/design/dist/components/toast';
import goToLoginPage from '@common/utils/go-to-login-page';

@inject('user')
@inject('index')
@inject('site')
@inject('search')
@inject('topic')
@observer
class Index extends React.Component {

  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
  }

  onShareAppMessage = (res) => {
    const { user, site, index } = this.props;
    const defaultTitle = site.webConfig?.setSite?.siteName || ''
    const thread = index.threads?.pageData || []
    const threadId = parseInt(res.target.id)
    let threadTitle = ''
    for(let i of thread) {
      if(i.threadId == threadId) {
        threadTitle =  i.title
        break
      }
    }
    //是否必须登录
    if (!user.isLogin()) {
      Toast.info({ content: '请先登录!' });
      goToLoginPage({ url: '/subPages/user/wx-authorization/index' });
      const promise = new Promise((res, rej) => {rej()})
      return {
        promise
      }
    } else {
      if(res.target.offsetTop === 0) {
        return {
          title: defaultTitle,
          path: '/pages/index/index'
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
