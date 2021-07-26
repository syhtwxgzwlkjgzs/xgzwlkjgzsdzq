import React from 'react';
import { inject, observer } from 'mobx-react';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import getQueryString from '@common/utils/get-query-string';

@inject('payBox')
@observer
class PayMiddlePage extends React.Component {
  componentDidMount = async () => {
    const link = getQueryString('link');

    if (!link) return;

    const parsedLink = decodeURIComponent(link);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('src', parsedLink);
    iframe.setAttribute('sandbox', 'allow-top-navigation allow-scripts');
    document.body.appendChild(iframe);

    // FIXME: SSR下的情况，状态会丢失，需要寻找一种解决办法
    // CSR 的情况下，打开确认支付结果窗口
    this.props.payBox.h5SureDialogVisible = true;
  };

  render() {
    return <div>正在拉起微信支付...</div>;
  }
}

export default HOCFetchSiteData(PayMiddlePage);
