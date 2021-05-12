/**
 * 切换付费表单
 *手风琴组件待优化
 */
import React, { memo } from 'react'; 
import { Dropdown, Icon } from '@discuzq/design'; 
import styles from './index.module.scss'; 

import PropTypes from 'prop-types'; 


const PayType = ({ confirm }) => {
    const handleValue = (e) => {
        confirm(e);
    };
    const menu = () => <Dropdown.Menu>
        <Dropdown.Item id="1">帖子付费</Dropdown.Item>
        <Dropdown.Item id="2" >附件付费</Dropdown.Item>
    </Dropdown.Menu>;

    return (
        <div className={styles['pay-type-wrapper']}>
            <Dropdown menu={menu()} style={{ display: 'inline-block', marginLeft: '40px' }} onChange={key => handleValue(key)}>
                <Icon className={styles['title-top-right']} name="LikeOutlined" size={20} color="#8590A6"></Icon>
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
    confirm: () => { },
};

export default memo(PayType);
