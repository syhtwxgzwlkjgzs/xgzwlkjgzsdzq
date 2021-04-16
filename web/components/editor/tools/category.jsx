import React from 'react';
import styles from './index.module.scss';

class ToolsCategory extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <div className={styles['dzq-tools-category']} onClick={onClick}>
        <span className="cate-icon">icon</span>
        <span className={styles['dzq-tools-category__text']}>分类</span>
        <span className={styles['dzq-tools-category__tag']}>官方动态</span>
      </div>
    );
  }
}

export default ToolsCategory;
