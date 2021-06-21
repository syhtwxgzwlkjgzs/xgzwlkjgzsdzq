import React, { useMemo } from 'react';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import { View } from '@tarojs/components'

export default function avatar(props) {
  const { image = '', name = '匿', onClick = () => {}, className = '', circle = true, size = 'primary' } = props;

  const userName = useMemo(() => {
    const newName = name?.toLocaleUpperCase()[0];
    return newName;
  }, [name]);

  const onClickUserImage = (e) => {
    if ((image && image !== '') ||  (userName !== '匿' && userName !== '')) {
      onClick(e)
    }
  } 

  if (image && image !== '') {
    return (
      <View onClick={onClickUserImage}>
        <Avatar className={className} circle={circle} image={image} size={size}></Avatar>
      </View>
    );
  }

  return (
    <View onClick={onClickUserImage}>
      <Avatar className={className} circle={circle} text={userName} size={size}></Avatar>
    </View>
  );
}
