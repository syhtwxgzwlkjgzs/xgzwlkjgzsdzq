import React from 'react';
import { Button } from '@discuzq/design';
import AudioPlay from './audio-play';
import PostContent from './post-content';
import ProductItem from './product-item';
import RedPacket from './red-packet';
import RewardQuestion from './reward-question';
import VideoPlay from './video-play';
import { handleAttachmentData } from './utils';
import AttachmentView from './attachment-view';
import ImageDisplay from './image-display';
import Packet from './packet';
import styles from './index.module.scss';

/**
 * 帖子内容组件
 * @prop {object} data 帖子数据
 * @prop {function} onClick 点赞文字内容触发
 * @prop {function} onPay 点击付费按钮触发
 */

const Index = (props) => {
    const {
        title = '',
        payType,
        price,
        paid
    } = props.data || {};

    const {
      onClick,
      onPay
    } = props

    // 帖子属性内容
    const renderThreadContent = ({ content: data, attachmentPrice, payType, paid } = {}) => {
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
          <div className={styles.wrapper}>
              {text && <PostContent content={text} onPay={onPay} onRedirectToDetail={onClick} />}
              <div className={`${styles.content} ${payType === 2 && styles.payContent}`}>
                {videoData && (
                  <VideoPlay
                    url={videoData.mediaUrl}
                    coverUrl={videoData.coverUrl}
                    onPay={onPay}
                    isPay={payType !== 0}
                  />
                )}
                {imageData && (
                    <ImageDisplay 
                        platform={props.platform} 
                        imgData={imageData} 
                        isPay={payType !== 0}
                        onPay={onPay}
                        onClickMore={onClick} />
                    )
                }
                {rewardData && <Packet
                  type={1}
                  money={rewardData.money}
                  onClick={onClick}
                />}
                {redPacketData && <Packet money={redPacketData.money || 0} onClick={onClick} />}
                {goodsData && <ProductItem
                    image={goodsData.imagePath}
                    amount={goodsData.price}
                    title={goodsData.title}
                />}
                {audioData && <AudioPlay url={audioData.mediaUrl} isPay={payType !== 0} />}
                {fileData && <AttachmentView attachments={fileData} onClick={onPay} isPay={payType !== 0} />}
  
                {/* 付费蒙层 */}
                {
                  !paid && payType !== 0 && (
                    <div className={styles.cover} onClick={payType === 1 ? onClick : onPay}>
                      {
                        payType === 2 ? (
                          <Button className={styles.button} type="primary" onClick={onPay}>
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

    return (
        <>
            {title && <div className={styles.title} onClick={onClick}>{title}</div>}

            {renderThreadContent(props.data)}

            {
                !paid && payType === 1 && (
                    <Button className={styles.button} type="primary" onClick={onPay}>
                        <span className={styles.icon}>$</span>
                        支付{price}元查看剩余内容
                    </Button>
                )
            }
        </>
    )
}

export default React.memo(Index)
