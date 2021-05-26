import React, { useMemo } from 'react';
import Avatar from '@discuzq/design/dist/components/avatar/index';

export default function avatar(props) {
  const { image = '', name = '匿', onClick = () => {}, className = '', circle = true, size = 'primary' } = props;

  const userName = useMemo(() => {
    const newName = name?.toLocaleUpperCase()[0];
    return newName;
  }, [name]);

  if (image && image !== '') {
    return (<Avatar className={className} circle={circle} image={image} size={size} onClick={onClick}></Avatar>);
  }

  return (
    <Avatar className={className} circle={circle} text={userName} size={size} onClick={onClick}></Avatar>
  );
}
