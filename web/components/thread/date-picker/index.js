/**
 * 时间选择器
 * 新引入组件需要  npm i react-mobile-datepicker  然后  import DatePicker from 'react-mobile-datepicker';
 * 详细参数参考  https://www.npmjs.com/package/react-mobile-datepicker#dateconfig
 */
import React, { memo, useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-mobile-datepicker';
import PropTypes from 'prop-types';
import styles from './index.module.scss';
import { formatDate } from '@common/utils/format-date.js'

const DatePickers = ({ onCancels, time, onSelects, isOpen }) => {
  // dateConfig 可展示的数据年、月、日之类的
  const [dateConfig, setdateConfig] = useState({
    'year': {
      format: 'YYYY',
      caption: 'Year',
      step: 1,
    },
    'month': {
      format: 'MM',
      caption: 'Mon',
      step: 1,
    },
    'date': {
      format: 'DD',
      caption: 'Day',
      step: 1,
    },
    'hour': {
      format: 'hh',
      caption: 'Hour',
      step: 1,
    },
    'minute': {
      format: 'mm',
      caption: 'Min',
      step: 1,
    },
  })
  const handleSelect = useCallback((e) => {//点击确定时候的参数返回和校验
    const timeArr = formatDate(e, 'yyyy-MM-dd-hh-mm').split('-');
    const _year = +timeArr[0];
    const _month = +timeArr[1] - 1;
    const _day = +timeArr[2];
    const _hour = +timeArr[3];
    const _minute = +timeArr[4];
    const _second = 0;
    const setDay = new Date(_year, _month, _day, _hour, _minute, _second);//获取当前事件的毫秒数
    const timeDifference = setDay.getTime() - Date.now();//设置的时间减去当前的时间差
    const minSetTime = 60 * 60 * 24 * 1000;//24小时的毫秒数
    if (timeDifference < minSetTime) {//判断差值
      console.log('时间不能小于24小时')
      return
    } else {//没有问题就可以返回参数
      onSelects(formatDate(e, 'yyyy-MM-dd hh:mm'))
    }
  })
  const handleCancel = useCallback((e) => {
    onCancels(e)
  })
  return (
    <DatePicker
      dateConfig={dateConfig}
      value={time}
      isOpen={isOpen}
      onSelect={(e) => { handleSelect(e) }}
      onCancel={(e) => { handleCancel(e) }}
    />
  );
};
// 设置props默认类型
DatePickers.propTypes = {
  isOpen: PropTypes.bool,
  onCancels: PropTypes.func,
  onSelects: PropTypes.func,
};

// 设置props默认值
DatePickers.defaultProps = {
  onCancels: (e) => { console.log('点击了取消') },//点击取消的时候回调
  onSelects: (e) => { console.log(e) },//点击完成的时候，返回现在选中的时间
  isOpen: false,//是否显示
  time: new Date(),//目前选中时间
};

export default memo(DatePickers);
