/**
 * 发帖-选择位置
 */
import React, { memo, useState, useEffect } from 'react';
import { Tag, Toast } from '@discuzq/design';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

const Position = (props) => {
  const { position, key, router, onChange } = props;
  const { query = {} } = router;
  const [currentPosition, setCurrentPosition] = useState({});

  useEffect(() => {
    if (position.location) setCurrentPosition(position);
  }, [position]);

  useEffect(() => {
    if (query.addr) {
      const { addr = '', latng = '', name = '' } = query;
      const latngArr = latng.split(',');
      const current = {
        longitude: parseFloat(latngArr[1] || ''),
        latitude: parseFloat(latngArr[0] || ''),
        address: addr,
        location: name,
      };
      setCurrentPosition(current);
    }
  }, [query]);

  useEffect(() => {
    onChange(currentPosition);
  }, [currentPosition]);

  // handle
  const choosePosition = () => {
    // 选择位置，已经存在定位，则点击选择位置无效
    if (position.address) {
      return;
    }
    // 检查腾讯位置服务key值
    if (!key) {
      Toast.error({ content: '请检查配置的腾讯位置服务的key是否设置正确' });
      return;
    }
    getPosition();
  };

  // 调用腾讯位置服务
  const getPosition = () => {
    const geolocation = new qq.maps.Geolocation(key, 'myapp');
    geolocation.getLocation(showPosition, errorPosition, { timeout: 6000 });
  };

  // 调用位置成功
  const showPosition = (value) => {
    const coord = `${value.lat},${value.lng}`; // 坐标
    let { href } = window.location;
    const index = href.indexOf('?name'); // 过滤掉上次选择后返回的参数
    if (index !== -1) {
      href = href.substr(0, index);
    }
    const currentHref = encodeURIComponent(href);
    window.location.href = `https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${currentHref}&key=${key}&referer=myapp&coord=${coord}`;
  };

  // 调用位置失败，尝试重新调用
  const errorPosition = () => {
    getPosition();
  };

  return (
    <>
      <Tag
        type="primary"
        closeable
        size="md"
        onClick={choosePosition}
        onClose={
          () => setCurrentPosition({ location: '添加位置' })
        }
      >
        {currentPosition.location}
      </Tag>
    </>
  );
};

Position.propTypes = {
  position: PropTypes.object,
  key: PropTypes.string,
};

Position.defaultProps = {
  position: {
    longitude: '',
    latitude: '',
    location: '添加位置',
    address: '',
  },
  // TODO: 待改成从 forum 中取
  key: 'FF7BZ-27T3X-C574Z-73YBG-FGAJ2-4CF7I',
};

export default memo(withRouter(Position));
