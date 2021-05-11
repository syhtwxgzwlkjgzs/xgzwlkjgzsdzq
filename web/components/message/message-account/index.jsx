import React, { memo } from 'react'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
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
          link: '/message?page=account&subPage=at',
          totalCount: 0,
        },
        {
          iconName: 'MessageOutlined',
          title: '回复我的',
          link: '/message?page=account&subPage=reply',
          totalCount: 0,
        },
        {
          iconName: 'LikeOutlined',
          title: '点赞我的',
          link: '/message?page=account&subPage=like',
          totalCount: 0,
        },
      ],
      type: 'accountMsgList'
    }
  }

  // componentDidMount() {
  //   console.log(111);
  //   const { readAccountMsgList, readAtMsgList, readReplyMsgList, readLikeMsgList } = this.props.message;
  //   readAccountMsgList(1);
  // }

  componentWillReceiveProps() {
    console.log(arguments);
  }

  toOtherMessage = (link) => {
    this.props.router.push(link);
  }

  getRenderList = () => {
    const { message } = this.props;
    const {type} = this.state;
    let list = [];
    message[type].list.forEach(item => {
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
    const card = <Card cardItems={this.state.items} redirectCallback ={this.toOtherMessage}/>
    return (
      <div className={styles.wrapper}>
        <Notice
          topCard={card}
          list={list}
          type='account'
          onScrollBottom={this.handleAccountBottom}
          onBtnClick={this.handleAccountDelete}
        />
      </div>
    )
  }
}

export default withRouter(Index);