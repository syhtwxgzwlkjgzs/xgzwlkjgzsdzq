import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import NoData from '@components/no-data';
import DetailsHeader from './components/details-header'
import ThreadContent from '@components/thread';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import goToLoginPage from '@common/utils/go-to-login-page';
import Toast from '@discuzq/design/dist/components/toast/index';
import { View, Text } from '@tarojs/components';
import BottomView from '@components/list/BottomView'

@inject('site')
@inject('user')
@inject('topic')
@observer
class TopicH5Page extends React.Component {



  renderItem = ({ content = '', threadCount = 0, viewCount = 0, threads = [] }, index) => <View className={styles.themeContent} key={index}>
      <DetailsHeader title={content} viewNum={viewCount} contentNum={threadCount} onShare={this.onShare} />
        {
          threads?.length ?
            (
              threads?.map((item, itemIndex) => (
                <ThreadContent data={item} key={itemIndex} className={styles.item} />
              ))
            )
            : <NoData />
        }
      </View>
      
  render() {
    const { pageData } = this.props.topic?.topicDetail || {};
    const { isError, errorText, fetchTopicInfoLoading = true } = this.props
    return (
      <BaseLayout showHeader={false} allowRefresh={false}>
        {
          fetchTopicInfoLoading ? (
            <BottomView loadingText='加载中...' isError={isError} errorText={errorText} />
          )
          : (
            pageData?.map((item, index) => (
              this.renderItem(item, index))
            )
          )
        }
      </BaseLayout>
    );
  }
}
export default TopicH5Page;
