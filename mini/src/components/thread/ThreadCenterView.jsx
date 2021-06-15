import React, { useMemo } from 'react';
import Button from '@discuzq/design/dist/components/button/index';
import Icon from '@discuzq/design/dist/components/icon/index';
import AudioPlay from './audio-play';
import PostContent from './post-content';
import ProductItem from './product-item';
import VideoPlay from './video-play';
import { handleAttachmentData } from './utils';
import AttachmentView from './attachment-view';
import ImageDisplay from './image-display';
import Packet from './packet';
import styles from './index.module.scss';
import { View, Text } from '@tarojs/components';

/**
 * 帖子内容组件
 * @prop {object} data 帖子数据
 * @prop {function} onClick 点赞文字内容触发
 * @prop {function} onPay 点击付费按钮触发
 */

const Index = (props) => {
  const { title = '', payType, price, paid, attachmentPrice } = props.data || {};
  const needPay = useMemo(() => payType !== 0 && !paid, [paid, payType]);
  const { onClick, onPay } = props;

  // 标题显示37个字符
  const newTitle = useMemo(() => {
    if (title.length > 37) {
      return `${title.slice(0, 37)}...`;
    }
    return title;
  }, [title]);
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
      threadId,
    } = handleAttachmentData(data);
    return (
      <View className={styles.wrapper}>
        {text && <PostContent content={text} onPay={onPay} onRedirectToDetail={onClick} />}
        <View className={styles.content}>
          {videoData && (
            <BrWrapper>
              <VideoPlay
                url={videoData.mediaUrl}
                coverUrl={videoData.coverUrl}
                v_width={videoData.width || null}
                v_height={videoData.height || null}
                onPay={onPay}
                isPay={needPay}
                status={videoData.status}
              />
            </BrWrapper>
          )}
          {imageData?.length ? (
            <BrWrapper>
              <ImageDisplay platform="h5" imgData={imageData} isPay={needPay} onPay={onPay} onClickMore={onClick} />
            </BrWrapper>
          ) : null}
          {audioData && <BrWrapper><AudioPlay url={audioData.mediaUrl} isPay={needPay} onPay={onPay} /></BrWrapper>}
          {fileData?.length ? <BrWrapper><AttachmentView threadId={threadId} attachments={fileData} onPay={onPay} isPay={needPay} /></BrWrapper> : null}
          {goodsData && (
            <BrWrapper>
              <ProductItem
                image={goodsData.imagePath}
                amount={goodsData.price}
                title={goodsData.title}
                onClick={onClick}
              />
            </BrWrapper>
          )}
          {rewardData && <BrWrapper><Packet type={1} money={rewardData.money} onClick={onClick} /></BrWrapper>}
          {redPacketData && (
            <BrWrapper><Packet money={redPacketData.money || 0} onClick={onClick} condition={redPacketData.condition} /></BrWrapper>
          )}
        </View>
      </View>
    );
  };
  return (
    <>
      {title && (
        <View className={styles.title} onClick={onClick}>
          {newTitle}
        </View>
      )}

      {renderThreadContent(props.data)}

      {needPay && (
        <View className={styles.pay}>
          <Button className={styles.button} type="primary" onClick={onPay}>
            <Icon className={styles.payIcon} name="GoldCoinOutlined" size={16}></Icon>
            {payType === 1 ? (
              <Text className={styles.payText}>{`支付${price}元查看剩余内容`}</Text>
            ) : (
              <Text className={styles.payText}>{`支付${attachmentPrice}元查看附件内容`}</Text>
            )}
          </Button>
        </View>
      )}
    </>
  );
};

const BrWrapper = ({ children }) => <View className={styles.brWrapper}>{children}</View>;

export default React.memo(Index);
