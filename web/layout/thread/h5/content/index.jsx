import React from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Button } from '@discuzq/design';
import { parseContentData } from '../../utils';
import ImageDisplay from '@components/thread/image-display';
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
      <div className={`${styles.container}`}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <UserInfo
              name={threadStore?.threadData?.user?.userName || ''}
              avatar={threadStore?.threadData?.user?.avatar || ''}
              location={threadStore?.threadData?.position.location || ''}
              view={`${threadStore?.threadData?.viewCount}` || ''}
              time={`${threadStore?.threadData?.createdAt}` || ''}
              isEssence={isEssence}
            ></UserInfo>
          </div>
          {props?.user?.isLogin() && (
            <div className={styles.more} onClick={onMoreClick}>
              <Icon size="20" color="#8590A6" name="MoreVOutlined"></Icon>
            </div>
          )}
        </div>

        {isApproved === 1 && (
          <div className={styles.body}>
            {/* 文字 */}
            {text && <PostContent content={text || ''} />}

            {/* 付费附件 */}
            {isAttachmentPay && !isSelf && (
              <div style={{ textAlign: 'center' }} onClick={onContentClick}>
                <Button className={styles.payButton} type="primary" size="large">
                  <div className={styles.pay}>
                    <Icon className={styles.payIcon} name="DollarLOutlined" size={18}></Icon>
                    支付{attachmentPrice}元查看附件
                  </div>
                </Button>
              </div>
            )}

            {/* 视频 */}
            {parseContent.VIDEO && (
              <VideoPlay
                url={parseContent.VIDEO.mediaUrl}
                coverUrl={parseContent.VIDEO.coverUrl}
                width={400}
                height={200}
              />
            )}
            {/* 图片 */}
            {parseContent.IMAGE && <ImageDisplay imgData={parseContent.IMAGE} />}
            {/* 商品 */}
            {parseContent.GOODS && (
              <div>
                <ProductItem
                  image={parseContent.GOODS.imagePath}
                  amount={parseContent.GOODS.price}
                  title={parseContent.GOODS.title}
                />
                <Button
                  className={styles.buyBtn}
                  type="danger"
                  onClick={() => onBuyClick(parseContent.GOODS.detailContent)}
                >
                  购买商品
                </Button>
              </div>
            )}
            {/* 音频 */}
            {parseContent.VOICE && <AudioPlay url={parseContent.VOICE.mediaUrl} />}
            {/* 附件 */}
            {parseContent.VOTE && <AttachmentView attachments={parseContent.VOTE} />}

            {threadStore?.threadData?.categoryName && (
              <div className={styles.tag}>{threadStore?.threadData?.categoryName}</div>
            )}

            {(parseContent.RED_PACKET || parseContent.REWARD) && (
              <div className={styles.reward}>
                {/* 红包 */}
                {parseContent.RED_PACKET && (
                  <PostRewardProgressBar
                    remaining={Number(parseContent.RED_PACKET.remain_number || 0)}
                    received={
                      Number(parseContent.RED_PACKET.number || 0) - Number(parseContent.RED_PACKET.remain_number || 0)
                    }
                  />
                )}
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
              </div>
            )}

            {/* 帖子付费 */}
            {isThreadPay && !isSelf && (
              <div style={{ textAlign: 'center' }} onClick={onContentClick}>
                <Button className={styles.payButton} type="primary" size="large">
                  <div className={styles.pay}>
                    <Icon className={styles.payIcon} name="DollarLOutlined" size={18}></Icon>
                    支付{threadPrice}元查看剩余内容
                  </div>
                </Button>
              </div>
            )}

            {/* 打赏 */}
            {props?.user?.isLogin() && (
              <div style={{ textAlign: 'center' }}>
                <Button onClick={onRewardClick} className={styles.rewardButton} type="primary" size="large">
                  打赏
                </Button>
              </div>
            )}
          </div>
        )}
        <div className={styles.footer}>
          <div className={styles.thumbs}>
            <div
              className={classnames(styles.liked, threadStore?.threadData?.isLike && styles.isLiked)}
              onClick={onLikeClick}
            >
              <Icon name="LikeOutlined"></Icon>
              <span>{threadStore?.threadData?.likeReward?.likePayCount || ''}</span>
            </div>
            <div className={styles.likeReward}>
              <Tip tipData={tipData} imgs={threadStore?.threadData?.likeReward?.users || []}></Tip>
            </div>
          </div>
          {threadStore?.threadData?.likeReward?.shareCount > 0 && (
            <span>{threadStore?.threadData?.likeReward?.shareCount}次分享</span>
          )}
        </div>
      </div>
    );
  }),
);

export default RenderThreadContent;
