/**
 * 悬赏表单 - 日历选择
 */
import React, { memo, useState, useEffect, useRef } from 'react'; //性能优化的
import { Popup, Button, Input, Toast, Icon } from '@discuzq/design'; //原来就有的封装
import TimeSelect from '@components/thread-post-pc/time-select'; //原来就有的封装
import styles from './index.module.scss'; //私有样式

import PropTypes from 'prop-types'; //类型拦截

const RewardForm = ({ visible, data, confirm, onVisibleChange }) => {
  const [isshow, setIshow] = useState(false); // 整体显示
  const [value, setValue] = useState(''); // 悬赏金额
  const [times, setTimes] = useState('悬赏时间'); // 悬赏的到期时间
  const [show, setShow] = useState(false); // 时间选择器是否显示

  const handleClose = () => {
    setIshow(false);
  };

  useEffect(() => {
    if (data != undefined && Object.keys(data).length > 0) {
      setValue(data.value);
      setTimes(data.times);
    }
  }, [])

  // 时间选择器是否显示
  useEffect(() => {
    if (visible) setIshow(visible);
  }, [visible]);

  useEffect(() => {
    onVisibleChange(isshow);
  }, [isshow]);

  // 点击确定的时候返回参数
  const redbagconfirm = () => {
    if (value <= 0 || value > 10000) {
      Toast.warning({ content: '金额数不合理,0<money<10000' });
      return;
    }
    // console.log(times);
    const gapTime = new Date(times).getTime() - new Date().getTime();

    if (times === '悬赏时间' || gapTime < 24 * 3600 * 1000) {
      Toast.warning({ content: '悬赏时间要大于当前时间24小时' });
      return;
    }
    confirm({
      value,
      times,
    });
  };

  return (
    <div className={styles['form-wrapper']}>
      <Popup position="center" visible={isshow}>
        <div className={styles['redpacket-box']}>
          <div className={styles['title-top']}><span>悬赏问答</span>
            <Icon className={styles['title-top-right']} onClick={handleClose} name="LikeOutlined" size={20} color="#8590A6"></Icon>
          </div>
          <div className={styles['line-box']}>
            <div className={styles['color-text']}> 悬赏金额 </div>
            <div>
              <Input
                mode="number"
                value={value}
                placeholder="金额"
                onChange={(e) => setValue(+e.target.value)}
                onEnter={(e) => { }}
                onFocus={(e) => { }}
                onBlur={(e) => { }}
              />元
          </div>
          </div>
          <div className={styles['line-box-bottom']}>
            <div className={styles['color-text']}> 悬赏结束时间 </div>
            <div>
              <div onClick={() => { setShow(true) }}>
                {`${times}  >`}
              </div>
            </div>
          </div>
          <div className={styles.btn}>
            <Button type="large" className={styles['btn-one']} onClick={handleClose}>取消</Button>
            <Button type="large" className={styles['btn-two']} onClick={redbagconfirm}>确定</Button>
          </div>
          <TimeSelect
            onSelects={(e) => {
              setTimes(e);
              setShow(false)
            }}
            isOpen={show}
            onisOpenChange={() => { setShow(false) }}
          />
        </div>
      </Popup>
    </div >
  );
};

RewardForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  data: PropTypes.object,
  confirm: PropTypes.func.isRequired,
  onVisibleChange: PropTypes.func.isRequired,
};

// 设置props默认类型
RewardForm.defaultProps = {
  visible: false,
  data: {},
  confirm: () => { },
  // data: { value: 3, times: '2021-04-19 17:54' }, //重现传参参照
  onVisibleChange: () => { },
};

export default memo(RewardForm);
