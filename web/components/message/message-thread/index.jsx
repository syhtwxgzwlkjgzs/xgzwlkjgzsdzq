import React from 'react'
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

import Header from '@components/header';
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

  // 触底请求数据
  handleThreadBottom = () => {
    return this.fetchMessageData();
  }

  // 处理帖子消息删除
  handleThreadDelete = (item) => {
    const { deleteMsg } = this.props.message;
    deleteMsg(item.id, 'threadMsgList')
  }

  render() {
    const {isPC} = this.props.site;
    const { threadMsgList: data } = this.props.message;
    return (
      <div className={styles.wrapper}>
        {!isPC && <Header />}
        <Notice
          infoIdx={1}
          totalCount={data.totalCount}
          height='calc(100vh - 40px)'
          noMore = { data.currentPage >= data.totalPage }
          list={data.list}
          type='thread'
          onScrollBottom={this.handleThreadBottom}
          onBtnClick={this.handleThreadDelete}
        />
      </div>
    )
  }
}

export default Index;