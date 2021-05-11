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
    refreshing: true,
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
    const { dialogList } = this.props.message;
    const _dialogList = [...dialogList].filter((i) => i.id !== item.id);
    this.setState({ dialogList: _dialogList });
  };

  onRefresh = () => {
    this.setState({ refreshing: false });
    setTimeout(async () => {
      await this.props.message.readDialogList(2);
      this.setState({ refreshing: true, dialogList: this.props.message.dialogList });
    }, 1000);
  };

  formatChatDialogList = (dialogList) => {
    const newList = [];
    dialogList.forEach((item) => {
      newList.push({
        id: item.dialogMessage.id,
        dialogId: item.dialogMessage.dialogId,
        createdAt: item.dialogMessage.createdAt,
        content: item.dialogMessage.summary,
        title: '',
        avatar: item.sender.avatar,
        userId: item.sender.userId,
        userName: item.sender.username,
      });
    });
    return newList;
  };

  componentDidMount() {
    this.props.message.readDialogList(1);
    this.setState({ dialogList: this.props.message.dialogList });
  }

  render() {
    const { cardContent, type, refreshing } = this.state;
    const { dialogList } = this.props.message;
    // console.log('message: ', this.props.message);
    // console.log('dialog: ', dialogList);
    const newDialogList = this.formatChatDialogList(dialogList);
    // console.log(newDialogList);

    return (
      <div className={styles.container}>
        <PullDownRefresh onRefresh={this.onRefresh} isFinished={refreshing} height={800}>
          <MessageCard cardItems={cardContent} />
          <List className={styles.searchWrap} onRefresh={this.fetchMoreData}>
            <Notice list={newDialogList} type={type} onBtnClick={this.handleDelete} />
          </List>
        </PullDownRefresh>
      </div>
    );
  }
}

export default memo(MessageIndex);
