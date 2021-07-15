import { generateImageUrlByHtml } from './util.js';
import React, { useState, useRef } from 'react';
import styles from './index.module.scss';

const Index = ({ children }) => {
  const [url, setUrl] = useState('');
  const post = useRef();
  setTimeout(() => {
    generateImageUrlByHtml(document.querySelector('.poster')).then((res) => {
      setUrl(res);
    });
  }, 2000);

  return (
    <>
      <div className='poster' ref={post}>
        {children}
      </div>
      <div className={styles.imgbox}>
          <img className={styles.centImage} src={url} />
      </div>
    </>
  );
}
;

export default Index;
