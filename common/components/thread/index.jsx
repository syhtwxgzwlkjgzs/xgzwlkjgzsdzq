import React, { useCallback } from 'react';
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

    // 帖子属性内容
    renderThreadContent = () => (
      <div className={styles.wrapper}>
          <PostContent content={dataSource.content} onPay={this.onPay} />
          <div className={styles.content}>
            <VideoPlay width={378} height={224} url={dataSource.video.src} />
            <ImageContent imgData={dataSource.imgData} />
            <RewardQuestion
              content={dataSource.rewardQuestion.content}
              money={dataSource.rewardQuestion.money}
              onClick={this.onPay}
            />
            <RedPacket content={dataSource.redPacket.content} onClick={this.onPay} />
            <ProductItem
                image={dataSource.goods.image}
                amount={dataSource.goods.amount}
                title={dataSource.goods.title}
            />
            <AudioPlay url={dataSource.audio.src} />
            <AttachmentView attachments={dataSource.attachments} onClick={this.onPay} />

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
    )

    render() {
      const { money = '0' } = this.props;
      return (
        <div className={styles.container}>
          <div className={styles.header}>
              <UserInfo
                  name={dataSource.userInfo.name}
                  avatar={dataSource.userInfo.avatar}
                  location={dataSource.userInfo.location}
              />
          </div>

          {this.renderThreadContent()}

          {money !== '0' && <Button className={styles.button} type="primary" onClick={this.onPay}>
            <span className={styles.icon}>$</span>
            支付{money}元查看剩余内容
          </Button>}

          <BottomEvent
            userImgs={dataSource.bottomEvent.userImgs}
            wholeNum={dataSource.bottomEvent.wholeNum}
            comment={dataSource.bottomEvent.comment}
            sharing={dataSource.bottomEvent.sharing}
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

// TODO 此处若是删除HOCFetchSiteData会有hook报错，后期解决
// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(Index));
