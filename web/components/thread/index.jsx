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
import dataSource from './data';
import styles from './index.module.scss';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
    static defaultProps = {
      money: '0',
      payType: '0', // 0： 免费
    };

    dispatch = (type, data) => {
      console.log(type);
    }

    onShare = () => {
      console.log('分享');
    }

    onComment = () => {
      this.props.router.push('/thread/9060');
    }

    onPraise = () => {
      console.log('点赞');
    }

    onPay = () => {
      if (this.props.payType === '0') {
        return;
      }

      console.log('发起支付流程');
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
    renderThreadContent = (data) => {
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
                this.props.payType === '2' && (
                  <div className={styles.cover}>
                    <Button className={styles.button} type="primary" onClick={this.onPay}>
                      <span className={styles.icon}>$</span>
                      支付{this.props.money}元查看附件内容
                    </Button>
                  </div>
                )
              }
            </div>
        </div>
      );
    }

    render() {
      const { money = '0', data = dataSource } = this.props;
      const { title, user = {}, position = {}, likeReward = {}, content = {} } = data;

      return (
        <div className={styles.container}>
          <div className={styles.header}>
              <UserInfo
                  name={user.userName}
                  avatar={user.avatar}
                  location={position.address}
              />
          </div>

          {title && <div className={styles.title}>{title}</div>}

          {this.renderThreadContent(content)}

          {money !== '0' && <Button className={styles.button} type="primary" onClick={this.onPay}>
            <span className={styles.icon}>$</span>
            支付{money}元查看剩余内容
          </Button>}

          <BottomEvent
            userImgs={likeReward.users}
            wholeNum={likeReward.likePayCount}
            comment={likeReward.comment || 0}
            sharing={likeReward.shareCount}
            onShare={this.onShare}
            onComment={this.onComment}
            onPraise={this.onPraise}
          />
        </div>
      );
    }
}

Index.propTypes = {
  payType: PropTypes.string, // 付费类型 0：免费 1：全贴付费 2：附件付费
  money: PropTypes.string, // 付费金额
};

// eslint-disable-next-line new-cap
export default withRouter(Index);