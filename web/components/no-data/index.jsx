import React from 'react';
import { Button, Icon } from '@discuzq/design';
import { noop } from '../thread/utils';

import styles from './index.module.scss';

/**
 * 空数据页面
 * @prop {function} text 文字
 * @param {string} icon 图标
 * @prop {function} onClick 点击刷新按钮，触发事件
 * @prop {string} isShowBtn 是否显示刷新按钮
 * @prop {string} btnText 自定义刷新按钮文字
 */

const NoData = ({ text = '暂无数据', icon = '', onClick = noop, isShowBtn = false, btnText = '点击刷新' }) => (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {icon && <Icon name={icon} size={48} className={styles.icon} />}
        <span>{text}</span>
      </div>
      {isShowBtn && <Button onClick={onClick}>{btnText}</Button>}
    </div>
);

export default React.memo(NoData);
