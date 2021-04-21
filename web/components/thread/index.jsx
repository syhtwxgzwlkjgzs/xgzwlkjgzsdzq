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
import { updateThreadInfo } from './utils';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
    // 分享
    onShare = (e) => {
      e.stopPropagation();

      console.log('分享');
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
      const { threadId = '' } = data;
      updateThreadInfo({ pid: threadId, data: { attachments: { isLiked: true } } });
    }
    // 支付
    onPay = (e) => {
      e.stopPropagation();

      if (this.props.payType === '0') {
        return;
      }

      console.log('发起支付流程');
    }

    onClick = () => {
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

    // 处理附件的数据
    handleAttachmentData = (data) => {
      const newData = { text: data.text };
      const values = Object.values(data.indexes || {});
      values.forEach((item) => {
        const { tomId } = item;
        if (tomId === '101') { // 图片
          newData.imageData = item.body;
        } else if (tomId === '102') { // 音频
          newData.audioData = item.body;
        } else if (tomId === '103') { // 视频
          newData.videoData = item.body;
        } else if (tomId === '104') { // 商品
          newData.goodsData = item.body;
        } else if (tomId === '105') { // 问答
          newData.qaData = item.body;
        } else if (tomId === '106') { // 红包
          newData.redPacketData = item.body;
        } else if (tomId === '107') { // 悬赏
          newData.rewardData = item.body;
        } else if (tomId === '108') { // 附件
          newData.fileData = item.body;
        }
      });

      return newData;
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
      } = this.handleAttachmentData(data);

      return (
        <div className={styles.wrapper}>
            {text && <PostContent content={text} onPay={this.onPay} />}
            <div className={styles.content}>
              {videoData && <VideoPlay width={378} height={224} url={videoData.mediaUrl} />}
              {imageData && <ImageContent imgData={imageData} />}
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
              {/* {audioData && <AudioPlay url={dataSource.audio.src} />} */}
              {fileData && <AttachmentView attachments={fileData} onClick={this.onPay} />}

              {/* 附件付费蒙层 */}
              {
                payType === 2 && (
                  <div className={styles.cover}>
                    <Button className={styles.button} type="primary" onClick={this.onPay}>
                      <span className={styles.icon}>$</span>
                      支付{attachmentPrice}元查看附件内容
                    </Button>
                  </div>
                )
              }
            </div>
        </div>
      );
    }

    render() {
      const { data } = this.props;

      if (!data) {
        return <NoData />;
      }

      const { title = '', user = {}, position = {}, likeReward = {}, payType, viewCount, price } = data || {};

      return (
        <div className={styles.container} onClick={this.onClick}>
          <div className={styles.header}>
              <UserInfo
                  name={user.userName}
                  avatar={user.avatar}
                  location={position.address}
                  view={`${viewCount}`}
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
          />
        </div>
      );
    }
}

// eslint-disable-next-line new-cap
export default withRouter(Index);
