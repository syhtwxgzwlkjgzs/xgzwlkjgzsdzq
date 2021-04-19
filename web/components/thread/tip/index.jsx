import React, { useState } from 'react';
import PopupList from '../popup-list';
import styles from './index.module.scss';

/**
 * 帖子点赞、打赏视图
 * @prop {string}    imgs 头像数据数组
 */

const Index = ({ imgs = [] }) => {
  const [visible, setVisible] = useState(false);

  const onClick = () => {
    setVisible(true);
  };

  return (
    <>
        <div className={styles.container} onClick={onClick} style={{ width: imgs.length === 1 ? '0.24rem' : '0.44rem' }}>
            {
                imgs.filter((_, index) => index < 2).map((item, index) => (
                    <img className={index === 0 ? styles.img : styles.imgAfter} src={item} key={index} />
                ))
            }
        </div>

        <PopupList visible={visible} onHidden={() => setVisible(false)} />
    </>
  );
};

export default React.memo(Index);
