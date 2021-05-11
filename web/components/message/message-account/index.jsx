import React, { memo } from 'react'
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

import Card from '../message-card';
import Notice from '../notice';

@inject('message')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          iconName: 'AtOutlined',
          title: '@我的',
          link: '',
          totalCount: 0,
        },
        {
          iconName: 'MessageOutlined',
          title: '回复我的',
          link: '',
          totalCount: 0,
        },
        {
          iconName: 'LikeOutlined',
          title: '点赞我的',
          link: '',
          totalCount: 0,
        },
      ]
    }
  }

  getRenderList = () => {
    const { accountMsgList } = this.props.message;
    let list = [];
    accountMsgList.list.forEach(item => {
      list.push({
        id: item.id,
        createdAt: item.createdAt,
        threadId: item.threadId,
        content: item.postContent,
        title: item.threadTitle,
        type: item.type,
        avatar: item.userAvatar,
        userId: item.userId,
        userName: item.username,
      })
    });

    return list;
  }

  // 处理账号列表触底
  handleAccountBottom = () => {
    const { readAccountMsgList } = this.props.message;
    console.log(' bottom');
    // tip: 监听上拉触底之后，一定要返回Promise对象
    return readAccountMsgList(2);
  }

  // 处理账号消息删除
  handleAccountDelete = (item) => {
    const { deleteMsg } = this.props.message;
    deleteMsg(item.id, 'accountMsgList')
  }

  render() {
    const list = this.getRenderList();
    const card = <Card cardItems={this.state.items} />
    return (
      <div className={styles.wrapper}>
        <Notice
          topCard={card}
          list={list}
          type='account'
          onScrollBottom={this.handleAccountBottom}
          onBtnClick={this.handleAccountDelete}
          {...this.props}
        />
      </div>
    )
  }
}

export default Index;