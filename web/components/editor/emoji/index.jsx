import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';
import styles from './index.module.scss';
import './carousel.scss';

// SwiperCore.use([Pagination]);

const onePageCount = 35;

export default function Emoji(props) {
  const { emojis = [], onClick, show, pc } = props;
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

  const responsive = { mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  };
  if (pc) return (
    <div className={`${styles['dzq-emoji']} ${styles.pc}`}>
      {emojis.map(item => <img className={styles['dzq-emoji__icon']}
        key={item.code}
        src={item.url}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
          onClick(item);
        }}
      />)}
    </div>
  );
  return (
    <Carousel
      /*
      swipeable={false}
      draggable={false}
      */
      draggable={true}
      showDots={true}
      responsive={responsive}
      deviceType="mobile"
      ssr={true}
      infinite={false}
      containerClass={`first-carousel-container container ${styles['dzq-emoji']}`}
    >
      {page.map((item, index) => (
        <div className={styles['dzq-emoji__slide']} key={index}>
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
        </div>
      ))}
    </Carousel>
  );
}
