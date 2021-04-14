/**
 * 发帖-选择位置
 */
import React, { memo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { Tag } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';

import PropTypes from 'prop-types';

const PostPosition = ({ site, onChange }) => {
  // 腾讯位置服务的key值 模拟key: FF7BZ-27T3X-C574Z-73YBG-FGAJ2-4CF7I
  const key = (site.webConfig && site.webConfig.lbs.qq_lbs_key) || 'FF7BZ-27T3X-C574Z-73YBG-FGAJ2-4CF7I';

  // state
  const [currentPosition, setCurrentPosition] = useState({
    longitude: '',
    latitude: '',
    location: '',
    address: '添加位置',
  });
  const route = useRouter();

  // hooks
  useEffect(() => {
    // 模拟获取位置时所用的腾讯位置服务脚本
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js';
    document.body.appendChild(script);

    // 页面加载时，query存在经纬度，则更新当前定位对象
    const { query: position } = route;
    if (position.latng) {
      const latng = position.latng.split(',');
      setCurrentPosition({
        longitude: latng[0],
        latitude: latng[1],
        location: position.name,
        address: position.addr || currentPosition.address,
      });
    }
  }, []);

  useEffect(() => {
    // 可以监听位置信息，向外传递信息
    onChange && onChange(currentPosition);
  }, [currentPosition]);

  const clearPosition = () => {
    // 清除位置
    setCurrentPosition({
      longitude: '',
      latitude: '',
      location: '',
      address: '添加位置',
    });
  };

  const choosePosition = () => {
    console.log(currentPosition);
    // 选择位置，已经存在定位，则点击选择位置无效
    if (currentPosition.location) {
      return;
    }
    getPosition();
  };

  const getPosition = () => {
    // 调用腾讯位置服务
    const geolocation = new qq.maps.Geolocation(key, 'myapp');
    geolocation.getLocation(showPosition, errorPosition, { timeout: 6000 });
  };

  const showPosition = (value) => {
    // 调用位置成功
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

  const errorPosition = () => {
    // 调用位置失败，尝试重新调用
    getPosition();
  };

  return (
    <>
      {/* Tag组件暂时有问题，采用下面的span模拟 */}
      {/* <Tag
        type="primary"
        closeable
        size="md"
        onClose={clearPosition}
        onClick={choosePosition}
      >
        {currentPosition.address}
      </Tag> */}
      <span
        style={{
          margin: '10px',
          padding: '5px 10px',
          fontSize: '16px',
          color: '#2469f6',
          borderRadius: '5px',
          background: '#e8f0fe',
        }}
        type="primary"
        onClick={choosePosition}
      >
        {currentPosition.address}
      </span>
    </>
  );
};

PostPosition.propTypes = {
  onChange: PropTypes.func,
};

export default memo(PostPosition);
