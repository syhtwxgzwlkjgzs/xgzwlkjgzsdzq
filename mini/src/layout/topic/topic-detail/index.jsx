import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import List from '@components/list';
import NoData from '@components/no-data';
import DetailsHeader from './components/details-header'
import ThreadContent from '@components/thread';
import h5Share from '@discuzq/sdk/dist/common_modules/share/h5';
import goToLoginPage from '@common/utils/go-to-login-page';
import { Toast } from '@discuzq/design';
import { View, Text } from '@tarojs/components';

@inject('site')
@inject('user')
@inject('topic')
@observer
class TopicPage extends React.Component {

  // 分享
  onShare = (e) => {
    e.stopPropagation();

    // 对没有登录的先登录
    if (!this.props.user.isLogin()) {
      Toast.info({ content: '请先登录!' });
      goToLoginPage({ url: '/user/login' });
      return;
    }

    Toast.info({ content: '分享链接已复制成功' });

    const { content = '' } = this.props.topic?.topicDetail?.pageData[0] || {};
    h5Share(content);

  }

  renderItem = ({ content = '', threadCount = 0, viewCount = 0, threads = [] }, index) => {
    return (
      <View key={index}>
        <DetailsHeader title={content} viewNum={viewCount} contentNum={threadCount} onShare={this.onShare} />
        <View className={styles.themeContent}>
          {
            threads?.length ?
              (
                threads?.map((item, index) => (
                  <ThreadContent data={item} key={index} className={styles.item} />
                ))
              )
              : <NoData />
          }
        </View>
      </View>
    )
  }

  render() {
    const { pageData = [] } = this.props.topic?.topicDetail || {};
    console.log(pageData, 'renderItem');
    return (
      <List className={styles.topicWrap} allowRefresh={false}>
        {
          pageData?.map((item, index) => this.renderItem(item, index)) || <NoData />
        }
      </List>
    );
  }
}
export default TopicPage;
