import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Video } from '@discuzq/design';
import { noop } from '../utils';

/**
 * 视频
 * @prop {boolean} isPay 是否需要付费
 * @prop {string | number} width 视频宽度
 * @prop {string | number} height 视频高度
 * @prop {string | number} money 付费金额
 * @prop {string} coverUrl 封面图片
 * @prop {string} url 视频地址
 * @prop {string} time 总时长
 * @prop {function} onPay 付费时，蒙层点击事件
 */


const Index = ({
  isPay = false,
  coverUrl,
  url,
  time,
  money = 0,
  onPay = noop,
}) => {
  let player = null;
  const ref = useRef();
  const [width, setWidth] = useState(null);

  const onReady = (ins) => {
    player = ins;
  };

  useEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setWidth(rect?.width || 343);
  }, []);

  return (
    <div id="common-video-play" className={styles.container} ref={ref}>
      {
        width && (
          <Video
            className={styles.videoBox}
            onReady={onReady}
            src={url}
            width={width}
            height={9 * (width) / 16 || '224'}
            poster={coverUrl}
            duration={time}
          />
        )
      }
      {/* 视频蒙层 已付费时隐藏 未付费时显示 */}
      {
        isPay && <div className={styles.payBox} onClick={onPay}></div>
      }
    </div>
  );
};

export default React.memo(Index);
