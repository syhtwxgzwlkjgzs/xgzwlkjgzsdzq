import React from 'react';
import styles from './index.module.scss';
import { Avatar, Icon } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';

import Input from '../input/index';

export default class ReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowInput: false, // 是否显示input框
      isPostDetail: this.props.isPostDetail,
      isLiked: this.props.data.isLiked,
      likeCount: this.props.data.likeCount,
    };
  }
  static async getInitialProps() {
    return {

    };
  }
  // 跳转至评论详情
  toCommentDetail() {
    console.log('跳至评论详情');
  }

  replyClick() {
    this.props.replyClick(this.props.data);
    this.setState({ isShowInput: !this.state.isShowInput });
  }

  likeClick() {
    this.setState({
      isLiked: !this.state.isLiked,
    }, () => {
      this.setState({
        likeCount: this.state.isLiked ? this.state.likeCount + 1 : this.state.likeCount - 1,
      });
    });
    this.props.likeClick(this.props.data);
  }

  render() {
    const { createReply, deleteClick, avatarClick } = this.props;
    return (
      <div>
        <div className={styles.replyList}>
          <div className={styles.replyListAvatar} onClick={() => avatarClick('2')}>
            <Avatar image={this.props.data.user.avatar} circle={true} size={'small'}></Avatar>
          </div>
          <div className={styles.replyListContent}>
            <div className={styles.replyListContentText}>
              <div className={styles.replyListName}>
                {this.props.data.user.username}
              </div>
              <div className={styles.replyListText}>
                {
                  this.props.data.commentUserId
                    ? <div className={styles.commentUser}>
                      <div className={styles.replyedAvatar} onClick={() => avatarClick('3')}>
                        <Avatar image={this.props.data.user.avatar} circle={true} size={'small'}></Avatar>
                      </div>
                      <span className={styles.replyedUserName}>
                        {this.props.data.replyUser.username}
                      </span>
                    </div> : ''
                }
                <span onClick={() => this.props.toCommentDetail()}>{this.props.data.content}</span>
              </div>
            </div>
            <div className={styles.replyListFooter}>
              <div className={styles.replyTime}>{this.props.data.createdAt.split(' ')[1]}</div>
              <div className={styles.extraBottom}>
                <div className={this.state.isLiked ? styles.replyLike : styles.replyLiked}>
                  <Icon
                    name='LikeOutlined'
                    size='16'
                    className={styles.btnIcon}>
                  </Icon>
                  <span onClick={() => this.likeClick()}>
                    赞{this.state.likeCount === 0 ? '' : this.state.likeCount}
                  </span>
                </div>
                <div className={styles.replyReply}>
                    <Icon
                      name='MessageOutlined'
                      size='16'
                      className={styles.btnIcon}>
                    </Icon>
                  <span onClick={() => this.replyClick()}>回复</span>
                </div>
                {
                  this.state.isPostDetail ? ''
                    : <div className={styles.replyDelete}>
                      <Icon
                        name='MessageOutlined'
                        size='16'
                        className={styles.btnIcon}>
                      </Icon>
                    <span onClick={() => deleteClick(this.props.data.id)}>删除</span>
                  </div>
                }
              </div>
            </div>
        {
          this.state.isShowInput ? <div className={styles.input}>
            <Input onSubmit={createReply} height='label'></Input>
          </div> : ''
        }
          </div>

        </div>
      </div>
    );
  }
}
