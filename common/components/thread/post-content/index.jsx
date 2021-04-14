import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Button, Icon } from '@discuzq/design';

import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';

import styles from './index.module.scss';

/**
 * 帖子内容展示
 * @prop {string}    content 内容
 * @prop {boolean}   useShowMore 是否显示查看更多
 * @prop {boolean}   isPayContent 是否付费内容
 * @prop {number}    hidePercent 隐藏内容的百分比 eg: 80
 * @prop {number}    payAmount 查看隐藏内容支付金额
 * @prop {function}  onPay 付款点击事件
 * @prop {function}  onRedirectToDetail 跳转到详情页面，当点击内容或查看更多内容超出屏幕时跳转到详情页面
 */

const Index = ({
  content,
  useShowMore = true,
  isPayContent,
  hidePercent = 0,
  payAmount = 0,
  onPay,
  onRedirectToDetail,
  ...props
}) => {
  // 内容是否超出屏幕高度
  const [contentTooLong, setContentTooLong] = useState(true);
  const [showMore, setShowMore] = useState(!useShowMore);
  const contentWrapperRef = useRef(null);

  const texts = {
    showMore: '查看更多',
    hidePercent: `剩余${hidePercent}%内容已隐藏`,
    payButton: `支付${payAmount}元查看剩余内容`,
  };
  // 过滤内容
  const filterContent = useMemo(() => (content ? xss(s9e.parse(content)) : ''));
  // 是否显示遮罩 是付费内容并且隐藏内容百分比大于0 或 显示查看更多并且查看更多状态为false 则显示遮罩
  const showHideCover = (isPayContent && hidePercent > 0) || (useShowMore && !showMore);

  const onShowMore = useCallback(() => {
    if (contentTooLong) {
      // 内容过长直接跳转到详情页面
      onRedirectToDetail && onRedirectToDetail();
    } else {
      setShowMore(true);
    }
  }, [contentTooLong]);

  useEffect(() => {
    const el = contentWrapperRef.current;
    if (el) {
      if (el.scrollHeight <= el.clientHeight) {
        // 内容小于6行 隐藏查看更多
        setShowMore(true);
      }
      if (window && el.scrollHeight <= window.screen.height) {
        setContentTooLong(false);
      }
    }
  }, [contentWrapperRef.current]);

  return (
    <div className={styles.container} {...props}>
      <div
        ref={contentWrapperRef}
        className={`${styles.contentWrapper} ${showHideCover ? styles.hideCover : ''}`}
        onClick={!showMore ? onShowMore : onRedirectToDetail}
      >
        <div className={`${styles.content}`} dangerouslySetInnerHTML={{ __html: filterContent }} />
      </div>
      {useShowMore && !showMore && (
        <div className={styles.showMore} onClick={onShowMore}>
          <div className={styles.hidePercent}>{texts.showMore}</div>
          <Icon className={styles.icon} name="RightOutlined" size={12} />
        </div>
      )}
      {showMore && isPayContent && (
        <div className={styles.payInfo}>
          <div className={styles.hidePercent}>{texts.hidePercent}</div>
          <Button type="primary" onClick={onPay} className={styles.payButton}>
            <img className={styles.payButtonIcon} />
            {texts.payButton}
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Index);
