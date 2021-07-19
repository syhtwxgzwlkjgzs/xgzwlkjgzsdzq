import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { getMiniCode } from '@server';
import styles from './index.module.scss';
const Index = ({ site }) => {
  const [miniCode, setMiniCode] = useState('');
  const defaultLogo = '/dzq-img/default-logo.png';
  const { siteName } = site.webConfig?.setSite || '';
  useEffect(async () => {
    try {
      const sitePath = '/indexPages/index/index';
      const paramPath = `/pages/index/index?path=${encodeURIComponent(sitePath)}`;
      const res = await getMiniCode({ params: { path: paramPath } });
      if (res?.code === 0) {
        setMiniCode(res?.data.base64Img);
      } else {
        setMiniCode(defaultLogo);
      }
    } catch {
      setMiniCode(defaultLogo);
    }
  }, []);
  return (
        <div className={styles.footerBox}>
            <img src={miniCode} className={styles.footerImg}/>
            <span className={styles.desc}>
                长按小程序码查看详情
            </span>
            <span className={styles.siteName}>
                {`来自${siteName}`}
            </span>
        </div>
  );
};

export default inject('site')(observer(Index));
