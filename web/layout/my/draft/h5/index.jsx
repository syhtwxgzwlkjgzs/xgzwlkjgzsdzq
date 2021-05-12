/**
 * 侧滑删除组件详情参考 https://github.com/sandstreamdev/react-swipeable-list
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import BaseLayout from '@components/base-layout';
import ThreadCenterView from '@components/thread/ThreadCenterView';
import NoData from '@components/no-data';
import styles from './index.module.scss';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';

@inject('index')
@observer
class H5 extends React.Component {
  renderContent = () => {
    const { index } = this.props;
    const list = (index.threads && index.threads.pageData) || [];
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          { this.props.index.threads?.totalCount || 0 }&nbsp;条草稿
        </div>
        <div className={styles.content}>
          {list.length === 0 && <NoData />}
          {list.map((item, index) => (
            <SwipeableListItem
              key={index}
              swipeLeft={{
                content: <div className={styles['item-delete']}>删除</div>,
                action: () => {
                  console.log('jjj');
                  this.props.onDelete(item);
                },
              }}
            >
              <div className={styles.item} onClick={() => this.props.onEdit(item)}>
                <ThreadCenterView data={item} />
                <div className={styles['item-time']}>编辑于&nbsp;{item.diffTime}</div>
              </div>
            </SwipeableListItem>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { index } = this.props;
    const { currentPage, totalPage } = index.threads || {};
    return (
      <BaseLayout
        onRefresh={() => this.props.dispatch(true)}
        noMore={currentPage >= totalPage}
        showRefresh={false}
      >
        {this.renderContent()}
      </BaseLayout>
    );
  }
}

export default H5;
