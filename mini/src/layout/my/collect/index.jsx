import React from 'react';
import { inject, observer } from 'mobx-react';
import ThreadContent from '@components/thread';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import { View, Text } from '@tarojs/components';
import Toast from '@discuzq/design/dist/components/toast';

@inject('site')
@inject('index')
@inject('thread')
@observer
class Index extends React.Component {
  handleUnFavoriteItem = async (item) => {
    const { index } = this.props;
    const { pageData = [] } = index.threads || {};
    const params = {
      id: item.threadId,
      isFavorite: false,
    };
    const favoriteResp = await this.props.thread.updateFavorite(params);
    if (favoriteResp.success === false) {
      Toast.error({
        content: favoriteResp.msg,
        duration: 2000,
      });
    } else {
      Toast.success({
        content: '取消收藏成功',
        duration: 2000,
      });
      pageData.splice(pageData.indexOf(item), 1);
      this.props.index.setThreads({ pageData: [...pageData] });
      this.props.dispatch();
    }
  };

  render() {
    const { index } = this.props;
    const { pageData = [], currentPage, totalPage, totalCount } = index.threads || {};
    return (
      <BaseLayout
        showLoadingInCenter={!pageData?.length}
        showHeader={false}
        noMore={currentPage >= totalPage}
        onRefresh={this.props.dispatch}
      >
        {pageData?.length !== 0 && (
          <View className={styles.titleBox}>
            <Text className={styles.num}>{`${totalCount || 0}`}</Text>
            条收藏
          </View>
        )}

        {pageData?.map((item, index) => (
          <ThreadContent
            onClickIcon={async () => {
              this.handleUnFavoriteItem(item);
            }}
            isShowIcon
            key={index}
            data={item}
          />
        ))}
      </BaseLayout>
    );
  }
}

export default Index;
