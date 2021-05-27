import React from 'react';
import IndexPage from '@layout/index';
import Page from '@components/page';
import Taro from '@tarojs/taro'
class Index extends React.Component {
  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
  }
  onShareAppMessage (res) {
    if(res.target.offsetTop === 0) {
      return {
        title: '首页',
        path: '/subPages/index/index'
      } 
    } else {
      return {
        title: '帖子详情',
        path: '/subPages/index/index'
      }
    }
    
  }
  render() {
    return (
      <Page>
        <IndexPage/>
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
