import React from 'react';
import { View, Text } from '@tarojs/components';
// import Avatar from '@components/avatar';
import { diffDate } from '@common/utils/diff-date';
import styles from './index.module.scss';

export default class ReplyList extends React.Component {
    static async getInitialProps() {
        return {
            
        };
    }
    constructor(props) {
      super(props);
      this.state = {
        isLiked: this.props.data.isLiked,
        likeCount: this.props.data.likeCount,
      };
    }

  // 跳转至评论详情
  toCommentDetail() {
    console.log('跳至评论详情');
  }

  likeClick() {
    this.setState({
      isLiked: !this.state.isLiked,
    }, () => {
      this.setState({
        likeCount: this.state.isLiked ? this.state.likeCount + 1 : this.state.likeCount - 1,
      });
    });
    typeof this.props.likeClick === 'function' && this.props.likeClick();
  }
  replyClick() {
    typeof this.props.replyClick === 'function' && this.props.replyClick();
  }

  render() {
    return (
      <View className={styles.replyList}>
        <View className={styles.replyListAvatar} onClick={this.props.avatarClick('2')}>
        <View className={styles.avater}>头</View>
          {/* <Avatar
            image={this.props.data.user.avatar}
            name={this.props.data.user.username || this.props.data.user.userName || ''}
            circle={true}
            size='small'>
          </Avatar> */}
        </View>
        <View className={styles.replyListContent}>
          <View className={styles.replyListContentText}>
            <View className={styles.replyListName}>
              {this.props.data.user.username || this.props.data.user.userName}
            </View>
            <View className={styles.replyListText}>
              {
                this.props.data.commentUserId
                  ? <View className={styles.commentUser}>
                    <View className={styles.replyedAvatar} onClick={this.props.avatarClick('3')}>
                        <View className={styles.avater}>头</View>
                      {/* <Avatar
                        image={this.props.data.user.avatar}
                        name={this.props.data.user.username || this.props.data.user.userName || ''}
                        circle={true}
                        size='small'>
                      </Avatar> */}
                    </View>
                    <Text className={styles.replyedUserName}>
                      {this.props.data.replyUser.username || this.props.data.replyUser.userName }
                    </Text>
                  </View> : ''
              }
              <Text onClick={() => this.props.toCommentDetail()}>{this.props.data.content}</Text>
            </View>
          </View>
          <View className={styles.replyListFooter}>
            <View className={styles.replyTime}>{diffDate(this.props.data.createdAt)}</View>
            <View className={styles.extraBottom}>
              <View className={this.state.isLiked ? styles.replyLike : styles.replyLiked}>
                <Text onClick={() => this.likeClick()}>
                  赞&nbsp;{this.state.likeCount === 0 ? '' : this.state.likeCount}
                </Text>
              </View>
              <View className={styles.replyReply}>
                <Text onClick={() => this.replyClick()}>回复</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
