import React from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Button } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import ImageContent from './image-content';
import AudioPlay from './audio-play';
import PostContent from './post-content';
import ProductItem from './product-item';
import RedPacket from './red-packet';
import RewardQuestion from './reward-question';
import VideoPlay from './video-play';
import BottomEvent from './bottom-event';
import UserInfo from './user-info';
import AttachmentView from './attachment-view';
import NoData from '../no-data';
import styles from './index.module.scss';
import { updateThreadInfo, updateThreadShare, filterClickClassName, handleAttachmentData, noop } from './utils';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
    // 分享
    onShare = (e) => {
      e.stopPropagation();
      const { data = {} } = this.props;
      const { threadId = '' } = data;
      updateThreadShare({ threadId });
    }
    // 评论
    onComment = (e) => {
      e.stopPropagation();

      const { data = {} } = this.props;
      const { threadId = '' } = data;
      if (threadId !== '') {
        this.props.router.push(`/thread/${threadId}`);
      } else {
        console.log('帖子不存在');
      }
    }
    // 点赞
    onPraise = (e) => {
      e.stopPropagation();
      const { data = {} } = this.props;
      const { threadId = '', isLike, postId } = data;
      updateThreadInfo({ pid: postId, id: threadId, data: { attributes: { isLiked: !isLike } } });
    }
    // 支付
    onPay = (e) => {
      e.stopPropagation();

      if (this.props.payType === '0') {
        return;
      }

      console.log('发起支付流程');
    }

    onClick = (e) => {
      if (!filterClickClassName(e.target)) {
        return;
      }
      const { data = {} } = this.props;
      const { threadId = '' } = data;
      if (threadId !== '') {
        this.props.router.push(`/thread/${threadId}`);
      } else {
        console.log('帖子不存在');
      }

      // 执行外部传进来的点击事件
      const { onClick } = this.props;
      if (typeof(onClick) === 'function') {
        onClick(data);
      }
    }

    // 帖子属性内容
    renderThreadContent = ({ content: data, attachmentPrice, payType } = {}) => {
      const {
        text,
        imageData,
        audioData,
        videoData,
        goodsData,
        redPacketData,
        rewardData,
        fileData,
      } = handleAttachmentData(data);

      return (
        <div className={styles.wrapper} ref={this.ref}>
            {text && <PostContent content={text} onPay={this.onPay} />}
            <div className={styles.content}>
              {videoData && (
                <VideoPlay
                  url={videoData.mediaUrl}
                  coverUrl={videoData.coverUrl}
                  onPay={this.onPay}
                  isPay={payType !== 0}
                />
              )}
              {imageData && <ImageContent imgData={imageData} isPay={payType !== 0} onPay={this.onPay} />}
              {rewardData && <RewardQuestion
                content={rewardData.content || ''}
                money={rewardData.money}
                onClick={this.onPay}
              />}
              {redPacketData && <RedPacket content={redPacketData.content || ''} onClick={this.onPay} />}
              {goodsData && <ProductItem
                  image={goodsData.imagePath}
                  amount={goodsData.price}
                  title={goodsData.title}
              />}
              {audioData && <AudioPlay url={audioData.mediaUrl} isPay={payType !== 0} />}
              {fileData && <AttachmentView attachments={fileData} onClick={this.onPay} isPay={payType !== 0} />}

              {/* 付费蒙层 */}
              {
                payType !== 0 && (
                  <div className={styles.cover} onClick={this.onPay}>
                    {
                      payType === 2 ? (
                        <Button className={styles.button} type="primary" onClick={this.onPay}>
                          <span className={styles.icon}>$</span>
                          支付{attachmentPrice}元查看附件内容
                        </Button>
                      ) : null
                    }
                  </div>
                )
              }
            </div>
        </div>
      );
    }

    render() {
      const { data, className = '' } = this.props;

      if (!data) {
        return <NoData />;
      }

      const {
        title = '',
        user = {},
        position = {},
        likeReward = {},
        payType,
        viewCount,
        price,
        group,
        createdAt,
        isLike,
        postId,
        threadId,
        displayTag,
      } = data || {};

      const { isEssence, isPrice, isRedPack, isReward } = displayTag;

      return (
        <div className={`${styles.container} ${className}`} onClick={this.onClick}>
          <div className={styles.header}>
              <UserInfo
                name={user.userName}
                avatar={user.avatar}
                location={position.address}
                view={`${viewCount}`}
                groupName={group?.groupName}
                time={createdAt}
                isEssence={isEssence}
                isPrice={isPrice}
                isRed={isRedPack}
                isReward={isReward}
              />
          </div>

          {title && <div className={styles.title}>{title}</div>}

          {this.renderThreadContent(data)}

          {payType === 1 && <Button className={styles.button} type="primary" onClick={this.onPay}>
            <span className={styles.icon}>$</span>
            支付{price}元查看剩余内容
          </Button>}

          <BottomEvent
            userImgs={likeReward.users}
            wholeNum={likeReward.likePayCount || 0}
            comment={likeReward.postCount || 0}
            sharing={likeReward.shareCount || 0}
            onShare={this.onShare}
            onComment={this.onComment}
            onPraise={this.onPraise}
            isLiked={isLike}
            tipData={{ postId, threadId }}
          />
        </div>
      );
    }
}

// eslint-disable-next-line new-cap
export default withRouter(Index);
