import React from 'react';
import { inject, observer } from 'mobx-react';
import ThreadContent from '@components/thread';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout'
import { View } from '@tarojs/components'

@inject('site')
@inject('index')
@observer
class Index extends React.Component {

  render() {
    const { index } = this.props;
    const { pageData = [], currentPage, totalPage } = index.threads || {};
    return (
      <BaseLayout
        showHeader={false}
        noMore={currentPage >= totalPage}
        onRefresh={this.props.dispatch}
      >
        {pageData?.map((item, index) => (
          <ThreadContent key={index} data={item} />
        ))}
      </BaseLayout>
    );
  }
}

export default Index;
