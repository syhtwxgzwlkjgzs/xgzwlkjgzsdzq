import React from 'react';
import { View, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';
import { Icon, Button } from '@discuzq/design';

import UserInfo from '@components/thread/user-info';
import ImageContent from '@components/thread/image-content';
import AudioPlay from '@components/thread/audio-play';
import PostContent from '@components/thread/post-content';
import ProductItem from '@components/thread/product-item';
import VideoPlay from '@components/thread/video-play';
import PostRewardProgressBar, { POST_TYPE } from '@components/thread/post-reward-progress-bar';
import Tip from '@components/thread/tip';
import AttachmentView from '@components/thread/attachment-view';
import threadPay from '@common/pay-bussiness/thread-pay';
import { minus } from '@common/utils/calculate';

import { parseContentData } from '../../utils';
import topic from './index.module.scss';

// 帖子内容
const RenderThreadContent = inject('user')(
  observer((props) => {
    const { store: threadStore } = props;
    const { text, indexes } = threadStore?.threadData?.content || {};
    const tipData = {
      postId: threadStore?.threadData?.postId,
      threadId: threadStore?.threadData?.threadId,
    };
    // 是否合法
    const isApproved = threadStore?.threadData?.isApproved || 0;
    const isEssence = threadStore?.threadData?.displayTag?.isEssence || false;

    // 是否附件付费
    const isAttachmentPay = threadStore?.threadData?.payType === 2 && threadStore?.threadData?.paid === false;
    const attachmentPrice = threadStore?.threadData?.attachmentPrice || 0;
    // 是否帖子付费
    const isThreadPay = threadStore?.threadData?.payType === 1 && threadStore?.threadData?.paid === false;
    const threadPrice = threadStore?.threadData?.price || 0;
    // 是否作者自己
    const isSelf = props.user?.userInfo?.id && props.user?.userInfo?.id === threadStore?.threadData?.userId;

    const parseContent = parseContentData(indexes);

    const onContentClick = async () => {
      const thread = props.store.threadData;
      const { success } = await threadPay(thread, props.user?.userInfo);

      // 支付成功重新请求帖子数据
      if (success && threadStore?.threadData?.threadId) {
        threadStore.fetchThreadDetail(threadStore?.threadData?.threadId);
      }
    };

    const onMoreClick = () => {
      props.fun.moreClick();
    };

    const onLikeClick = () => {
      typeof props.onLikeClick === 'function' && props.onLikeClick();
    };

    const onBuyClick = (url) => {
      url && window.open(url);
    };

    const onRewardClick = () => {
      typeof props.onRewardClick === 'function' && props.onRewardClick();
    };

    return (
      // <View>帖子内容</View>
      <View className={`${topic.container}`}>
        <View className={topic.header}>
          <View className={topic.userInfo}>
            <UserInfo
              name={threadStore?.threadData?.user?.userName || ''}
              avatar={threadStore?.threadData?.user?.avatar || ''}
              location={threadStore?.threadData?.position.location || ''}
              view={`${threadStore?.threadData?.viewCount}` || ''}
              time={`${threadStore?.threadData?.createdAt}` || ''}
              isEssence={isEssence}
            ></UserInfo>
          </View>
          {props?.user?.isLogin() && (
            <View className={topic.more} onClick={onMoreClick}>
              <Icon size="20" color="#8590A6" name="MoreVOutlined"></Icon>
            </View>
          )}
        </View>

        {isApproved === 1 && (
          <View className={topic.body}>
            {/* 文字 */}
            {text && <PostContent content={text || ''} />}

            {/* 付费附件 */}
            {isAttachmentPay && !isSelf && (
              <View style={{ textAlign: 'center' }} onClick={onContentClick}>
                <Button className={topic.payButton} type="primary" size="large">
                  支付{attachmentPrice}元查看附件
                </Button>
              </View>
            )}

            {/* 图片 */}
            {parseContent.IMAGE && <ImageContent imgData={parseContent.IMAGE} />}
            {/* 视频 */}
            {parseContent.VIDEO && (
              <VideoPlay
                url={parseContent.VIDEO.mediaUrl}
                coverUrl={parseContent.VIDEO.coverUrl}
                width={400}
                height={200}
              />
            )}
            {/* 音频 */}
            {parseContent.VOICE && <AudioPlay url={parseContent.VOICE.mediaUrl} />}
            {/* 附件 */}
            {parseContent.VOTE && <AttachmentView attachments={parseContent.VOTE} />}
            {/* 商品 */}
            {parseContent.GOODS && (
              <View>
                <ProductItem
                  image={parseContent.GOODS.imagePath}
                  amount={parseContent.GOODS.price}
                  title={parseContent.GOODS.title}
                />
                <Button
                  className={topic.buyBtn}
                  type="danger"
                  onClick={() => onBuyClick(parseContent.GOODS.detailContent)}
                >
                  <Icon className={topic.buttonIcon} name="ShoppingCartOutlined" size={20}></Icon>
                  <Text className={topic.buyText}>购买商品</Text>
                </Button>
              </View>
            )}

            {/* 悬赏文案 */}
            {(parseContent.REWARD) && (
              <View className={topic.rewardText}>
                {/* 悬赏 */}
                {parseContent.REWARD && (
                  <View>
                    <View className={topic.rewardMoney}>
                      本帖向所有人悬赏
                      <Text className={topic.rewardNumber}>{parseContent.REWARD.remain_money || 0}</Text>元
                    </View>
                    <View className={topic.rewardTime}>{parseContent.REWARD.expired_at}截止悬赏</View>
                  </View>
                )}
              </View>
            )}

            {/* 标签 */}
            {threadStore?.threadData?.categoryName && (
              <View className={topic.tag}>{threadStore?.threadData?.categoryName}</View>
            )}

            {(parseContent.RED_PACKET || parseContent.REWARD) && (
              <View className={topic.reward}>
                {/* 悬赏 */}
                {parseContent.REWARD && (
                  <PostRewardProgressBar
                    type={POST_TYPE.BOUNTY}
                    remaining={Number(parseContent.REWARD.remain_money || 0)}
                    received={minus(
                      Number(parseContent.REWARD.money || 0),
                      Number(parseContent.REWARD.remain_money || 0),
                    )}
                  />
                )}
                {/* 红包 */}
                {parseContent.RED_PACKET && (
                  <PostRewardProgressBar
                    remaining={Number(parseContent.RED_PACKET.remain_number || 0)}
                    received={
                      Number(parseContent.RED_PACKET.number || 0) - Number(parseContent.RED_PACKET.remain_number || 0)
                    }
                  />
                )}
              </View>
            )}

            {/* 帖子付费 */}
            {isThreadPay && !isSelf && (
              <View style={{ textAlign: 'center' }} onClick={onContentClick}>
                <Button className={topic.payButton} type="primary" size="large">
                  <View className={topic.pay}>
                    <Icon className={topic.buttonIcon} name="DollarLOutlined" size={18}></Icon>
                    支付{threadPrice}元查看剩余内容
                  </View>
                </Button>
              </View>
            )}

            {/* 打赏 */}
            {props?.user?.isLogin() && (
              <View style={{ textAlign: 'center' }}>
                <Button onClick={onRewardClick} className={topic.rewardButton} type="primary" size="large">
                  <Icon className={topic.buttonIcon} name="HeartOutlined"></Icon>
                  <Text className={topic.rewardext}>打赏</Text>
                </Button>
              </View>
            )}
          </View>
        )}
        <View className={topic.footer}>
          <View className={topic.thumbs}>
            <View
              className={classnames(topic.liked, threadStore?.threadData?.isLike && topic.isLiked)}
              onClick={onLikeClick}
            >
              <Icon name="LikeOutlined" size={20}></Icon>
              <Text>{threadStore?.threadData?.likeReward?.likePayCount || ''}</Text>
            </View>
            <View className={topic.likeReward}>
              <Tip tipData={tipData} imgs={threadStore?.threadData?.likeReward?.users || []}></Tip>
            </View>
          </View>
          {threadStore?.threadData?.likeReward?.shareCount > 0 && (
            <Text>{threadStore?.threadData?.likeReward?.shareCount}次分享</Text>
          )}
        </View>
      </View>
    );
  }),
);

export default RenderThreadContent;
