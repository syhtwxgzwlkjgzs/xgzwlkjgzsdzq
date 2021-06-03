import React from 'react';
import { inject, observer } from 'mobx-react';
import { get } from '@common/utils/get';
import Head from 'next/head';

@inject('site')
@observer
class DocumentHead extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { title } = this.props;
    return (
      <Head>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
        />
        <meta name="keywords" content={get(this.props.site, 'webConfig.setSite.siteKeywords', 'Discuz!Q')} />
        <title>{title || get(this.props.site, 'webConfig.setSite.siteName', 'Discuz!Q')}</title>
      </Head>
    );
  }
}

export default DocumentHead;
