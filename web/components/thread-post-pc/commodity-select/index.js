import React, { memo, useState, useEffect } from 'react';
import { Input, Button, Popup, Icon,Toast } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const CommoditySelect = (props) => {
    const { visible } = props
    // state data
    const [show, setShow] = useState(false); // 显示
    const [link, setLink] = useState('');
    const goodImages = [
        {
            src: '/jingdong.svg',
            name: '京东',
            width: 20,
            height: 20,
        },
        {
            src: '/taobao.svg',
            name: '淘宝',
            width: 20,
            height: 20,
        },
        {
            src: '/tmall.svg',
            name: '天猫',
            width: 20,
            height: 20,
        },
        {
            src: '/pinduoduo.svg',
            name: '拼多多',
            width: 20,
            height: 20,
        },
        {
            src: '/youzan.svg',
            name: '有赞',
            width: 20,
            height: 20,
        },
    ];
    // 关闭显示
    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        if (visible) setShow(visible);
    }, [visible]);

    // handle
    const parseLink = async () => {
        // 1 没有链接给予提示
        if (link === '') {
            Toast.warning({
                content: '商品链接不能为空',
              })
            return;
        }

        // 2 有链接，发起请求解析商品
        const { onAnalyseSuccess, threadPost } = props;
        const res = await threadPost.fetchProductAnalysis({ address: link });
        const { code, data = {} } = res;
        if (code === 0) {
            onAnalyseSuccess(data);
        }
    };

    return (
        <Popup
            position="center"
            visible={show}
        >
            <div className={styles['parse-goods-box']}>
            <div className={styles['title-top']}><span>添加商品</span>
            <Icon className={styles['title-top-right']} onClick={handleClose} name="LikeOutlined" size={20} color="#8590A6"></Icon>
            </div>
                <div className={styles['parse-goods-title']}>现支持以下商品链接</div>
                <div className={styles['parse-goods-image']}>
                    {goodImages.map(item => (
                        <div className={styles['image-item']} key={item.name}>
                            <img src={item.src} alt={item.name} width={item.width} height={item.height} />
                            <span className={styles['image-text']}>{item.name}</span>
                        </div>
                    ))}
                </div>
                <Input.Textarea
                    value={link}
                    placeholder="请粘贴\输入商品的分享链接"
                    maxLength={49999}
                    rows={8}
                    onChange={e => setLink(e.target.value)}
                />
                <div className={styles.btn}>
                    <Button type="large" className={styles['btn-one']} onClick={() => handleClose()}>取消</Button>
                    <Button type="large" className={styles['btn-two']} onClick={parseLink}>确定</Button>
                </div>
            </div>
        </Popup>
    );
};

CommoditySelect.propTypes = {
    visible: PropTypes.bool.isRequired,
};

// 设置props默认类型
CommoditySelect.defaultProps = {
    visible: false, // 是否显示
};

export default inject('threadPost')(observer(CommoditySelect));
