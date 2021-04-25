
/**
 * 小部件（含：上传图片按钮、上传附件按钮、图片展示、附件展示、视频展示） - ui组件，不含数据逻辑
 */
 import React from 'react';
 import Taro from '@tarojs/taro';
 import { View, Text, Image, Video } from '@tarojs/components';
 import styles from './index.module.scss';
 import { Icon } from '@discuzq/design';

const Index = (props) => {
  const { type = 'upload', filename, size, src, className, onUpload, onDelete, productSrc, productDesc, productPrice } = props;

  // 图片展示
  const img = (
    <View className={[styles['img'], className].join(' ')}>
      <Image src={src} onClick={() => {
        Taro.previewImage({
          current: src,
          urls: [src]
        })
      }} />
      <View className={styles['delete']} onClick={onDelete}>
        <Icon name='PaperClipOutlined' size={16} />
      </View>
    </View>
  );

  // 视频展示
  const video = (
    <Video src={src} className={styles['video']} />
  );

  // 附件展示
  const atta = (
    <View className={styles['atta']}>
      <View src={src} className={styles['left']}>
        <Icon name='PaperClipOutlined' size={16} />
        <Text className={styles['name']}>{filename}</Text>
        <Text className={styles['size']}>{size}</Text>
      </View>
      <Icon name='MailOutlined' size={16} onClick={onDelete} />
    </View>
  );

  // 商品展示
  const product = (
    <View className={styles['product']}>
      <Image className={styles['image']} src={productSrc}></Image>
      <View className={styles['content']}>
        <Text className={styles['desc']}>{productDesc}</Text>
        <View className={styles['opera']}>
          <Text className={styles['price']}>{`￥${productPrice}`}</Text>
          <Icon name='MailOutlined' size={16} onClick={onDelete} />
        </View>
      </View>
    </View>
  );

  // 附件添加
  const attaUpload = (
    <View className={styles['upload-atta']} onClick={onUpload}>
      <Icon name='PlusOutlined' size={16} className={styles['text']} />
      <Text className={styles['text']}>添加附件</Text>
    </View>
  );

  // 图片添加
  const imgUpload = (
    <View className={styles['upload-img']} onClick={onUpload}>
      <Icon name='PlusOutlined' size={16} className={styles['text']} />
      <Text className={styles['text']}>上传图片</Text>
    </View>
  );


  switch (type) {
    case 'atta-upload': return attaUpload;
    case 'img-upload': return imgUpload;
    case 'video': return video;
    case 'img': return img;
    case 'atta': return atta;
    case 'product': return product;
  };
};

export default React.memo(Index);
