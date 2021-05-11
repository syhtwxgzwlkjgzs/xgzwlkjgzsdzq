import React from 'react';
import NoticeItem from '@components/message/notice-item';
import SliderLeft from '@components/message/slider-left';

const Index = (props) => (<SliderLeft RenderItem={NoticeItem} {...props} />)

export default Index;
