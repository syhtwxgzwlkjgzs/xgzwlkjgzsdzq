import React from 'react';

import styles from './index.module.scss';

/**
 * 单个商品内容展示
 * @prop {string} image 商品图片
 * @prop {string} title 商品名称
 * @prop {number|string} amount 商品价格
 */

const Index = ({ image, title, amount = 0, className: _className = '', ...props }) => (
    <div className={`${styles.container} ${_className}`} {...props}>
      <img className={styles.image} src={image} alt="product"/>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.amount}>¥{amount}</div>
      </div>
    </div>
);

export default React.memo(Index);
