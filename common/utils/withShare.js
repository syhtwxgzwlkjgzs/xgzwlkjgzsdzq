import Taro from '@tarojs/taro';
import Toast from '@discuzq/design/dist/components/toast';
import goToLoginPage from '@common/utils/go-to-login-page';
import { observer, inject } from 'mobx-react';
/**
 * @param needShareline 是否需要分享到朋友圈
 * @param comeFrom 来自哪个页面
 * @returns 
 */
 
function withShare(opts = {}) {
  
  // 设置默认
  const defalut = {
      Title:'Discez!Q',
      Path: 'pages/index/index'
  }
  let menus = []
  const { needShareline } = opts
  if(needShareline) {
    menus = ['shareAppMessage', 'shareTimeline']
  } else {
    menus = ['shareAppMessage']
  }
  const { comeFrom } = opts
  return function demoComponent(Component) {  
    @inject('user')
    @inject('index')
    @inject('site')
    @inject('search')
    @inject('topic') 
    @observer
    class WithShare extends Component {
      async componentWillMount() {
        Taro.showShareMenu({
          withShareTicket: true,
          menus :menus
        });
        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }
      onShareTimeline(){
        const { site, topic } = this.props
        const defaultTitle = site.webConfig?.setSite?.siteName || ''
        if(comeFrom === 'topic-detail') {
          const topicTitle = topic.topicDetail?.pageData[0]?.content || ''
          const topicId = topic.topicDetail?.pageData[0]?.topicId || ''
          return {
            title: topicTitle,
            path: `/subPages/topic/topic-detail/index?id=${topicId}`
          }
        }
        return {
            title: defaultTitle
        }
      }
      onShareAppMessage = (res) => {
          const { user, site, index, topic } = this.props;
          const defaultTitle = site.webConfig?.setSite?.siteName || ''
          const thread = index.threads?.pageData || []
          const from = res.target?.dataset?.from || ''
          const threadId = parseInt(res.target?.dataset?.threadId)
          let threadTitle = ''
          for(let i of thread) {
            if(i.threadId == threadId) {
              threadTitle =  i.title
              break
            }
          }
          if (res.from === 'menu') {
            console.log(comeFrom)
            if(comeFrom === 'topic-detail') {
              const topicTitle = topic.topicDetail?.pageData[0]?.content || ''
              const topicId = topic.topicDetail?.pageData[0]?.topicId || ''
              return {
                title: topicTitle,
                path: `/subPages/topic/topic-detail/index?id=${topicId}`
              }
            }
            return {
              title: defaultTitle,
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
          } 
          if(from && from === 'indexHead') {
            return {
                title: defaultTitle,
                path: '/pages/index/index'
            }
          }
          if(from && from === 'thread') {
            console.log(threadId)
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
          if (from && from === 'topicHead') {
            const topicTitle = topic.topicDetail?.pageData[0]?.content || ''
            const topicId = topic.topicDetail?.pageData[0]?.topicId || ''
            return {
              title: topicTitle,
              path: `/subPages/topic/topic-detail/index?id=${topicId}`
            }
          }
         return defalut
    }

      render() {
        return super.render();
      }
    }

    return WithShare;
  };
}

export default withShare;

