import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Icon from '@discuzq/design/dist/components/icon/index';
import RichText from '@discuzq/design/dist/components/rich-text/index';
import Button from '@discuzq/design/dist/components/button/index';
import { noop } from '../utils'

import fuzzyCalcContentLength from '@common/utils/fuzzy-calc-content-length';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import { View, Text, Image } from '@tarojs/components'
import styles from './index.module.scss';

/**
 * 帖子内容展示
 * @prop {string}   content 内容
 * @prop {boolean}  useShowMore 是否显示查看更多
 * @prop {boolean}  isPayContent 是否付费内容
 * @prop {number}   hidePercent 隐藏内容的百分比 eg: 80
 * @prop {number}   payAmount 查看隐藏内容支付金额
 * @prop {function} onPay 付款点击事件
 * @prop {function} onRedirectToDetail 跳转到详情页面，当点击内容或查看更多内容超出屏幕时跳转到详情页面
 * @prop {boolean}  loading
 */

const Index = ({
  content,
  useShowMore = true,
  isPayContent,
  hidePercent = 0,
  payAmount = 0,
  onPay,
  onRedirectToDetail = noop,
  loading,
  ...props
}) => {
  // 内容是否超出屏幕高度
  const [contentTooLong, setContentTooLong] = useState(false);
  const [showMore, setHiddenMore] = useState(!useShowMore);
  const contentWrapperRef = useRef(null);

  const texts = {
    showMore: '查看更多',
    hidePercent: `剩余${hidePercent}%内容已隐藏`,
    payButton: `支付${payAmount}元查看剩余内容`,
  };
  // 过滤内容
  const filterContent = useMemo(() => {
    let newContent = content ? s9e.parse(content) : '暂无内容';
    newContent = xss(newContent);

    return !loading ? newContent : '内容加载中';
  }, [content, loading]);
  // 是否显示遮罩 是付费内容并且隐藏内容百分比大于0 或 显示查看更多并且查看更多状态为false 则显示遮罩
  const showHideCover = !loading ? (isPayContent && hidePercent > 0) || (useShowMore && !showMore) : false;

  const onShowMore = useCallback((e) => {
    e && e.stopPropagation();

    if (contentTooLong) {
      // 内容过长直接跳转到详情页面
      onRedirectToDetail && onRedirectToDetail();
    } else {
      setHiddenMore(true);
    }
  }, [contentTooLong]);

  const handleClick = (e) => {
    if (e.target.localName === 'a') {
      return
    }
    e && e.stopPropagation();

    onRedirectToDetail()
  }

  const onLinkClick = (e) => {

  }

  useEffect(() => {
    const length = fuzzyCalcContentLength(filterContent)
    if (length < 262) {
      setHiddenMore(true);
    } else {
      setHiddenMore(false);
    }
    if (length > 1200) {
      setContentTooLong(true)
    } else {
      setContentTooLong(false)
    }
  }, [filterContent]);

  return (
    <View className={styles.container} {...props}>
      <View
        ref={contentWrapperRef}
        className={`${styles.contentWrapper} ${showHideCover ? styles.hideCover : ''}`}
        onClick={!showMore ? onShowMore : handleClick}
      >
        <View className={styles.content}>
          <RichText content={filterContent} onClick={handleClick} onLinkClick={onLinkClick} />
        </View>
      </View>
      {!loading && useShowMore && !showMore && (
        <View className={styles.showMore} onClick={onShowMore}>
          <View className={styles.hidePercent}>{texts.showMore}</View>
          <Icon className={styles.icon} name="RightOutlined" size={12} />
        </View>
      )}
      {!loading && showMore && isPayContent && (
        <View className={styles.payInfo}>
          <View className={styles.hidePercent}>{texts.hidePercent}</View>
          {/* <Button type="primary" onClick={onPay} className={styles.payButton}>
            <Image className={styles.payButtonIcon} />
            {texts.payButton}
          </Button> */}
        </View>
      )}
    </View>
  );
};

export default React.memo(Index);
