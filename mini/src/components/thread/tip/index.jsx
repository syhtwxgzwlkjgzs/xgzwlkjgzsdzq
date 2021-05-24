import React, { useState, useMemo } from 'react';
import PopupList from '../popup-list';
import Avatar from '../../avatar';
import { Icon } from '@discuzq/design';

import styles from './index.module.scss';
import { View, Text } from '@tarojs/components'

/**
 * 帖子点赞、打赏视图
 * @prop {string}    imgs 头像数据数组
 */

const Index = ({ imgs = [], tipData = {}, wholeNum = 1,showMore=false }) => {
  const [visible, setVisible] = useState(false);

  const onClick = (e) => {
    e.stopPropagation();

    setVisible(true);
  };

  const onHidden = () => {
    setVisible(false);
  };

  const renderUsers = useMemo(() => {
    const map = {};
    return imgs.reduce((result, item) => {
      if (!map[item.userId]) {
        result.push(item);
        map[item.userId] = 1;
      }
      return result;
    }, [])
  }, [imgs]);

  return (
    <>
        <View className={styles.container} onClick={onClick} style={{ width: renderUsers.length === 1 ? '24px' : '44px' }}>
            {
                wholeNum !== 0 && renderUsers.filter((_, index) => index < 2).map((item, index) => (
                  <View key={index} className={index === 0 ? styles.img : styles.imgAfter}>
                    <Avatar
                      image={item.avatar}
                      name={item.userName}
                      size='small'
                    />
                  </View>
                ))
            }
            {
              showMore && imgs?.length > 2 &&
              <View className={styles.moreIcon} size={20}>
                <Icon name='MoreBOutlined' className={styles.icon} size={12}></Icon>
              </View>
            }
        </View>

        <PopupList tipData={tipData} visible={visible} onHidden={onHidden} />
    </>
  );
};

export default React.memo(Index);
