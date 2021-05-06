import React, { useState } from 'react';
import PopupList from '../popup-list';
import Avatar from '../../avatar';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';

/**
 * 帖子点赞、打赏视图
 * @prop {string}    imgs 头像数据数组
 */

const Index = ({ imgs = [], tipData = {}, wholeNum = 1 }) => {
  const [visible, setVisible] = useState(false);

  const onClick = (e) => {
    e.stopPropagation();

    setVisible(true);
  };

  const onHidden = () => {
    setVisible(false);
  };

  return (
    <>
        <View className={styles.container} onClick={onClick} style={{ width: imgs.length === 1 ? '24px' : '44px' }}>
            {
                wholeNum !== 0 && imgs.filter((_, index) => index < 2).map((item, index) => (
                  <View key={index} className={index === 0 ? styles.img : styles.imgAfter}>
                    <Avatar
                      imgSrc={item.avatar}
                      name={item.userName}
                      size='small'
                    />
                  </View>
                ))
            }
        </View>

        <PopupList tipData={tipData} visible={visible} onHidden={onHidden} />
    </>
  );
};

export default React.memo(Index);
