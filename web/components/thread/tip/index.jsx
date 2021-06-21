import React, { useMemo, useState, useEffect } from 'react';
import PopupList from '../popup-list';
import Avatar from '../../avatar';
import { Icon } from '@discuzq/design';

import styles from './index.module.scss';

/**
 * 帖子点赞、打赏视图
 * @prop {string}
 * imgs: 头像数据数组
 * showCount: 想要展示的最大点赞头像个数
 * platform: pc展示最大宽度为10个头像，其他端为5个
 */

const Index = ({ imgs = [], tipData = {}, wholeNum = 1, showMore= false, showCount = 5, platform = 'h5' }) => {
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

  // 点赞头像的总宽度
  const sty = useMemo(() => {
    return { width: `${0.2*(renderUsers.length)+0.04}rem` }
  }, [renderUsers]);

  // 点赞头像的相对位置以及层级
  const imgAfterArr = [
      styles.img, styles.imgAfter2, styles.imgAfter3, styles.imgAfter4, styles.imgAfter5,
      styles.imgAfter6, styles.imgAfter7, styles.imgAfter8, styles.imgAfter9, styles.imgAfter10
  ];

  return (
    <>
        <div className={`${styles.container} ${ platform === 'pc' ? styles.maxWidth200 : styles.maxWidth104 }`}  onClick={onClick} style={sty}>
            {
                wholeNum !== 0 && renderUsers?.filter((_, index) => index < showCount).map((item, index) => (
                  <div key={index} className={imgAfterArr[index]}>
                    <Avatar
                      image={item.avatar}
                      name={item.nickname}
                      size='small'
                    />
                  </div>
                ))
            }
            {
              showMore && renderUsers?.length > showCount &&
              <div className={styles.moreIcon} size={20}>
                <Icon name='MoreBOutlined' className={styles.icon} size={12}></Icon>
              </div>
            }
        </div>

        <PopupList tipData={tipData} visible={visible} onHidden={onHidden} />
    </>
  );
};

export default React.memo(Index);
