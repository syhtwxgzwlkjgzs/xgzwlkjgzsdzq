import React from 'react';
import styles from './index.module.scss';
import { Dropdown, Button } from '@discuzq/design';

/**
 * 发布按钮
 * @prop {number} showSort 是否只能排序
 */
const PostTheme = () => {
  const menu = () => {
    return <Dropdown.Menu>
      <Dropdown.Item id="1">文本</Dropdown.Item>
      <Dropdown.Item id="2">帖子</Dropdown.Item>
      <Dropdown.Item id="3">图片</Dropdown.Item>
      <Dropdown.Item id="4">视频</Dropdown.Item>
      <Dropdown.Item id="5">问答</Dropdown.Item>
      <Dropdown.Item id="6">商品</Dropdown.Item>
    </Dropdown.Menu>;
  }
  return (
    <Dropdown
      style={{ display: 'inline-block' }}
      menu={menu()}
      placement="left"
      hideOnClick={true}
      trigger="hover"
      onChange={key => console.log('点击了', key)}
      onVisibleChange={isShow => console.log('菜单打开：', isShow)}
      className={styles.postDropdown}
    >
      <Button type="primary" className={styles.publishBtn}>
        发布
      </Button>
    </Dropdown>
  );
};

export default PostTheme;
