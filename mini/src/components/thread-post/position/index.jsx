/**
 * 定位组件
 */
import React, { memo, useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Taro from '@tarojs/taro';

const Index = (props) => {
  const { currentPosition = {}, positionChange = () => {} } = props;

  // 是否已经选择定位
  const [isChose, setIsChose] = useState(false);
  // 当前定位
  const [positon, setPosition] = useState({});


  useEffect(() => {
    if (currentPosition.name) {
      setPosition(currentPosition);
    }
  }, []);

  // 选择定位
  const chooseLocation = () => {
    Taro.chooseLocation({
      ...positon,
      success(ret) {
        setPosition(ret);
        setIsChose(true);
        positionChange(positon);
      }
    });
  };

  // 删除定位
  const removeLocation = () => {
    setPosition({});
    setIsChose(false);
    positionChange(positon);
  };


  return (
    <View className={classNames(styles['positon'], {
      [styles['chose']]: isChose,
    })}>
      <Icon name='PositionOutlined' size={10} onClick={chooseLocation} />
      <Text className={styles['text']} onClick={chooseLocation}>{positon.name || '你在哪里？'}</Text>
      {isChose && <Icon className={styles['remove-icon']} name='CloseOutlined' size={10} onClick={removeLocation} />}
    </View>
  );
};

Index.propTypes = {
  /**
   * 位置变化的回调
   */
   positionChange: PropTypes.func,

   currentPosition: PropTypes.object,
};


export default memo(Index);
