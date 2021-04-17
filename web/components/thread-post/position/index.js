/**
 * 发帖-选择位置
 */
import React, { memo } from 'react';
import { Tag } from '@discuzq/design';

import PropTypes from 'prop-types';

const Position = (props) => {
  const { position, key, onClear } = props;

  // handle
  const choosePosition = () => {
    // 选择位置，已经存在定位，则点击选择位置无效
    if (position.location) {
      return;
    }
    // 检查腾讯位置服务key值
    if (!key) {
      console.log('key值无效');
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
    console.log(currentHref);
    window.location.href = `https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=${currentHref}&key=${key}&referer=myapp&coord=${coord}`;
  };

  // 调用位置失败，尝试重新调用
  const errorPosition = () => {
    getPosition();
  };

  return (
    <>
      <Tag type="primary" closeable size="md" onClick={choosePosition} onClose={onClear}>
        {position.address}
      </Tag>
    </>
  );
};

Position.propTypes = {
  position: PropTypes.object,
  key: PropTypes.string,
  onClear: PropTypes.func, // 清除当前位置
};

Position.defaultProps = {
  position: {
    longitude: '',
    latitude: '',
    location: '',
    address: '添加位置',
  },
  key: '',
};

export default memo(Position);
