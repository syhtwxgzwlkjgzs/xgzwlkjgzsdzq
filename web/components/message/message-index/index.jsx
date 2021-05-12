import React, { Component, memo } from 'react';
import { inject, observer } from 'mobx-react';

import MessageCard from '@components/message/message-card';
import Notice from '@components/message/notice';
import List from '@components/list';
import { PullDownRefresh } from '@discuzq/design';

import styles from './index.module.scss';

@inject('message')
@observer
export class MessageIndex extends Component {
  state = {
    type: 'chat',
    finished: true,
    cardContent: [
      {
        iconName: 'RemindOutlined',
        title: '帖子通知',
        link: '/message/?page=thread',
        totalCount: this.props.message.threadUnread,
      },
      {
        iconName: 'RenminbiOutlined',
        title: '财务通知',
        link: '/message/?page=financial',
        totalCount: this.props.message.financialUnread,
      },
      {
        iconName: 'LeaveWordOutlined',
        title: '账号消息',
        link: '/message/?page=account',
        totalCount: this.props.message.accountUnread,
      },
    ],
  };

  handleDelete = (item) => {
    const { message } = this.props;
    message.deleteDialog(item.id);
  };

  handleRefresh = () => {
    const { message } = this.props;
    this.setState({ finished: false });
    setTimeout(async () => {
      await message.readDialogList(message.dialogList.currentPage);
      this.setState({ finished: true });
    }, 200);
  };

  handleScrollBottom = () => {
    const { message } = this.props;
    return message.readDialogList(2);
  };

  formatChatDialogList = (dialogList) => {
    const newList = [];
    for (const item of dialogList) {
      if (!item.dialogMessage || !item.sender) continue;
      newList.push({
        id: item.dialogMessage.id,
        dialogId: item.dialogMessage.dialogId,
        createdAt: item.dialogMessage.createdAt || 0,
        content: item.dialogMessage.summary || '',
        title: '',
        avatar: item.sender.avatar || '',
        userId: item.sender.userId,
        userName: item.sender.username,
      });
    }

    return newList;
  };

  componentDidMount() {
    this.props.message.readDialogList(1);
  }

  render() {
    const { cardContent, type, finished } = this.state;
    const { dialogList } = this.props.message;
    const newDialogList = this.formatChatDialogList(dialogList.list);

    return (
      <div className={styles.container}>
        <PullDownRefresh className={styles.pullDownContainer} onRefresh={this.handleRefresh} isFinished={finished}>
          <List
            height={'100vh'}
            noMore={dialogList.currentPage >= dialogList.totalPage}
            onRefresh={this.handleScrollBottom}
          >
            <MessageCard cardItems={cardContent} />
            <Notice
              list={newDialogList}
              type={type}
              onBtnClick={this.handleDelete}
              // onScrollBottom={this.handleScrollBottom}
            />
          </List>
        </PullDownRefresh>
      </div>
    );
  }
}

export default memo(MessageIndex);
