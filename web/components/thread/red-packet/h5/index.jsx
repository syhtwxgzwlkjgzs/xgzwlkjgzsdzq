import React, { useMemo } from 'react';
import styles from './index.module.scss';
import { noop } from '@components/thread/utils';
/**
 * 红包帖/图文帖子
 * @prop {POST_TYPE} type 类型 0：红包帖 1：图文帖子
 * @prop {string} title 图文帖标题
 * @prop {string} content 红包内容
 * @prop {function} onClick 点击事件
 * @prop {string} platform 编译环境
 */
export default function H5Index(props) {
  const {
    type = POST_TYPE.REDPACKET,
    title,
    content,
    onClick = noop
  } = props;
  const texts = useMemo(() => {
    if (type === POST_TYPE.REDPACKET) {
      return {
        themeContent: (
            <>
              <div className={styles.content}>
              <div className={styles.text}>{content || ''}</div>
              </div>
            </>
        ),
        conHeight: {
          height: '103px',
        },
        textTop: {
          top: '39px'
        }
      };
    }
    return {
      themeContent: (
        <>
          <div className={styles.content}>
              <div className={styles.title}>{title || ''}</div>
              <div className={styles.text}>{content || ''}</div>
          </div>
        </>
      ),
      conHeight: {
        height: '135px',
      },
      textTop: {
        top: '53px'
      }
    };
  }, [type]);
  return (
    <div className={styles.container} style={texts.conHeight} onClick={onClick}>
      <div className={styles.money}>
        <div className={styles.moneyTop}></div>
        <div className={styles.moneyTBottom} style={texts.textTop}>开</div>
      </div>
      {texts.themeContent}
    </div>
  );
}
export const POST_TYPE = {
  REDPACKET: 0,
  IMGTEXTTHEME: 1,
};
