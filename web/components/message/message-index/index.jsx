import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';

import Card from '@components/message/message-card';
import Notice from '@components/message/notice';
import BottomNavBar from '@components/bottom-nav-bar';

@inject('site')
@inject('message')
@observer
export class MessageIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'chat',
      items: [
        {
          iconName: 'RemindOutlined',
          title: '帖子通知',
          link: '/message/?page=thread',
          totalCount: 0,
        },
        {
          iconName: 'RenminbiOutlined',
          title: '财务通知',
          link: '/message/?page=financial',
          totalCount: 0,
        },
        {
          iconName: 'LeaveWordOutlined',
          title: '账号消息',
          link: '/message/?page=account',
          totalCount: 0,
        },
      ],
    };
  }

  async componentDidMount() {
    await this.props.message.readDialogList(1);
    const { threadUnread, financialUnread, accountUnread } = this.props.message;
    const items = [...this.state.items];
    items[0].totalCount = threadUnread;
    items[1].totalCount = financialUnread;
    items[2].totalCount = accountUnread;

    this.setState({ items });
  }

  formatChatDialogList = (data = []) => {
    const newList = [];
    data.forEach((item) => {
      const { dialogMessage, sender } = item;
      newList.push({
        id: item.id,
        createdAt: dialogMessage?.createdAt,
        dialogId: dialogMessage?.dialogId,
        content: dialogMessage?.summary,
        avatar: sender?.avatar,
        userId: sender?.userId,
        username: sender?.username,
        unreadCount: item.unreadCount,
      });
    });

    return newList;
  };

  handleDelete = (item) => {
    const { message } = this.props;
    message.deleteDialog(item.id);
  };

  onPullDown = () => {
    const { message } = this.props;
    return message.readDialogList(1);
  };

  handleScrollBottom = () => {
    const { message } = this.props;
    return message.readDialogList(message.dialogList.currentPage + 1);
  };

  // 跳转其它消息类型
  toOtherMessage = (link) => {
    this.props.router.push(link);
  }

  render() {
    const { items } = this.state;
    const { isPC } = this.props.site;
    const card = <Card cardItems={items} onClick={this.toOtherMessage} />;
    const { dialogList } = this.props.message;
    const newDialogList = this.formatChatDialogList(dialogList.list);

    return (
      <div className={styles.wrapper}>
        <Notice
          infoIdx={0}
          totalCount={dialogList.totalCount}
          height='calc(100vh - 64px)'
          withBottomBar={true}
          noMore={dialogList.length === 0 || dialogList.currentPage >= dialogList.totalPage}
          topCard={isPC ? null : card}
          list={newDialogList}
          type='chat'
          onPullDown={this.onPullDown}
          onScrollBottom={this.handleScrollBottom}
          onBtnClick={this.handleDelete}
        />
        {!isPC && <BottomNavBar placeholder={false} curr={'message'} />}
      </div>);
  }
}

export default withRouter(MessageIndex);
