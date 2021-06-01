import React from 'react'
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';

import Card from '../message-card';
import Notice from '../notice';

@inject('site')
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
          iconName: 'DiscussOutlined',
          title: '回复我的',
          link: '/message?page=account&subPage=reply',
          totalCount: 0,
        },
        {
          iconName: 'PraiseOutlined',
          title: '点赞我的',
          link: '/message?page=account&subPage=like',
          totalCount: 0,
        },
      ],
      funcType: 'readAccountMsgList',
      type: 'accountMsgList', // 账户消息类型 accountMsgList，atMsgList,replyMsgList,likeMsgList
    }
  }

  // 初始化
  async componentDidMount() {
    const { router } = this.props;
    const { subPage } = router.query;
    if (subPage) await this.switchTypeByQuery(subPage);
    await this.fetchMessageData(1);
    !subPage && this.setUnReadCount();
  }

  // 处理路由query切换
  async componentWillReceiveProps(nextProps) {
    if (this.props.subPage === nextProps.subPage) return;
    await this.switchTypeByQuery(nextProps.subPage);
    this.fetchMessageData(1)
  }

  // 转换账户信息渲染类型
  switchTypeByQuery = async (subPage) => {
    switch (subPage) {
      case 'at':
        await this.setState({
          funcType: 'readAtMsgList',
          type: 'atMsgList'
        });
        break;
      case 'reply':
        await this.setState({
          funcType: 'readReplyMsgList',
          type: 'replyMsgList'
        });
        break;
      case 'like':
        await this.setState({
          funcType: 'readLikeMsgList',
          type: 'likeMsgList'
        });
        break;
      default:
        await this.setState({
          funcType: 'readAccountMsgList',
          type: 'accountMsgList'
        });
    }
  }

  // 请求数据
  fetchMessageData(initPage = 0) {
    const { message } = this.props;
    const { funcType, type } = this.state;
    const { currentPage } = message[type];
    return message[funcType](initPage || currentPage + 1);
  }

  setUnReadCount = () => {
    const { atUnread, replyUnread, likeUnread } = this.props.message;
    const items = [...this.state.items];
    items[0].totalCount = atUnread;
    items[1].totalCount = replyUnread;
    items[2].totalCount = likeUnread;
    this.setState({ items });
  }

  // 处理、过滤数据
  handleRenderList = (data = []) => {
    let list = [];
    data.forEach(item => {
      list.push({
        id: item.id,
        createdAt: item.createdAt,
        threadId: item.threadId,
        content: item.isFirst ? (item.threadTitle || item.postContent) : item.postContent,
        type: item.type,
        avatar: item.userAvatar,
        userId: item.userId,
        username: item.username,
      })
    });

    return list;
  }

  // 跳转其它账户消息
  toOtherMessage = (link) => {
    this.props.router.push(link);
  }

  // 处理账号消息删除
  handleAccountDelete = (item) => {
    const { deleteMsg } = this.props.message;
    deleteMsg(item.id, this.state.type)
  }

  render() {
    const { site: { isPC }, message, router } = this.props;
    const { type, items } = this.state;
    const { subPage } = router.query;
    const { list, currentPage, totalPage, totalCount } = message[type];
    const renderList = this.handleRenderList(list);
    const card = <Card type={subPage} cardItems={items} onClick={this.toOtherMessage} />;

    return (
      <div className={`${styles.wrapper} ${isPC ? styles.pc : ""}`}>
        <Notice
          infoIdx={3}
          totalCount={totalCount}
          noMore={currentPage >= totalPage}
          showHeader={!isPC}
          // topCard={(isPC || type === 'accountMsgList') ? card : null}
          topCard={isPC ? card : null}
          list={renderList}
          type='account'
          onPullDown={() => this.fetchMessageData(1)}
          onScrollBottom={() => this.fetchMessageData()}
          onBtnClick={this.handleAccountDelete}
        />
      </div>
    )
  }
}

export default withRouter(Index);