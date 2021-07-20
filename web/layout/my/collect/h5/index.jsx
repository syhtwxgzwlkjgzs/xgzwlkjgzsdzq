import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import ThreadContent from '@components/thread';
import { Toast } from '@discuzq/design';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import throttle from '@common/utils/thottle.js';

@inject('site')
@inject('index')
@inject('thread')
@observer
class Index extends React.Component {
  handleUnFavoriteItem = throttle(async (item) => {
    const { index } = this.props;
    const { pageData = [], totalCount = 0 } = index.threads || {};
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
      let collectTotalCount = totalCount;
      Toast.success({
        content: '取消收藏成功',
        duration: 2000,
      });
      // 这里需要对收藏条数做单独处理
      collectTotalCount--;
      if (collectTotalCount <= 0) {
        collectTotalCount = 0;
      }
      // FIXME: 这里采用数组截取的方式也直接改变了原数据--不安全
      pageData.splice(pageData.indexOf(item), 1);
      this.props.index.setThreads({ ...index.threads, totalCount: collectTotalCount, pageData: [...pageData] });
    }
  }, 1000);

  render() {
    const { index } = this.props;
    const { pageData = [], currentPage, totalPage, totalCount } = index.threads || {};
    return (
      <BaseLayout
        pageName={'collect'}
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
