import React, { useState } from 'react';
import PopupList from '../popup-list';
import styles from './index.module.scss';

/**
 * 帖子点赞、打赏视图
 * @prop {string}    imgs 头像数据数组
 */

const Index = ({ imgs = [
  'https://gameplus-platform.cdn.bcebos.com/gameplus-platform/upload/file/img/6cf049a661ee8b72a828c951cd96bc20/6cf049a661ee8b72a828c951cd96bc20.png',
  'https://gameplus-platform.cdn.bcebos.com/gameplus-platform/upload/file/img/6cf049a661ee8b72a828c951cd96bc20/6cf049a661ee8b72a828c951cd96bc20.png',
] }) => {
  const [visible, setVisible] = useState(false);

  const onClick = () => {
    setVisible(true);
  };

  return (
    <>
        <div className={styles.container} onClick={onClick} style={{ width: imgs.length === 1 ? '0.24rem' : '0.44rem' }}>
            {
                imgs.filter((_, index) => index < 2).map((item, index) => (
                    <img className={index === 1 ? styles.img : styles.imgAfter} src={item} key={index} />
                ))
            }
        </div>

        <PopupList visible={visible} onHidden={() => setVisible(false)} />
    </>
  );
};

export default React.memo(Index);
