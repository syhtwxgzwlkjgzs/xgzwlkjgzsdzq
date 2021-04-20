import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { noop } from '../utils';

/**
 * 红包帖/图文帖子
 * @prop {POST_TYPE} type 类型 0：红包帖 1：图文帖子
 * @prop {string} title 图文帖标题
 * @prop {string} content 红包内容
 * @prop {string} onClick 点击事件
 */

const Index = ({ type = POST_TYPE.REDPACKET, title, content, onClick = noop }) => {
  const texts = useMemo(() => {
    if (type === POST_TYPE.REDPACKET) {
      return {
        themeContent: (
          <>
            <div className={styles.content}>
            <div className={styles.text}>{content || '暂无内容'}</div>
            </div>
          </>
        ),
        conHeight: {
          height: '103px',
        },
      };
    }
    return {
      themeContent: (
        <>
          <div className={styles.content}>
              <div className={styles.title}>{title || '图文帖子'}</div>
              <div className={styles.text}>{content || '暂无内容'}</div>
          </div>
        </>
      ),
      conHeight: {
        height: '135px',
      },
    };
  }, [type]);

  return (
    <div className={styles.container} style={texts.conHeight} onClick={onClick}>
      <div className={styles.money}></div>
      {texts.themeContent}
    </div>
  );
};
export const POST_TYPE = {
  REDPACKET: 0,
  IMGTEXTTHEME: 1,
};

export default React.memo(Index);
