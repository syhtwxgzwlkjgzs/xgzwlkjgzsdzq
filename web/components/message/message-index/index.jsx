import React, { Component, memo } from 'react';
import { inject, observer } from 'mobx-react';

import MessageCard from '@components/message/message-card';
import Notice from '@components/message/notice';
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
    return message.readDialogList(message.initList.currentPage);
  };

  formatChatDialogList = (dialogList) => {
    const newList = [];
    dialogList.forEach(({ dialogMessage, sender }, idx) => {
      newList.push({
        id: dialogMessage?.id ? dialogMessage.id : '',
        dialogId: dialogMessage?.dialogId ? dialogMessage.dialogId : '',
        createdAt: dialogMessage?.createdAt ? dialogMessage.createdAt : 0,
        content: dialogMessage?.summary ? dialogMessage.summary : '',
        title: '',
        avatar: sender?.avatar ? sender.avatar : '',
        userId: sender?.userId ? sender.userId : '',
        userName: sender?.username ? sender.username : '',
      });
    });
    for (const item of dialogList) {
      if (!item.dialogMessage || !item.sender) continue;
    }

    return newList;
  };

  async componentDidMount() {
    const { cardContent } = this.state;
    const { readDialogList, threadUnread, financialUnread, accountUnread } = this.props.message;

    cardContent[0].totalCount = threadUnread;
    cardContent[1].totalCount = financialUnread;
    cardContent[2].totalCount = accountUnread;

    this.setState({ cardContent });
    await readDialogList(1);
  }

  render() {
    const { cardContent, type, finished } = this.state;
    const { dialogList } = this.props.message;
    const newDialogList = this.formatChatDialogList(dialogList.list);

    return (
      <div className={styles.container}>
        <PullDownRefresh className={styles.pullDownContainer} onRefresh={this.handleRefresh} isFinished={finished}>
          <Notice
            topCard={<MessageCard cardItems={cardContent} />}
            list={newDialogList}
            type={type}
            onBtnClick={this.handleDelete}
            onScrollBottom={this.handleScrollBottom}
          />
        </PullDownRefresh>
      </div>
    );
  }
}

export default memo(MessageIndex);
