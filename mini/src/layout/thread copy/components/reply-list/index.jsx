import React from 'react';
import { View, Text } from '@tarojs/components';
import { observer } from 'mobx-react';
import Avatar from '@components/avatar';
import { diffDate } from '@common/utils/diff-date';
import styles from './index.module.scss';

@observer
class ReplyList extends React.Component {
    static async getInitialProps() {
        return {
            
        };
    }
    constructor(props) {
      super(props);
      this.state = {};
    }

  // 跳转至评论详情
  toCommentDetail() {
    console.log('跳至评论详情');
  }

  likeClick() {
    typeof this.props.likeClick === 'function' && this.props.likeClick();
  }
  replyClick() {
    typeof this.props.replyClick === 'function' && this.props.replyClick();
  }

  generatePermissions(data = {}) {
    return {
      canApprove: data.canApprove || false,
      canDelete: data.canDelete || false,
      canEdit: data.canEdit || false,
      canHide: data.canLike || false,
      canLike: data.canLike || false,
    };
  }

  render() {
    const { canLike } = this.generatePermissions(this.props.data);

    return (
      <View className={styles.replyList}>
        <View className={styles.replyListAvatar} onClick={this.props.avatarClick('2')}>
          <Avatar
            className={styles.avater}
            image={this.props.data.user.avatar}
            name={this.props.data.user.username || this.props.data.user.userName || ''}
            circle={!!true}
            size='small'>
          </Avatar>
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
                      <Avatar
                        className={styles.avater}
                        image={this.props.data.user.avatar}
                        name={this.props.data.user.username || this.props.data.user.userName || ''}
                        circle
                        size='small'>
                      </Avatar>
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
              <View className={this.props?.data?.isLiked ? styles.replyLike : styles.replyLiked}>
                <Text onClick={() => this.likeClick(canLike)}>
                  赞&nbsp;{ this.props?.data?.likeCount === 0 ? '' :  this.props.data.likeCount}
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

export default ReplyList;