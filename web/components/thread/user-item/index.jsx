import React, { useMemo } from 'react';
import { Button, Icon } from '@discuzq/design';
import { noop } from '../utils';
import styles from './index.module.scss';

/**
 * 用户信息视图
 * @prop {string}  imgSrc 用户头像
 * @prop {string}  title 用户名字
 * @prop {string}  subTitle 额外信息
 * @prop {string}  icon 用户头像右下角图标
 * @prop {string}  label 额外信息
 * @prop {string}  onClick 点击事件
 */

const Index = ({ imgSrc, title = '', icon, subTitle, label, index, onClick = noop  }) => {
  const imgLabel = useMemo(() => {
    // 头像默认占位图为username首字
    if (!imgSrc && imgSrc === '') {
      return title.substr(0, 1);
    }
    return '';
  }, [imgSrc]);

  return (
    <div className={styles.listItem} key={index} onClick={onClick}>
      <div className={styles.wrapper}>
          <div className={styles.header}>
              {
                imgSrc ? (
                  <img className={styles.img} src={imgSrc}></img>
                ) : (
                  <span className={styles.img}>{imgLabel}</span>
                )
              }
              {
                icon && (
                  <div className={styles.icon} style={{ backgroundColor: index % 2 === 0 ? '#e02433' : '#ffc300' }}>
                      <Icon name={icon} />
                  </div>
                )
              }
          </div>

          <div className={styles.content}>
              <span className={styles.title}>{title}</span>
              <span className={styles.subTitle}>{subTitle}</span>
          </div>
      </div>

      {
        label || label === '' ? (
          <div className={styles.footer}>
            <span className={styles.label}>{label}</span>
            <Icon className={styles.rightIcon} name="RightOutlined" size={12} />
          </div>
        ) : (
          <Button type="primary" onClick={onClick}>查看主页</Button>
        )
      }
    </div>
  );
};

export default React.memo(Index);
