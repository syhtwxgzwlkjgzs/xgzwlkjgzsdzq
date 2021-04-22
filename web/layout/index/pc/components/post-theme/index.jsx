import React from 'react';
import styles from './index.module.scss';
import { Dropdown, Button } from '@discuzq/design';
import postData from './data';

/**
 * 发布按钮
 * @prop {number} showSort 是否只能排序
 */
const PostTheme = () => {

  const menu = () => {
    return <Dropdown.Menu>
      {
        postData.map((item, index) => { 
          return (
            item.isShow && <Dropdown.Item key={item.type} id={index} style={{ padding: '12px 0'}} divided={item.divided}>{item.label}</Dropdown.Item>
          )
        })
      }
    </Dropdown.Menu>;
  }
  const onChange = (key) => {
    console.log('点击了', key)
  }
  const onVisibleChange = (isShow) => {
    console.log('菜单打开：', isShow)
  }
  return (
    <Dropdown
      style={{ display: 'inline-block' }}
      menu={menu()}
      placement="left"
      hideOnClick={true}
      trigger="click"
      arrow={false}
      onChange={onChange}
      onVisibleChange={onVisibleChange}
      className={styles.postDropdown}
    >
      <Button type="primary" className={styles.publishBtn}>
        发布
      </Button>
    </Dropdown>
  );
};

export default PostTheme;
