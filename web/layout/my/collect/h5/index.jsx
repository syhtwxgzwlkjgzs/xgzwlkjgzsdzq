import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import ThreadContent from '@components/thread';
import { Toast } from '@discuzq/design';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';

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
        content: favoriteResp.msg || '取消收藏失败',
        duration: 2000,
      });
    } else {
      Toast.success({
        content: '取消收藏成功',
        duration: 2000,
      });
      pageData.splice(pageData.indexOf(item), 1);
      this.props.index.setThreads({ pageData: [...pageData] });
    }
  };

  render() {
    const { index } = this.props;
    const { pageData = [], currentPage, totalPage, totalCount } = index.threads || {};
    return (
      <BaseLayout
        showLoadingInCenter={!pageData?.length}
        showHeader={true}
        noMore={currentPage >= totalPage}
        onRefresh={this.props.dispatch}
      >
        {pageData?.length !== 0 && (
          <div className={styles.titleBox}>
            <span className={styles.num}>{`${totalCount || 0}`}</span>
            条收藏
          </div>
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

export default withRouter(Index);
