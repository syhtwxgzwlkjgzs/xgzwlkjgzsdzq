import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import MessageCard from '@components/message/message-card';
import Notice from '@components/message/notice';
import { PullDownRefresh, ScrollView } from '@discuzq/design';

import styles from './index.module.scss';

@inject('message')
@observer
export class MessageIndex extends Component {
  constructor(props) {
    super(props);
    this.pullDownRef = React.createRef();
  }

  state = {
    type: 'chat',
    finished: true,
    isReachingTop: false,
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

  handleScroll = ({ scrollTop }) => {
    // 只有在顶部才刷新
    if (scrollTop <= 0) {
      this.setState({ isReachingTop: true });
    } else {
      this.setState({ isReachingTop: false });
    }
  };

  handleRefresh = () => {
    const { message } = this.props;
    this.setState({ finished: false });
    setTimeout(async () => {
      await message.readDialogList(1);
      this.setState({ finished: true });
    }, 3000);
  };

  handleScrollBottom = () => {
    const { message } = this.props;
    return message.readDialogList(message.initList.currentPage + 1);
  };

  formatChatDialogList = (dialogList) => {
    const newList = [];
    dialogList.forEach(({ dialogMessage, sender }) => {
      newList.push({
        id: dialogMessage?.id || '',
        dialogId: dialogMessage?.dialogId || '',
        createdAt: dialogMessage?.createdAt || 0,
        content: dialogMessage?.summary || '',
        title: '',
        avatar: sender?.avatar || '',
        userId: sender?.userId || '',
        userName: sender?.username || '',
      });
    });

    return newList;
  };

  async componentDidMount() {
    await this.props.message.readDialogList(1);
    const { threadUnread, financialUnread, accountUnread } = this.props.message;
    const cardContent = [...this.state.cardContent];
    cardContent[0].totalCount = threadUnread;
    cardContent[1].totalCount = financialUnread;
    cardContent[2].totalCount = accountUnread;

    this.setState({ cardContent });
  }

  render() {
    const { cardContent, type, finished, isReachingTop } = this.state;
    const { dialogList } = this.props.message;
    const newDialogList = this.formatChatDialogList(dialogList.list);

    return (
      <div className={styles.container} ref={this.pullDownRef}>
        <PullDownRefresh
          className={styles.pullDownContainer}
          onRefresh={this.handleRefresh.bind(this)}
          isFinished={finished}
          isScrollView
          isReachTop={isReachingTop}
        >
          <Notice
            topCard={<MessageCard cardItems={cardContent} />}
            list={newDialogList}
            type={type}
            onBtnClick={this.handleDelete}
            onScrollBottom={this.handleScrollBottom}
            onScroll={this.handleScroll}
          />
        </PullDownRefresh>
      </div>
    );
  }
}

export default MessageIndex;
