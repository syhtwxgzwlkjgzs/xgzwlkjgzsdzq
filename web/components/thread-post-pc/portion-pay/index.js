/**
 * 付费表单 - 全部
 */
import React, { memo, useState, useEffect } from 'react';
import { Button, Input, Slider, Popup, Icon } from '@discuzq/design';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const PortionPay = ({ visible, confirm, data, onVisibleChange }) => {
    // state
    const [show, setShow] = useState(false); // 显示
    const [price, setPrice] = useState(1); // 帖子总金额
    const [picture_price, setPicture_price] = useState(1); // 图片金额
    const [video_price, setVideo_price] = useState(1); // 视频金额
    const [voice_price, setVoice_price] = useState(1); // 语音金额
    const [accessory_price, setAccessory_price] = useState(1); // 附件金额
    const [num, setNum] = useState(0); // 可免费查看数量的百分比数字

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {// 重显的逻辑
        if (data != undefined && Object.keys(data).length > 0) {
            data.price && setPrice(data.price);
            data.picture_price && setPicture_price(data.picture_price);
            data.video_price && setVideo_price(data.video_price);
            data.voice_price && setVoice_price(data.voice_price);
            data.accessory_price && setAccessory_price(data.accessory_price);
        }
    }, [])

    useEffect(() => {
        if (visible) setShow(visible);
    }, [visible]);

    useEffect(() => {
        onVisibleChange(show);
    }, [show]);

    // 由于组件暴露的是onChange，所以做了节流处理
    let timer = null;
    const debounce = (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setNum(e)
        }, 500)
    }

    // 当点击确定是把参数返回去
    const redbagconfirm = () => {
        confirm({ num, price, picture_price, video_price, voice_price, accessory_price })
        handleClose();
    };

    return (
        <div className={styles['paid-wrapper']}>
            <Popup
                position="center"
                visible={show}
            >
                <div className={styles['redpacket-box']}>
                    <div className={styles['title-top']}><span>部分付费</span>
                        <Icon className={styles['title-top-right']} onClick={handleClose} name="LikeOutlined" size={20} color="#8490a8"></Icon>
                    </div>
                    <div>
                        {/* 全贴价格 */}
                        <div className={styles['line-box']}>
                            <div className={styles['text-style']}> 文字 </div>
                            <div>
                                <Input
                                    mode="number"
                                    value={price}
                                    placeholder="金额"
                                    onChange={(e) => setPrice(+e.target.value)}
                                    onEnter={(e) => { }}
                                    onFocus={(e) => { }}
                                    onBlur={(e) => { }}
                                />元
                            </div>
                        </div>
                        {/* 免费查看百分比 */}
                        <div className={styles.toview}>
                            <div className={styles.toviewone}> 免费查看字数 </div>
                            <div>
                                <div>
                                    <Slider
                                        value={num}
                                        defaultValue={num}
                                        formatter={(val) => `${val} %`}
                                        onChange={(e) => debounce(e)}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* 图片价格 */}
                        <div className={styles['line-box-lit']}>
                            <div className={styles['text-style']}> 图片 </div>
                            <div>
                                <Input
                                    mode="number"
                                    value={picture_price}
                                    placeholder="金额"
                                    onChange={(e) => setPicture_price(+e.target.value)}
                                    onEnter={(e) => { }}
                                    onFocus={(e) => { }}
                                    onBlur={(e) => { }}
                                />元
                            </div>
                        </div>
                        {/* 视频价格 */}
                        <div className={styles['line-box-lit']}>
                            <div className={styles['text-style']}> 视频 </div>
                            <div>
                                <Input
                                    mode="number"
                                    value={video_price}
                                    placeholder="金额"
                                    onChange={(e) => setVideo_price(+e.target.value)}
                                    onEnter={(e) => { }}
                                    onFocus={(e) => { }}
                                    onBlur={(e) => { }}
                                />元
                            </div>
                        </div>
                        {/* 语音价格 */}
                        <div className={styles['line-box-lit']}>
                            <div className={styles['text-style']}> 语音 </div>
                            <div>
                                <Input
                                    mode="number"
                                    value={voice_price}
                                    placeholder="金额"
                                    onChange={(e) => setVoice_price(+e.target.value)}
                                    onEnter={(e) => { }}
                                    onFocus={(e) => { }}
                                    onBlur={(e) => { }}
                                />元
                            </div>
                        </div>
                        {/* 附件价格 */}
                        <div className={styles['line-box-lit-unbutton']}>
                            <div className={styles['text-style']}> 附件 </div>
                            <div>
                                <Input
                                    mode="number"
                                    value={accessory_price}
                                    placeholder="金额"
                                    onChange={(e) => setAccessory_price(+e.target.value)}
                                    onEnter={(e) => { }}
                                    onFocus={(e) => { }}
                                    onBlur={(e) => { }}
                                />元
                            </div>
                        </div>

                    </div>
                    <div className={styles.btn}>
                        <Button type="large" className={styles['btn-one']} onClick={() => handleClose()}>取消</Button>
                        <Button type="large" className={styles['btn-two']} onClick={redbagconfirm}>确定</Button>
                    </div>
                </div>
            </Popup>
        </div>
    );
};

PortionPay.propTypes = {
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    onVisibleChange: PropTypes.func.isRequired,
};

// 设置props默认类型
PortionPay.defaultProps = {
    visible: false, // 是否显示
    data: {}, // 假设有数据返回重显
    confirm: (e) => { console.log(e) },
    onVisibleChange: () => { },
};

export default memo(PortionPay);
