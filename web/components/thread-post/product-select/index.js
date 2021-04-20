import React, { memo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Input, Button } from '@discuzq/design';
import styles from './index.module.scss';

const ProductSelect = () => {
  // state data
  const [link, setLink] = useState('');
  const goodImages = [
    {
      src: '/jingdong.svg',
      name: '京东',
      width: 20,
      height: 20,
    },
    {
      src: '/taobao.svg',
      name: '淘宝',
      width: 20,
      height: 20,
    },
    {
      src: '/tmall.svg',
      name: '天猫',
      width: 20,
      height: 20,
    },
    {
      src: '/pinduoduo.svg',
      name: '拼多多',
      width: 20,
      height: 20,
    },
    {
      src: '/youzan.svg',
      name: '有赞',
      width: 20,
      height: 20,
    },
  ];

  // hook
  const router = useRouter();

  // handle
  const parseLink = () => {
    // 1 没有链接给予提示
    if (link === '') {
      console.log('商品链接不能为空');
      return;
    }

    // 2 有链接，发起请求解析商品
    console.log('商品解析...');
  };

  return (
    <div className={styles['parse-goods-box']}>
      <div className={styles['parse-goods-title']}>现支持以下商品链接</div>
      <div className={styles['parse-goods-image']}>
        {goodImages.map((item) => (
          <div className={styles['image-item']} key={item.name}>
            <Image src={item.src} alt={item.name} width={item.width} height={item.height} />
            <span className={styles['image-text']}>{item.name}</span>
          </div>
        ))}
      </div>
      <Input.Textarea
        value={link}
        placeholder="请粘贴\输入商品链接"
        maxLength={49999}
        rows={8}
        onChange={(e) => setLink(e.target.value)}
      />
      <div className={styles['parse-goods-btn']}>
        <Button type="primary" onClick={parseLink}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default memo(ProductSelect);
