
/**
 * 发帖页底部工具栏的tag，如分类、悬赏问答、红包、付费贴等tag
 */
import React from 'react';
import { Text } from '@tarojs/components';
import styles from './index.module.scss';
import PropTypes from 'prop-types';

const Tag = (props) => {
  const { content, clickCb = () => {} } = props;
  return (
    <Text className={styles['content']} onClick={() => {clickCb();}}>{content}</Text>
  );
};

Tag.propTypes = {
  /**
   * tag中展示的内容，必传
   */
  content: PropTypes.string.isRequired,
  /**
   * 点击tag的回调
   */
   clickCb: PropTypes.func,
};


export default Tag;
