/**
 * 发帖页标题
 * @prop {string} title 输入标题值
 * @prop {string} placeholder 默认显示的字符串
 * @prop {boolean} isDisplay 是否显示标题
 * @prop {function} onChange change事件，输出当前标题值
 */
import React, { memo, useState, useEffect } from 'react';
import { Input } from '@discuzq/design';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const Title = ({ title, placeholder, isDisplay, onChange, onFocus, onBlur }) => {
    // state 标题值
    const [titleVal, setTitleVal] = useState('');

    // hooks
    useEffect(() => {
        // 设置标题回显
        title && setTitleVal(title);
    }, []);

    useEffect(() => {
        // 监听titleVal
        onChange(titleVal);
    }, [titleVal]);

    return (
        <div className={`${isDisplay ? '' : styles['is-display']}`}>
            <Input
                className={`${styles.title} `}
                value={titleVal}
                placeholder={placeholder}
                onChange={e => setTitleVal(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </div>
    );
};

Title.propTypes = {
    title: PropTypes.string,
    isDisplay: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
};

// 设置props默认类型
Title.defaultProps = {
    title: '',
    isDisplay: false,
    placeholder: '标题  (可选)',
    onChange: () => { },
    onFocus: () => { },
    onBlur: () => { },
};

export default memo(Title);
