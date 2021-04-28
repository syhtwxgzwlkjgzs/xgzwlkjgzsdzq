/**
 * 付费表单 - 帖子付费
 */
import React, { memo, useState, useEffect } from 'react';
import { Button, Input, Slider, Popup, Icon } from '@discuzq/design';
import styles from './index.module.scss';

import PropTypes from 'prop-types';

const PayPopup = ({ visible, confirm, data, onVisibleChange, exhibition }) => {
    // state
    const [show, setShow] = useState(false); // 显示
    const [price, setPrice] = useState(1); // 帖子总金额
    const [value, setValue] = useState(1); // 帖子总金额
    const [num, setNum] = useState(0); // 可免费查看数量的百分比数字

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {// 重显的逻辑
        if (data != undefined && Object.keys(data).length > 0) {
            data.price && setPrice(data.price);
            data.num && setNum(data.num);
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
        exhibition === 1 ? confirm({ price, num, }) : confirm({ value, });
        handleClose();
    };

    return (
    <Popup position="center"  visible={show}>
     <div className={styles['paid-wrapper']}>
         <div className={styles['redpacket-box']}>
        {exhibition === 1 ? <>
            <div className={styles['title-top']}><span>帖子付费</span>
                <Icon className={styles['title-top-right']} onClick={handleClose} name="LikeOutlined" size={20} color="#8490a8"></Icon>
            </div>
            <div>
                {/* 全贴价格 */}
                <div className={styles['line-box']}>
                    <div className={styles['text-style']}> 支付金额 </div>
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
            </div>
        </> 
        : 
        <>
        <div className={styles['title-top']}><span>附件付费</span>
                <Icon className={styles['title-top-right']} onClick={handleClose} name="LikeOutlined" size={20} color="#8490a8"></Icon>
            </div>
        <div className={styles['line-box']}>
            <div> 支付金额 </div>
            <div>
                <Input
                    mode="number"
                    value={value}
                    placeholder="金额"
                    onChange={e => setValue(+e.target.value)}
                />元
                </div>
              </div>
         </>     }
            <div className={styles.btn}>
            <Button type="large" className={styles['btn-one']} onClick={() => handleClose()}>取消</Button>
            <Button type="large" className={styles['btn-two']} onClick={redbagconfirm}>确定</Button>
            </div>
        </div>
    </div>
        </Popup>
    );
};

PayPopup.propTypes = {
    visible: PropTypes.bool.isRequired,
    data: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    onVisibleChange: PropTypes.func.isRequired,
};

// 设置props默认类型
PayPopup.defaultProps = {
    visible: false, // 是否显示
    data: {}, // 假设有数据返回重显
    confirm: (e) => { console.log(e)},
    onVisibleChange: () => { },
    // exhibition:1,
};

export default memo(PayPopup);
