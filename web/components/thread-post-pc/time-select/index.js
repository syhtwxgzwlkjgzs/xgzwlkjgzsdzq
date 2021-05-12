/**
 * PC-时间选择器
 * 新引入组件需要  npm i react-calendar  然后  npm install rc-time-picker
 * import TimePicker from 'rc-time-picker';
 * import 'rc-time-picker/assets/index.css';
 * import Calendar from 'react-calendar';
 * 详细参数参考  https://www.npmjs.com/package/react-calendar 日期选择器组件
 * 详细参数参考  https://www.npmjs.com/package/rc-time-picker 时间选择器组件
 */
import React, { memo, useState, useCallback, useEffect } from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import { Button, Icon } from '@discuzq/design';

import { formatDate } from '@common/utils/format-date.js';
import styles from './index.module.scss'

const TimeSelect = ({ time, onSelects, isOpen, onisOpenChange }) => {
    const [show, setShow] = useState(false); // 显示
    const [minute, setMinute] = useState(formatDate(new Date(), 'hh:mm'));// 设置的时分份 
    const [month, setMonth] = useState(formatDate(new Date(), 'yyyy-MM-dd'));// 设置的年月份 
    const handleDate = (e) => { // 日期选择的事件
        setMonth(e)
    };

    const handleTime = (e) => { // 时分选择的事件
        setMinute(e)
    };

    const handleClose = () => { // 点击取消的时候 
        setShow(false);
    };

    const clickfinish = useCallback(() => { // 点击确定的时候把值拼凑传回去
        onSelects(`${month} ${minute}`);
        handleClose()
    });

    useEffect(() => { // 监听isOpen的值
        if (isOpen) setShow(isOpen);
    }, [isOpen]);

    useEffect(() => { // 将自身状态返回回去
        onisOpenChange(show);
    }, [show]);

    // 重显示的逻辑
    useEffect(() => {
        const year = formatDate(time, 'yyyy-MM-dd');
        const hour = formatDate(time, 'hh:mm')
        setMonth(year);
        setMinute(hour);
    }, [time])

    return (
        <>
            <div className={`${show ? styles.box_sans : styles.nodisaplay}`}>
                <p className={styles['title-top']}>悬赏问答</p>
                <Icon className={styles['title-top-right']} onClick={handleClose} name="LikeOutlined" size={20} color="#8590A6"></Icon>
                <div className={styles.demonstrate}>
                    <p className={styles.demonstrateone}>{month}</p>
                    <TimePicker showSecond={false} placeholder={`${minute}`} onChange={e => { handleTime(formatDate(e._d, 'hh:mm')) }} />
                </div>
                <Calendar defaultActiveStartDate={new Date()}   onChange={(e) => { handleDate(formatDate(e, 'yyyy-MM-dd')) }} className={styles.calendar} />
                <div className={styles.btn}>
                    <Button type="large" className={styles['btn-one']} onClick={handleClose}>取消</Button>
                    <Button type="large" className={styles['btn-two']} onClick={clickfinish}>确定</Button>
                </div>
            </div>
        </>
    );
};
// 设置props默认类型
TimeSelect.propTypes = {
    isOpen: PropTypes.bool,
    onSelects: PropTypes.func,
    onisOpenChange: PropTypes.func,
};

// 设置props默认值
TimeSelect.defaultProps = {
    onisOpenChange: () => { }, // 点击取消的时候，返回一个false看上面怎么处理
    onSelects: (e) => {
        console.log(e);
    }, // 点击完成的时候，返回现在选中的时间
    isOpen: false, // 是否显示
    time: new Date(), // 目前选中时间
};

export default memo(TimeSelect);
