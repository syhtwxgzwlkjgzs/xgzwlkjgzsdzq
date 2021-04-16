import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import styles from './index.module.scss';

SwiperCore.use([Pagination]);

const onePageCount = 35;

// TODO: 暂时这么处理，后台应该返回完整的链接
const formatEmojiUrl = (url) => {
  if (/(http|https)/.test(url)) return url;
  return `https://newdiscuz-dev.dnspod.dev/${url}`;
};

export default function Emoji(props) {
  const { emojis = [], onClick, show } = props;
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState([]);
  const pageCount = [...Array(onePageCount).keys()];
  useEffect(() => {
    const onePage = Math.ceil(emojis.length / onePageCount);
    setPage([...Array(onePage).keys()]);
  }, [emojis]);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  if (!visible) return null;
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ type: 'bullets' }}
      className={styles['dzq-emoji']}
    >
      {page.map((item, index) => (
          <SwiperSlide className={styles['dzq-emoji__slide']} key={index}>
          {pageCount.map((elem, key) => {
            const curIndex = (index * onePageCount) + key;
            if (curIndex + 1 > emojis.length) return null;
            return <img className={styles['dzq-emoji__icon']}
              key={emojis[curIndex].code}
              src={formatEmojiUrl(emojis[curIndex].url)}
              onClick={() => onClick(emojis[curIndex])}
            />;
          })}
          </SwiperSlide>
      ))}
    </Swiper>
  );
}
