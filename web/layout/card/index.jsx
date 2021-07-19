import { generateImageUrlByHtml } from './util.js';
import React, { useState, useRef } from 'react';
import styles from './index.module.scss';
import { Button } from '@discuzq/design';
const Index = ({ children }) => {
  const [url, setUrl] = useState('');
  const post = useRef(null);
  setTimeout(() => {
    generateImageUrlByHtml(post.current).then((res) => {
      setUrl(res);
    });
  }, 2000);
  return (
    <div className={styles.contain}>
      <div ref={post}>
        {children}
      </div>
      <div className={styles.imgbox}>
          <img className={styles.centImage} src={url} />
      </div>
      <div className={styles.shareBtn}>
        <Button className={styles.btn}>保存到相册</Button>
      </div>
    </div>
  );
}
;

export default Index;
