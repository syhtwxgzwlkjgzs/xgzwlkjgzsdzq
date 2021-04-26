/**
 * 添加红包表单
 * @prop {boolean} visible 切换红包弹框显示性
 * @prop {object} data 输入红包数据
 * @prop {function} cancle 取消事件
 * @prop {function} confirm 确认事件，输出红包对象
 */
import React, { memo, useState } from 'react'; // 性能优化的
import { Dropdown, Icon } from '@discuzq/design'; // 原来就有的封装
import styles from './index.module.scss'; // 私有样式

import PropTypes from 'prop-types'; // 类型拦截


const PayType = ({ confirm }) => {
    const handleValue = (e) => {
        confirm(e);
    };
    const menu = () => <Dropdown.Menu>
        <Dropdown.Item id="1">全部付费</Dropdown.Item>
        <Dropdown.Item id="2" >部分付费</Dropdown.Item>
    </Dropdown.Menu>;

    return (
        <div className={styles['pay-type-wrapper']}>
            <Dropdown menu={menu()} style={{ display: 'inline-block', marginLeft: '40px' }} onChange={key => handleValue(key)}>
                <Icon className={styles['title-top-right']} name="LikeOutlined" size={20} color="#8490a8"></Icon>
            </Dropdown>
        </div>
    );
};

// 设置props默认类型
PayType.propTypes = {
    confirm: PropTypes.func.isRequired,
};

// 设置props默认参数
PayType.defaultProps = {
    confirm: (e) => { console.log(e) },

};

export default memo(PayType);
