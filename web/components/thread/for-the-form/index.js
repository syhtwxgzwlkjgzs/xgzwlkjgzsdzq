/**
 * 付费表单 - 全部
 */
import React, { memo, useState, useEffect, useRef } from 'react'; //性能优化的
import { Card, Button, Input } from '@discuzq/design'; //原来就有的封装
import DatePickers from '../date-picker'; //原来就有的封装
import styles from './index.module.scss'; //私有样式
import PropTypes from 'prop-types'; //类型拦截

const ForTheForm = ({ confirm, cancel, data }) => {
  const [value, setValue] = useState('');//悬赏金额
  const [times, setTimes] = useState('悬赏时间');//悬赏的到期时间
  const [show, setShow] = useState(false);//时间选择器是否显示
  //时间选择器是否显示
  useEffect(() => {
    if (data != undefined && Object.keys(data).length > 0) {
      console.log(111)
      setValue(data.value);
      setTimes(data.times);
    }
  }, [])
  //点击确定的时候返回参数
  const redbagconfirm = () => {
    confirm({
      value,
      times,
    });
  };
  return (
    <div>
      <Card>
        <div> 悬赏金额 </div>
        <div>
          <Input
            mode="number"
            value={value}
            placeholder="金额"
            onChange={(e) => setValue(e.target.value)}
            onEnter={(e) => { }}
            onFocus={(e) => { }}
            onBlur={(e) => { }}
          />
          元
        </div>
      </Card>
      <Card>
        <div> 悬赏结束时间 </div>
        <div>
          <div
            onClick={() => {
              setShow(true);
            }}
          >
            {`${times}  >`}
          </div>
        </div>
      </Card>
      <DatePickers
        onSelects={(e) => {
          setTimes(e);
          setShow(false)
        }}
        isOpen={show}
        onCancels={() => { setShow(false) }}
      />
      <div className={styles.btn}>
        <Button type="large" className={styles['btn-one']} onClick={() => cancel()}>取消</Button>
        <Button type="large" className={styles['btn-two']} onClick={redbagconfirm}>确定</Button>
      </div>
    </div>

  );
};

ForTheForm.propTypes = {
  cancel: PropTypes.func.isRequired, //限定cancel的类型为functon,且是必传的
  confirm: PropTypes.func.isRequired, //限定confirm的类型为functon,且是必传的
};

// 设置props默认类型
ForTheForm.defaultProps = {
  confirm: (e) => {
    //点击确定事件
    console.log(e);
  },
  // data: { value: 3, times: '2021-04-1917:54' }, //重现传参参照
  cancel: () => console.log('cancel'),//点击取消调用的事件
};

export default memo(ForTheForm);
