import React from 'react';
import styles from './index.module.scss';

const toolbar = ['emojii', '@', '#', '附件', '红包', '付费'];

class DefaultToolbar extends React.Component {
  render() {
    return (
      <div className={styles['dvditor-toolbar']}>
        <div className={styles['dvditor-toolbar__left']}>
          {toolbar.map(item => <div key={item} className={styles['dvditor-toolbar__item']}>{item}</div>)}
        </div>
        <div className={styles['dvditor-toolbar__right']}>发布</div>
      </div>
    );
  }
}

export default DefaultToolbar;
