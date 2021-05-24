import React from 'react';
import { inject, observer } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import { Icon, Button } from '@discuzq/design';
import { parseContentData } from '../../utils';
// import ImageDisplay from '@components/thread/image-display'; // components中暂时没有
import AudioPlay from '@components/thread/audio-play';
import PostContent from '@components/thread/post-content';
import ProductItem from '@components/thread/product-item';
import VideoPlay from '@components/thread/video-play';
import PostRewardProgressBar, { POST_TYPE } from '@components/thread/post-reward-progress-bar';
import Tip from '@components/thread/tip';
import AttachmentView from '@components/thread/attachment-view';
import { minus } from '@common/utils/calculate';
import threadPay from '@common/pay-bussiness/thread-pay';
import classnames from 'classnames';
import UserInfo from '@components/thread/user-info';
import styles from './index.module.scss';

// 帖子内容
const RenderThreadContent = inject('user')(
  observer((props) => {
    const { store: threadStore } = props;
    const { text, indexes } = threadStore?.threadData?.content || {};
    const tipData = {
      postId: threadStore?.threadData?.postId,
      threadId: threadStore?.threadData?.threadId,
      platform: 'h5',
      payType: threadStore?.threadData?.payType,
    };
    // 是否合法
    const isApproved = (threadStore?.threadData?.isApproved || 0) === 1;
    const isEssence = threadStore?.threadData?.displayTag?.isEssence || false;

    // 是否免费帖
    const isFree = threadStore?.threadData?.payType === 0;

    // 是否附件付费帖
    const isAttachmentPay = threadStore?.threadData?.payType === 2 && threadStore?.threadData?.paid === false;
    const attachmentPrice = threadStore?.threadData?.attachmentPrice || 0;
    // 是否付费帖子
    const isThreadPay = threadStore?.threadData?.payType === 1;
    const threadPrice = threadStore?.threadData?.price || 0;
    // 是否已经付费
    const isPayed = threadStore?.threadData?.paid === true;
    // 当前用户是否需要付费
    const isNeedPay = threadStore?.threadData?.payType === 1 && threadStore?.threadData?.paid === false;
    // 是否作者自己
    const isSelf = props.user?.userInfo?.id && props.user?.userInfo?.id === threadStore?.threadData?.userId;

    // 是否红包帖
    const isRedPack = threadStore?.threadData?.displayTag?.isRedPack;
    // 是否悬赏帖
    const isReward = threadStore?.threadData?.displayTag?.isReward;

    // 是否打赏帖
    const isBeReward = isFree && threadStore?.threadData?.ability.canBeReward && !isRedPack && !isReward;
    // 是否显示打赏按钮： 免费帖 && 不是自己 && 不是红包 && 不是悬赏 && 允许被打赏
    const canBeReward = isFree && threadStore?.threadData?.ability.canBeReward && !isRedPack && !isReward;
    // 是否已打赏
    const isRewarded = threadStore?.threadData?.isReward;

    // 是否可以免费查看付费帖子
    const canFreeViewPost = threadStore?.threadData?.ability.canFreeViewPost;

    const parseContent = parseContentData(indexes);

    const onContentClick = async () => {
      const thread = props.store.threadData;
      const { success } = await threadPay(thread, props.user?.userInfo);

      // 支付成功重新请求帖子数据
      if (success && threadStore?.threadData?.threadId) {
        threadStore.fetchThreadDetail(threadStore?.threadData?.threadId);
      }
    };

    const onTagClick = () => {
      typeof props.onTagClick === 'function' && props.onTagClick();
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
      <View className={`${styles.container}`}>
        <View className={styles.header}>
          <View className={styles.userInfo}>
            <UserInfo
              name={threadStore?.threadData?.user?.userName || ''}
              avatar={threadStore?.threadData?.user?.avatar || ''}
              location={threadStore?.threadData?.position.location || ''}
              view={`${threadStore?.threadData?.viewCount}` || ''}
              time={`${threadStore?.threadData?.createdAt}` || ''}
              isEssence={isEssence}
              isPay={!isFree}
              isReward={isReward}
              isRed={isRedPack}
            ></UserInfo>
          </View>
          {props?.user?.isLogin() && isApproved && (
            <View className={styles.more} onClick={onMoreClick}>
              <Icon size={20} color="#8590A6" name="MoreVOutlined"></Icon>
            </View>
          )}
        </View>

        <View className={styles.body}>
          {/* 标题 */}
          {threadStore?.threadData?.title && <View className={styles.title}>{threadStore?.threadData?.title}</View>}

          {/* 文字 */}
          {text && <PostContent useShowMore={false} content={text || ''} />}

          {/* 悬赏文案 */}
          {parseContent.REWARD && (
            <View className={styles.rewardText}>
              {/* 悬赏 */}
              {parseContent.REWARD && (
                <View>
                  <View className={styles.rewardMoney}>
                    本帖向所有人悬赏
                    <Text className={styles.rewardNumber}>{parseContent.REWARD.money || 0}</Text>元
                  </View>
                  <View className={styles.rewardTime}>{parseContent.REWARD.expiredAt}截止悬赏</View>
                </View>
              )}
            </View>
          )}

          {/* 付费附件 */}
          {!canFreeViewPost && isAttachmentPay && !isSelf && !isPayed && (
            <View style={{ textAlign: 'center' }} onClick={onContentClick}>
              <Button className={styles.payButton} type="primary">
                <Icon className={styles.payIcon} name="DollarLOutlined" size={20}></Icon>
                <p>支付{attachmentPrice}元查看附件内容</p>
              </Button>
            </View>
          )}

          {/* 图片 */}
          {/* 暂无该组件 */}
          {/* {parseContent.IMAGE && <ImageDisplay imgData={parseContent.IMAGE} />} */}

          {/* 视频 */}
          {parseContent.VIDEO && (
            <VideoPlay
              url={parseContent.VIDEO.mediaUrl}
              coverUrl={parseContent.VIDEO.coverUrl}
              width={400}
              height={200}
              status={parseContent.VIDEO.status}
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
                className={styles.product}
              />
              <Button
                className={styles.buyBtn}
                type="danger"
                onClick={() => onBuyClick(parseContent.GOODS.detailContent)}
              >
                <Icon className={styles.payIcon} name="ShoppingCartOutlined" size={20}></Icon>
                <Text className={styles.buyText}>购买商品</Text>
              </Button>
            </View>
          )}
          {/* 标签 */}
          {threadStore?.threadData?.categoryName && (
            <View className={styles.tag} onClick={onTagClick}>
              {threadStore?.threadData?.categoryName}
            </View>
          )}

          {(parseContent.RED_PACKET || parseContent.REWARD) && (
            <View className={styles.reward}>
              {/* 悬赏 */}
              {parseContent.REWARD && (
                <View className={styles.rewardBody}>
                  <PostRewardProgressBar
                    type={POST_TYPE.BOUNTY}
                    remaining={Number(parseContent.REWARD.remainMoney || 0)}
                    received={minus(
                      Number(parseContent.REWARD.money || 0),
                      Number(parseContent.REWARD.remainMoney || 0),
                    )}
                  />
                </View>
              )}
              {/* 红包 */}
              {parseContent.RED_PACKET && (
                <PostRewardProgressBar
                  remaining={Number(parseContent.RED_PACKET.remainNumber || 0)}
                  received={
                    Number(parseContent.RED_PACKET.number || 0) - Number(parseContent.RED_PACKET.remainNumber || 0)
                  }
                  condition={parseContent.RED_PACKET.condition}
                />
              )}
            </View>
          )}

          {/* 帖子付费 */}
          {!canFreeViewPost && isThreadPay && !isSelf && !isPayed && (
            <View style={{ textAlign: 'center' }} onClick={onContentClick}>
              <Button className={styles.payButton} type="primary">
                <Icon className={styles.payIcon} name="DollarLOutlined" size={20}></Icon>
                支付{threadPrice}元查看剩余内容
              </Button>
            </View>
          )}

          {/* 打赏 */}
          {canBeReward && isApproved && !isSelf && (
            <View className={styles.rewardContianer}>
              <Button onClick={onRewardClick} className={styles.rewardButton} type="primary">
                <Icon className={styles.payIcon} name="HeartOutlined" size={20}></Icon>
                <Text className={styles.rewardext}>打赏</Text>
              </Button>
            </View>
          )}
        </View>

        {isApproved && (
          <View className={styles.footer}>
            <View className={styles.thumbs}>
              {/* 付费 */}
              {isThreadPay && (
                <Icon
                  className={classnames(styles.payIcon, isPayed && styles.actived)}
                  name="DollarLOutlined"
                  size={20}
                ></Icon>
              )}
              {/* 打赏 */}
              {isBeReward && (
                <Icon
                  className={classnames(styles.payIcon, isRewarded && styles.actived)}
                  name="HeartOutlined"
                  size={20}
                ></Icon>
              )}
              {/* 点赞 */}
              <View
                className={classnames(styles.liked, threadStore?.threadData?.isLike && styles.actived)}
                onClick={onLikeClick}
              >
                <Icon name="LikeOutlined" size={20}></Icon>
                {threadStore?.threadData?.likeReward?.likePayCount > 0 && (
                  <Text className={styles.likedNumber}>{threadStore?.threadData?.likeReward?.likePayCount || ''}</Text>
                )}
              </View>
              <View className={styles.likeReward}>
                <Tip tipData={tipData} imgs={threadStore?.threadData?.likeReward?.users || []} showMore={true}></Tip>
              </View>
            </View>
            {threadStore?.threadData?.likeReward?.shareCount > 0 && (
              <View className={styles.shareCount}>{threadStore?.threadData?.likeReward?.shareCount}次分享</View>
            )}
          </View>
        )}
      </View>
    );
  }),
);

export default RenderThreadContent;
