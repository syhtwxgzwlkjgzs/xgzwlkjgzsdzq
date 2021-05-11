import React, { Component, memo } from 'react';
import { inject, observer } from 'mobx-react';

import MessageCard from '@components/message/message-card';
import Notice from '@components/message/notice';

import styles from './index.module.scss';

@inject('message')
@observer
export class MessageIndex extends Component {
  state = {
    dialogList: [],
    type: 'chat',
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
    const _dialogList = [...dialogList].filter((i) => i.id !== item.id);
    this.setState({ dialogList: _dialogList });
  };

  async componentDidMount() {
    console.log(this.props);
    const list = await this.props.message.readDialogList(1);
    this.setState({ dialogList: list });
  }

  render() {
    const { dialogList, cardContent, type } = this.state;
    // const { threadUnread, financialUnread, accountUnread, readDialogList } = this.message;

    return (
      <div className={styles.container}>
        <MessageCard cardItems={cardContent} />
        <Notice list={dialogList} type={type} onBtnClick={this.handleDelete} />
      </div>
    );
  }
}

export default memo(MessageIndex);
