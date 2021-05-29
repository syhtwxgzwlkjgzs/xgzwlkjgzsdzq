import React from 'react'
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

import Notice from '../notice';

@inject('site')
@inject('message')
@observer
class Index extends React.Component {
  // 初始化
  async componentDidMount() {
    this.fetchMessageData(1);
  }

  // 请求数据
  fetchMessageData(initPage = 0) {
    const { readThreadMsgList, threadMsgList: { currentPage } } = this.props.message;
    return readThreadMsgList(initPage || currentPage + 1);
  }



  // 处理帖子消息删除
  handleThreadDelete = (item) => {
    const { deleteMsg } = this.props.message;
    deleteMsg(item.id, 'threadMsgList')
  }

  render() {
    const { site: { isPC }, message: { threadMsgList } } = this.props;
    const { list, currentPage, totalPage, totalCount } = threadMsgList;

    return (
      <div className={`${styles.wrapper} ${isPC ? styles.pc : ""}`}>
        <Notice
          infoIdx={1}
          totalCount={totalCount}
          noMore={currentPage >= totalPage}
          showHeader={!isPC}
          list={list}
          type='thread'
          onPullDown={() => this.fetchMessageData(1)}
          onScrollBottom={() => this.fetchMessageData()}
          onBtnClick={this.handleThreadDelete}
        />
      </div>
    )
  }
}

export default Index;