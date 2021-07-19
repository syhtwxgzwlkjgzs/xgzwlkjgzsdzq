import { generateImageUrlByHtml, savePic } from './util.js';
import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Toast } from '@discuzq/design';
import Footer from './footer';

const Index = ({ children }) => {
  const [url, setUrl] = useState('');
  const [ready, setReady] = useState(false);
  const post = useRef(null);
  useEffect(() => {
    if (ready) {
      generateImageUrlByHtml(post.current).then((res) => {
        setUrl(res);
      });
    }
  }, [ready]);
  const saveImg = () => {
    savePic(url);
  };
  if (!ready) {
    Toast.info({ content: '正在绘制...' });
  }
  return (
    <div className={styles.contain}>
      <div className={styles.poster} ref={post}>
        {children}
        <Footer setReady={setReady}></Footer>
      </div>
      {ready && (
        <div className={styles.imgbox}>
          <img className={styles.centImage} src={url} />
        </div>
      )}
      <div className={styles.shareBtn}>
        <Button className={styles.btn} onClick={saveImg}>保存到相册</Button>
      </div>
    </div>
  );
}
;

export default Index;
