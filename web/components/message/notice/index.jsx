import React, { memo } from 'react';
import { inject, observer } from 'mobx-react';
import NoticeItem from '@components/message/notice-item';
import SliderLeft from '@components/message/slider-left';

/**
 * 消息通知组件(h5 + PC)
 * @prop {Array} list 数据
 * @prop {string} type 消息类型
 * @prop {function} onBtnClick 处理操作按钮点击
 * 可定制左滑按钮图标、文本，左滑距离等
*/

const Index = ({ site, ...props }) => {
  const { platform } = site;
  const renderPC = () => {
    const { list = [], ...other } = props;
    return (<>
      {list.map(item => <NoticeItem key={item.id} item={item} {...other} />)}
    </>)
  }

  if (platform === 'pc') return renderPC();
  return <SliderLeft RenderItem={NoticeItem} {...props} />
}

export default inject('site')(observer(Index));
