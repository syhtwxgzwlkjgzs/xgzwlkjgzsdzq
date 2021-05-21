import React from 'react';
import isServer from '@common/utils/is-server';
import isWeiXin from '@common/utils/is-weixin';
import { inject } from 'mobx-react';

export default function HOCWeixin(Component) {
  @inject('site')
  class HOCWeixinComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isWeiXin: false,
      };
      if (isServer() || !this.props.site.isOffiaccountOpen) return;
      // 如果在微信环境内，则直接拉起登录
      if (isWeiXin()) {
        this.state.isWeiXin = true;
        const redirectEncodeUrl = encodeURIComponent(`${this.props.site.envConfig.COMMOM_BASE_URL}/user/wx-auth`);
        window.location.href = `https://discuzv3-dev.dnspod.dev/apiv3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
      }
    }

    render() {
      return this.state.isWeixin ? <div>Loading</div> : <Component {...this.props} /> ;
    }
  }

  return HOCWeixinComponent;
}
