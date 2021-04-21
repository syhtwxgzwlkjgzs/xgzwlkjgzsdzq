import React from 'react';
import isServer from '@common/utils/is-server';
import isWeiXin from '@common/utils/is-weixin';
import { inject } from 'mobx-react';

export default function HOCWeixin(Component) {
  @inject('site')
  class HOCWeixinComponent extends React.Component {
    constructor(props) {
      super(props);
      if (isServer()) return;
      // 如果在微信环境内，则直接拉起登录
      if (isWeiXin()) {
        const redirectEncodeUrl = encodeURIComponent(`${this.props.site.envConfig.COMMOM_BASE_URL}/user/wx-auth`);
        window.location.href = `https://discuzv3-dev.dnspod.dev/apiv3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return HOCWeixinComponent;
}
