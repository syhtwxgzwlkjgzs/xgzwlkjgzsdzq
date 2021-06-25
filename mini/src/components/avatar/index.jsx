import React, { useMemo } from 'react';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import { View } from '@tarojs/components';
import { useCallback } from 'react';

export default function avatar(props) {
  const {
    userId = null,
    image = '',
    name = '匿',
    onClick = () => {},
    className = '',
    circle = true,
    size = 'primary',
    withoutStopPropagation = false, // 是否需要阻止冒泡 默认false不阻止
  } = props;

  const userName = useMemo(() => {
    const newName = name?.toLocaleUpperCase()[0];
    return newName;
  }, [name]);

  const clickHandle = useCallback(
    (e) => {
      if (withoutStopPropagation) {
        e.stopPropagation();
      }
      if (!userId) return;
      onClick && onClick(e);
    },
    [userId, withoutStopPropagation],
  );

  if (image && image !== '') {
    return (
      <View onClick={clickHandle}>
        <Avatar className={className} circle={circle} image={image} size={size}></Avatar>
      </View>
    );
  }

  return (
    <View onClick={clickHandle}>
      <Avatar className={className} circle={circle} text={userName} size={size}></Avatar>
    </View>
  );
}
