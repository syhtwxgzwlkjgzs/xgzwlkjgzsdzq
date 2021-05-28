import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '../../layout/search';
import Toast from '@discuzq/design/dist/components/toast/index';
import Page from '@components/page';
import Taro from '@tarojs/taro'
import goToLoginPage from '@common/utils/go-to-login-page';

@inject('site')
@inject('search')
@inject('user')
@inject('index')
@inject('topic')
@observer
class Index extends React.Component {

  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const { search } = this.props;
    Taro.hideHomeButton();
    await search.getSearchData();
  }
  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
  }

  onShareAppMessage = (res) => {
    const { user, index } = this.props;
    const thread = index.threads?.pageData || []
    const threadId = parseInt(res.target.dataset.threadId)
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
      const promise = Promise.reject()
      return {
        promise
      }
    } else {
      {
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
  };
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
