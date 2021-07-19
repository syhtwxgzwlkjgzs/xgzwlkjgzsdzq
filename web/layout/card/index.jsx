import { generateImageUrlByHtml, savePic } from './util.js';
import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';
import { Button, Toast } from '@discuzq/design';
import Footer from './footer';
import isWeiXin from '@common/utils/is-weixin';

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
    Toast.loading({ content: '正在绘制...' });
  }
  let shareText = '保存到相册';
  // 判断是否在微信浏览器中
  if (isWeiXin()) {
    shareText = '长按图片保存到相册';
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
        <Button className={`${styles.btn} ${isWeiXin() ? styles.btnWxBgc : styles.btnH5Bgc}`} onClick={isWeiXin() ? '' : saveImg}>{shareText}</Button>
      </div>
    </div>
  );
}
;

export default Index;
