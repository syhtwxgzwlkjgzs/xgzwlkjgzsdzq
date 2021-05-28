import React from 'react';
import IndexPage from '@layout/index';
import Page from '@components/page';
import Taro from '@tarojs/taro'
import { observer, inject } from 'mobx-react';
import Toast from '@discuzq/design/dist/components/toast';
import goToLoginPage from '@common/utils/go-to-login-page';
import { observable } from 'mobx';

@inject('user')
@observer
class Index extends React.Component {
  
  threadId = '111'
  
  getThreadId = (data) => {
    const threadId = data
    //console.log(threadId)
    this.threadId = threadId
  }

  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
  }

  onShareAppMessage = (res) => {
    const { user } = this.props;
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
          title: '首页',
          path: '/pages/index/index'
        } 
      } else {
        return {
          title: '帖子详情',
          path: `/subPages/thread/index?id=${res.target.id}`
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
