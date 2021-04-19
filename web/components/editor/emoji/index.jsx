import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import styles from './index.module.scss';

SwiperCore.use([Pagination]);

const onePageCount = 35;

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
              src={emojis[curIndex].url}
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
                onClick(emojis[curIndex]);
              }}
            />;
          })}
          </SwiperSlide>
      ))}
    </Swiper>
  );
}
