import React, { useMemo, useRef, useEffect, useState } from 'react';
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
import { getElementRect, randomStr } from './utils'

/**
 * 帖子内容组件
 * @prop {object} data 帖子数据
 * @prop {function} onClick 点赞文字内容触发
 * @prop {function} onPay 点击付费按钮触发
 */

const Index = (props) => {
  const { title = '', payType, price, paid, attachmentPrice } = props.data || {};
  const needPay = useMemo(() => payType !== 0 && !paid, [paid, payType]);
  const { onClick, onPay, relativeToViewport } = props;
  const [ready, setReady] = useState({ video: false })

  const [wrapperH, setWrapperH] = useState(0)
  const wrapperId= useRef(`thread-wrapper-${randomStr()}`)

  useEffect(() => {
    const { videoData } = handleAttachmentData(props.data.content);
    const { video } = ready
    if (!videoData) {
      getElementRect(wrapperId.current).then(res => {
        setWrapperH(res?.height)
      })
    } else {
      if (video) {
        getElementRect(wrapperId.current).then(res => {
          setWrapperH(res?.height)
        })
      }
    }
  }, [ready])

  const sty = useMemo(() => {
    if (wrapperH > 0) {
      return { height: `${wrapperH}px` }
    }
    return { height: 'auto' }
  }, [wrapperH, relativeToViewport])

  const onChangeHeight = (value) => {
    setReady({ ...ready, ...value })
  }

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
      <>
        {text && (
          <PostContent 
            content={text} 
            onPay={onPay} 
            onRedirectToDetail={onClick} 
            relativeToViewport={relativeToViewport}
            onChangeHeight={onChangeHeight}
          />
        )}
        {videoData && (
          <WrapperView onClick={onClick}>
            <VideoPlay
              url={videoData.mediaUrl}
              coverUrl={videoData.coverUrl}
              v_width={videoData.width || null}
              v_height={videoData.height || null}
              onPay={onPay}
              isPay={needPay}
              status={videoData.status}
              relativeToViewport={relativeToViewport}
              onChangeHeight={onChangeHeight}
            />
          </WrapperView>
        )}
        {imageData?.length ? (
            <ImageDisplay 
              platform="h5" 
              imgData={imageData} 
              isPay={needPay} 
              onPay={onPay} 
              onClickMore={onClick}
              relativeToViewport={relativeToViewport}
            />
        ) : null}
        {rewardData && <Packet type={1} money={rewardData.money} onClick={onClick} />}
        {redPacketData && (
          <Packet money={redPacketData.money || 0} onClick={onClick} condition={redPacketData.condition} />
        )}
        {goodsData && (
            <ProductItem
              image={goodsData.imagePath}
              amount={goodsData.price}
              title={goodsData.title}
              onClick={onClick}
            />
        )}
        {audioData && <AudioPlay url={audioData.mediaUrl} isPay={needPay} onPay={onPay} />}
        {fileData?.length ? <AttachmentView threadId={threadId} attachments={fileData} onPay={onPay} isPay={needPay} /> : null}
      </>
    );
  };
  return (
    <>
      <View id={wrapperId.current}  className={styles.wrapper}>
        {title && (
          <View className={styles.title} onClick={onClick}>
            {newTitle}
          </View>
        )}

        {renderThreadContent(props.data)}
      </View>

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

export default React.memo(Index);

// 处理
const WrapperView = ({ children, onClick }) => {
  return (
    <View className={styles.wrapperView}>
      {children}
      <View className={styles.placeholder} onClick={onClick}></View>
    </View>
  )
}