import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-post';
import Toast from '@discuzq/design/dist/components/toast/index';
import Page from '@components/page';
import { getCurrentInstance } from '@tarojs/taro';
import goToLoginPage from '@common/utils/go-to-login-page';
import Taro from '@tarojs/taro'
@inject('site')
@inject('search')
@inject('user')
@inject('index')
@inject('topic')
@observer
class Index extends React.Component {

  page = 1;
  perPage = 10;

  async componentDidMount() {
    const { search, router } = this.props;
    const { keyword = '' } = getCurrentInstance().router.params;
      this.page = 1;
      await search.getThreadList({ search: keyword });
  }

  dispatch = async (type, data) => {
    const { search } = this.props;

    if (type === 'refresh') {
      this.page = 1;
    } else if (type === 'moreData') {
      this.page += 1;
    }

    await search.getThreadList({ search: data, perPage: this.perPage, page: this.page });
    return;
  }
  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage'],
    });
  }

  onShareAppMessage = (res) => {
    const { user, index, site } = this.props;
    const thread = index.threads?.pageData || []
    const threadId = parseInt(res.target?.dataset?.threadId)
    const defaultTitle = site.webConfig?.setSite?.siteName || ''
    let threadTitle = ''
    for(let i of thread) {
      if(i.threadId == threadId) {
        threadTitle =  i.title
        break
      }
    }
    if (res.from === 'menu') {
      return {
        title: defaultTitle,
        path: 'subPages/search/result-post/index'
      }
    } else {
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
    }
  }
  render() {
    return (
      <Page>
        <IndexH5Page dispatch={this.dispatch} />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
