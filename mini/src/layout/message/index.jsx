import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import { Button } from '@discuzq/design';
import { View } from '@tarojs/components';

import NoticeItem from '@components/message/notice-item';
import SliderLeft from '@components/message/slider-left';
import mock from './mock.json';

const Index = inject('site')(observer(() => {
  const test = () => { };
  // props,state
  const [type, setType] = useState('user'); // chat,system,financial,user
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
    <View className={styles.container}>
      <Button onClick={test}>mini test</Button>
      <SliderLeft
        list={list}
        offsetLeft={'-74px'}
        type={type}
        RenderItem={NoticeItem}
        onDelete={handleDelete}
      />
    </View>
  );
}));

export default Index;
