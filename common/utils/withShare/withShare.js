import Taro from '@tarojs/taro';
import Toast from '@discuzq/design/dist/components/toast';
import goToLoginPage from '@common/utils/go-to-login-page';
import { inject, observer} from 'mobx-react'
/**
 * @param {boolean} needShareline 是否需要分享到朋友圈
 * @param {boolean} needLogin 是否需要登录
 * @returns 
 */
function withShare(opts = {}) {
  
  // 设置默认
  const defalutTitle = 'Discez!Q'
  const defalutPath = 'pages/index/index'
  
  let menus = []
  const { needShareline = true, needLogin = true } = opts
  if(needShareline) {
    menus = ['shareAppMessage', 'shareTimeline']
  } else {
    menus = ['shareAppMessage']
  }
  return function demoComponent(Component) {  
    @inject('user')
    @observer
    class WithShare extends Component {
      componentDidMount() {
        Taro.showShareMenu({
          withShareTicket: true,
          menus :['shareAppMessage']
        });
        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }
      onShareTimeline(){
        if (this.$getShareData && typeof this.$getShareData === 'function') {
          const  shareData  = this.$getShareData()
          const { title=defalutTitle, imageUrl=''} = shareData
          return {
            title,
            imageUrl
          }
        }
        return defalut
      }
      onShareAppMessage = (res) => {
          const { user } = this.props
          //是否必须登录
          if (needLogin && !user.isLogin()) {
            Toast.info({ content: '请先登录!' });
            goToLoginPage({ url: '/subPages/user/wx-auth/index' });
            const promise = Promise.reject()
            return {
                promise
            }
          }
          let shareData = ''
          if (this.$getShareData && typeof this.$getShareData === 'function') {
             shareData = this.$getShareData(res)
          }
          const { title=defalutTitle, path=defalutPath } = shareData
          return {
            title,
            path
          }
          
    }

      render() {
        return super.render();
      }
    }

    return WithShare;
  };
}

export default withShare;

