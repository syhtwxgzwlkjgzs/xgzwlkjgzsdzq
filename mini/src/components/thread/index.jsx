import React from 'react';
import { withRouter } from 'next/router';
import { Button, Toast } from '@discuzq/design';
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
import { filterClickClassName, handleAttachmentData } from './utils';
import goToLoginPage from '@common/utils/go-to-login-page';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import threadPay from '@common/pay-bussiness/thread-pay';

@inject('site')
@inject('index')
@inject('user')
@inject('search')
@inject('topic')
@inject('thread')
@observer
class Index extends React.Component {
    // 分享
    onShare = (e) => {
      e.stopPropagation();

      // 对没有登录的先登录
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/user/login' });
        return;
      }

      const { title = '', threadId = '' } = this.props.data || {};

      this.props.index.updateThreadShare({ threadId }).then(result => {
        if (result.code === 0) {
          this.props.index.updateAssignThreadInfo(threadId, { isShare: true });
          this.props.search.updateAssignThreadInfo(threadId, { isShare: true });
          this.props.topic.updateAssignThreadInfo(threadId, { isShare: true });
        }
      });
    }
    // 评论
    onComment = (e) => {
      e.stopPropagation();

      // 对没有登录的先登录
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        // goToLoginPage();
        return;
      }

      const { data = {} } = this.props;
      const { threadId = '' } = data;
      if (threadId !== '') {
        Taro.navigateTo({url: `/pages/thread/index?id=${threadId}`});
      } else {
        console.log('帖子不存在');
      }
    }
   // 点赞
   onPraise = (e) => {
      e.stopPropagation();

      // 对没有登录的先登录
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/user/login' });
        return;
      }
      const { data = {}, user } = this.props;
      const { threadId = '', isLike, postId } = data;
      this.props.index.updateThreadInfo({ pid: postId, id: threadId, data: { attributes: { isLiked: !isLike } } }).then(result => {
        if (result.code === 0 && result.data) {
          const { isLiked } = result.data;
          this.props.index.updateAssignThreadInfo(threadId, { isLike: isLiked, user: user.userInfo });
          this.props.search.updateAssignThreadInfo(threadId, { isLike: isLiked, user: user.userInfo });
          this.props.topic.updateAssignThreadInfo(threadId, { isLike: isLiked, user: user.userInfo });
        }
      });
    }
    // 支付
    onPay = async (e) => {
      e.stopPropagation();

      // 对没有登录的先做
      if (!this.props.user.isLogin()) {
        Toast.info({ content: '请先登录!' });
        goToLoginPage({ url: '/user/login' });
        return;
      }

      if (this.props.payType === '0') {
        return;
      }

      const thread = this.props.data;
      const { success } = await threadPay(thread, this.props.user?.userInfo);

      // 支付成功重新请求帖子数据
      if (success && thread?.threadId) {
        
        const { code, data } = await this.props.thread.fetchThreadDetail(thread?.threadId);
        if (code === 0 && data) {
          this.props.index.updatePayThreadInfo(thread?.threadId, data)
          this.props.search.updatePayThreadInfo(thread?.threadId, data)
          this.props.topic.updatePayThreadInfo(thread?.threadId, data)
        }
      }
    }

    onClick = () => {
      const { threadId = '', ability } = this.props.data || {};
      const { canViewPost } = ability;

      if (!canViewPost) {
        Toast.info({ content: '暂无权限查看详情，请联系管理员' });
      }

      if (threadId !== '') {
        Taro.navigateTo({url: `/pages/thread/index?id=${threadId}`});
      } else {
        console.log('帖子不存在');
      }

      // 执行外部传进来的点击事件
      const { onClick } = this.props;
      if (typeof(onClick) === 'function') {
        onClick(this.props.data);
      }
    }

    // 帖子属性内容
    renderThreadContent = ({ content: data, attachmentPrice, payType, paid } = {}) => {
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
        <View className={styles.wrapper} ref={this.ref}>
            {text && <PostContent content={text} onPay={this.onPay} onRedirectToDetail={this.onClick} />}
            <View className={`${styles.content} ${payType === 2 && styles.payContent}`}>
              {videoData && (
                <VideoPlay
                  url={videoData.mediaUrl}
                  coverUrl={videoData.coverUrl}
                  onPay={this.onPay}
                  isPay={payType !== 0}
                />
              )}
              {imageData && <ImageContent
                imgData={imageData}
                isPay={payType !== 0}
                onPay={this.onPay}
                onClickMore={this.onClick}
              />}
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
                !paid && payType !== 0 && (
                  <View className={styles.cover} onClick={payType === 1 ? this.onClick : this.onPay}>
                    {
                      payType === 2 ? (
                        <Button className={styles.button} type="primary" onClick={this.onPay}>
                          <Text className={styles.icon}>$</Text>
                          支付{attachmentPrice}元查看附件内容
                        </Button>
                      ) : null
                    }
                  </View>
                )
              }
            </View>
        </View>
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
        paid
      } = data || {};

      const { isEssence, isPrice, isRedPack, isReward } = displayTag;

      return (
        <View className={`${styles.container} ${className}`}>
          <View className={styles.header}>
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
          </View>

          {title && <View className={styles.title} onClick={this.onClick}>{title}</View>}

          {this.renderThreadContent(data)}

          {!paid && payType === 1 && <Button className={styles.button} type="primary" onClick={this.onPay}>
            <Text className={styles.icon}>$</Text>
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
        </View>
      );
    }
}

// eslint-disable-next-line new-cap
export default withRouter(Index);
