/**
 * 发帖-选择位置
 * @prop {object} position 输入位置对象
 * @prop {string} key 腾讯位置服务key值
 * @prop {object} router 当前路由对象
 * @prop {function} onChange 监听位置改变事件
 */
import React, { memo, useState, useEffect, useMemo } from 'react';
import { withRouter } from 'next/router';
import { Tag, Icon, Toast } from '@discuzq/design';
import classNames from 'classnames';
import styles from './index.module.scss';

import MapDialog from './../map-dialog';

import PropTypes from 'prop-types';

const Position = (props) => {
  const { position, key, router, onChange = () => {}, onClick = () => {} } = props;
  const [currentPosition, setCurrentPosition] = useState({});

  const [isShowMap, toggleIsShowMap] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  const [geolocation, setGeolocation] = useState(null);

  useEffect(() => {
    if (position.address) setCurrentPosition(position);
  }, [position]);

  useEffect(() => {
    if (currentPosition.address !== position.address
      || currentPosition.location !== position.location) onChange(currentPosition);
  }, [currentPosition]);

  // handle
  const choosePosition = () => {
    // 选择位置，已经存在定位，则点击选择位置无效
    // if (position.address) {
    //   return;
    // }
    // 检查腾讯位置服务key值
    if (!key) {
      Toast.error({ content: '请检查配置的腾讯位置服务的key是否设置正确' });
      return;
    }
    onClick();
    // 如果初始化失败，再次初始化
    if (!geolocation) initPosition();
    // 展示地图
    toggleIsShowMap(true);
  };

  // 腾讯地图
  // 调用腾讯位置服务
  const initPosition = () => {
    const geolocation = new qq.maps.Geolocation(key, 'myapp');
    setGeolocation(geolocation);
    geolocation.getLocation(showPosition, errorPosition, { timeout: 6000 });
  };
  // 调用位置成功
  const showPosition = (value) => {
    const coord = value ? `${value.lat},${value.lng}` : ''; // 坐标
    const newMapUrl = `https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=${key}&referer=myapp&coord=${coord}`;

    if (!isShowMap) {
      setMapUrl(newMapUrl);
    } else {
      // 如果当前用户在查看地图，则延缓设置地图值，避免用户在选地址过程中地图刷新
      setTimeout(() => {
        showPosition(value)
      }, 1000)
    }
  };
  // 调用位置失败，尝试重新调用
  const errorPosition = () => {
    initPosition();
  };
  // 优化地图展示，缩短地图打开等待时间
  useEffect(() => {
    // 设置默认地址
    showPosition();
    // 提前初始化地图 TODO: 这里暂时放在一进入就初始化，不过这个会有一个位置授权的操作
    if (qq) initPosition();
  }, []);

  return (
    <div>
      <Tag
        type="primary"
        closeable={currentPosition.location}
        size="md"
        onClick={choosePosition}
        onClose={
          () => setCurrentPosition({ location: '' })
        }
        className={classNames(styles.tag, {
          [styles.checked]: !!currentPosition.location,
        })}
      >
        <Icon name="PositionOutlined" size={12} />
        {currentPosition.location || '你在哪里？'}
      </Tag>
      { isShowMap ? (
        <MapDialog
          mapUrl={mapUrl}
          onClose={() => { toggleIsShowMap(!isShowMap); }}
          onChange={position => onChange(position)}
        />
      ) : ''}
    </div>
  );
};

Position.propTypes = {
  position: PropTypes.object,
  key: PropTypes.string,
  onChange: PropTypes.func,
};

Position.defaultProps = {
  position: {
    longitude: '',
    latitude: '',
    location: '',
    address: '',
  },
  // TODO: 待改成从 forum 中取
  key: 'FF7BZ-27T3X-C574Z-73YBG-FGAJ2-4CF7I',
  onChange: () => { },
};

export default memo(withRouter(Position));
