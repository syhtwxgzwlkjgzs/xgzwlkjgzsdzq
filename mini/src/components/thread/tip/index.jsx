import React, { useState, useMemo } from 'react';
import PopupList from '../popup-list';
import Avatar from '../../avatar';
import { View, Text, Image } from '@tarojs/components';
import Icon from '@discuzq/design/dist/components/icon/index'
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';

/**
 * 帖子点赞、打赏视图
 * @prop {string}    imgs 头像数据数组
 */

 const Index = inject('index')(
  observer(({ imgs = [], tipData = {}, wholeNum = 1,showMore=false, index, showCount = 5 }) => {
  const [visible, setVisible] = useState(false);

  const onClick = (e) => {
    e.stopPropagation();
    index.setHiddenTabBar(true)
    index.setHasOnScrollToLower(false)
    setVisible(true);
  };

  const onHidden = () => {
    index.setHiddenTabBar(false)
    index.setHasOnScrollToLower(true)

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

    // 点赞头像的总宽度
  const sty = useMemo(() => {
    return { width: `${22*(renderUsers.length)+4}px` }
  }, [renderUsers]);

  const imgAfterArr = [styles.img, styles.imgAfter2, styles.imgAfter3, styles.imgAfter4, styles.imgAfter5];

    return (
    <>
        <View className={styles.container} onClick={onClick} style={sty}>
            {
                wholeNum !== 0 && renderUsers?.filter((_, index) => index < showCount).map((item, index) => (
                  <View key={index} className={imgAfterArr[index]}>
                    <Avatar
                      image={item.avatar}
                      name={item.nickname}
                      size='small'
                    />
                  </View>
                ))
            }
            {
              showMore && renderUsers?.length > showCount &&
              <View className={styles.moreIcon} size={20}>
                <Icon name='MoreBOutlined' className={styles.icon} size={12}></Icon>
              </View>
            }
        </View>

        <PopupList tipData={tipData} visible={visible} onHidden={onHidden} />
    </>
  );
}));

export default React.memo(Index);
