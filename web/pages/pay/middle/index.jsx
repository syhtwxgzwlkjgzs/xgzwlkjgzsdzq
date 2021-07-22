import React from 'react';
import { inject, observer } from 'mobx-react';
import getQueryString from '@common/utils/get-query-string';

@inject('payBox')
@observer
export default class PayMiddlePage extends React.Component {
  componentDidMount = async () => {
    const link = getQueryString('link');

    if (!link) return;

    const parsedLink = decodeURIComponent(link);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('src', parsedLink);
    iframe.setAttribute('sandbox', 'allow-top-navigation allow-scripts');
    document.body.appendChild(iframe);
  };

  render() {
    return <div>正在拉起微信支付...</div>;
  }
}
