import React, { useMemo } from 'react';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import { View } from '@tarojs/components'
import { useCallback } from 'react';

export default function avatar(props) {
  const { userId = null, image = '', name = '匿', onClick = () => {}, className = '', circle = true, size = 'primary' } = props;

  const userName = useMemo(() => {
    const newName = name?.toLocaleUpperCase()[0];
    return newName;
  }, [name]);

  const clickHandle = useCallback((e) => {
    e.stopPropagation();
    if (!userId) return;
    onClick && onClick(e);
  }, [userId]);

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
