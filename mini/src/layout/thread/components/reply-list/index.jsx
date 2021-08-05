import React from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { View, Text } from '@tarojs/components';
import { diffDate } from '@common/utils/diff-date';
import { observer } from 'mobx-react';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import classNames from 'classnames';
import ImageDisplay from '@components/thread/image-display';
import RichText from '@discuzq/design/dist/components/rich-text/index';
import { handleLink } from '@components/thread/utils';
import Router from '@discuzq/sdk/dist/router';
import { debounce } from '@common/utils/throttle-debounce';
import { urlToLink } from '@common/utils/replace-url-to-a';
import PostContent from '@components/thread/post-content';

@observer
export default class ReplyList extends React.Component {
  // 跳转至评论详情
  toCommentDetail() {}

  likeClick() {
    typeof this.props.likeClick === 'function' && this.props.likeClick();
  }
  replyClick() {
    typeof this.props.replyClick === 'function' && this.props.replyClick();
  }
  deleteClick() {
    typeof this.props.likeClick === 'function' && this.props.deleteClick();
  }

  avatarClick(floor) {
    typeof this.props.avatarClick === 'function' && this.props.avatarClick(floor);
  }

  generatePermissions(data = {}) {
    return {
      canApprove: data.canApprove || false,
      canDelete: data.canDelete || false,
      canEdit: data.canEdit || false,
      canHide: data.canHide || false,
      canLike: data.canLike || false,
    };
  }

  filterContent() {
    let newContent = this.props?.data?.content || '';
    newContent = s9e.parse(newContent);
    newContent = xss(newContent);
    newContent = urlToLink(newContent);

    return newContent;
  }

  handleClick(e, node) {
    e && e.stopPropagation();
    const { url, isExternaLink } = handleLink(node);
    if (isExternaLink) return;

    if (url) {
      Router.push({ url });
    } else {
      this.toCommentDetail();
    }
  }

  transformer = (parsedDom) => {
    const element =
      this.props.data.commentUserId && this.props?.data?.commentUser ? (
        <View className={styles.commentUser}>
          <View
            className={styles.replyedAvatar}
            onClick={() => {
              this.avatarClick(3);
            }}
          >
            <Avatar
              className={styles.avatar}
              image={
                (this.props.data.commentUser.nickname || this.props.data.commentUser.userName) &&
                this.props.data.commentUser.avatar
              }
              name={this.props.data.commentUser.nickname || this.props.data.commentUser.userName || '异'}
              circle={true}
              size="small"
            ></Avatar>
          </View>
          <Text
            className={styles.replyedUserName}
            onClick={() => {
              this.avatarClick(3);
            }}
          >
            {this.props.data.commentUser.nickname || this.props.data.commentUser.userName || '用户异常'}
          </Text>
        </View>
      ) : (
        ''
      );

    parsedDom.unshift(element);

    return parsedDom;
  };

  toCommentDetail = () => {
    typeof this.props.toCommentDetail === 'function' && this.props.toCommentDetail();
  };

  render() {
    const { canLike, canDelete, canHide } = this.generatePermissions(this.props.data);
    const { groups } = this.props.data?.user || {};

    // 评论内容是否通过审核
    const isApproved = this.props?.data?.isApproved === 1;

    return (
      <View className={styles.replyList} id={`position${this.props.data?.id}`}>
        <View
          className={styles.replyListAvatar}
          onClick={() => {
            this.avatarClick(2);
          }}
        >
          <Avatar
            image={
              (this.props.data?.user?.nickname || this.props.data?.user?.userName) && this.props?.data?.user?.avatar
            }
            name={this.props?.data?.user?.nickname || this?.props?.data?.user?.userName || '异'}
            circle={true}
            size="small"
          ></Avatar>
        </View>
        <View className={styles.replyListContent}>
          <View className={`${styles.replyListContentText} ${this.props.active && styles.active}`}>
            <View className={styles.replyListName}>
              <View className={styles.userInfo}>
                <View
                  className={styles.replyListName}
                  onClick={() => {
                    this.avatarClick(2);
                  }}
                >
                  {this.props.data?.user?.nickname || this.props.data?.user?.userName || '用户异常'}
                </View>
                {!!groups?.isDisplay && <View className={styles.groups}>{groups?.name || groups?.groupName}</View>}
              </View>
              {!isApproved ? <View className={styles.isApproved}>审核中</View> : <View></View>}
            </View>
            <View className={styles.replyListText}>
              {/* 回复内容 */}
              <View className={classNames(styles.content)}>
                <PostContent
                  onRedirectToDetail={() => this.toCommentDetail()}
                  useShowMore={!!this.props.isShowOne}
                  content={this.props?.data?.content}
                  customHoverBg={true}
                  transformer={this.transformer}
                ></PostContent>
              </View>

              {/* 图片展示 */}
              {(this.props.data?.images?.length || this.props.data?.attachments?.length) && (
                <View className={styles.imageDisplay}>
                  <ImageDisplay platform="h5" imgData={this.props.data.images || this.props.data.attachments} />
                </View>
              )}
            </View>
          </View>

          <View className={styles.replyListFooter}>
            <View className={styles.replyTime}>{diffDate(this.props.data.createdAt)}</View>
            {this.props?.data?.user && (
              <View className={styles.extraBottom}>
                <View className={this.props?.data?.isLiked ? styles.replyLike : styles.replyLiked}>
                  <Text onClick={debounce(() => this.likeClick(canLike), 500)}>
                    赞&nbsp;{this.props?.data?.likeCount === 0 ? '' : this.props.data.likeCount}
                  </Text>
                </View>
                <View className={styles.replyReply}>
                  <Text onClick={() => this.replyClick()}>回复</Text>
                </View>
                {canHide && (
                  <View className={styles.replyReply}>
                    <Text onClick={debounce(() => this.deleteClick(), 500)}>删除</Text>
                  </View>
                )}

                {/*                <View className={styles.replyReply}>
                   {canEdit && <View className={styles.revise} onClick={() => this.editClick()}>编辑</View>}
                  {canDelete && (
                    <View  onClick={() => this.replyDeleteClick()}>
                      {canDelete}
                    </View>
                  )}
                </View>*/}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
