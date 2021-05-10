import React, { memo, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Button } from '@discuzq/design';

import NoticeItem from '@components/message/notice-item';
import SliderLeft from '@components/message/slider-left';
import mock from '../mock.json';

const H5MyPage = () => {
  // props,state
  const [type, setType] = useState('financial'); // chat,system,financial,user
  const [list, setList] = useState([]);

  // hooks
  useEffect(() => {
    setList(mock[type]); // 设置渲染数据
  }, [])

  // handle
  const handleDelete = (id) => {
    const _list = [...list].filter(item => item.id !== id);
    setList(_list);
  }

  return (
    <div className={styles.container}>
      <Button>h5 test</Button>
      <SliderLeft
        list={list}
        offsetLeft={'-74px'}
        type={type}
        RenderItem={NoticeItem}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default inject('site')(observer(memo(H5MyPage)));
