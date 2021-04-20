/**
 * 付费表单 - 全部
 */
import React, { memo, useState, useCallback, useEffect, useRef } from 'react'; //性能优化的
import { Card, Button, Input, Slider, Popup } from '@discuzq/design'; //原来就有的封装
import styles from './index.module.scss'; //私有样式
import PropTypes from 'prop-types'; //类型拦截

const AllPostPaid = ({ visible, confirm, cancle, data }) => {
  const [value, setValue] = useState(1);//支付的金额数量
  const [num, setNum] = useState(0);//可免费查看数量的百分比数字
  useEffect(() => {//重显的逻辑
    if (data != undefined && Object.keys(data).length > 0) {
      setValue(data.value);
      setNum(data.num);
    }
  }, [])
  //由于组件暴露的是onChange，所以做了节流处理
  let timer = null;
  const debounce = (e) => {
    // console.log(1);
    clearTimeout(timer);
    timer = setTimeout(() => {
      // console.log(e)
      setNum(e)
    }, 500)
  }
//当点击确定是把参数返回去
  const redbagconfirm = () => {
    confirm({
      value,
      num,
    });
  };

  return (
    <Popup
      position="center"
      visible={visible}
    >
      <div className={styles['redpacket-box']}>
        <Card>
          <div> 支付金额 </div>
          <div>
            <Input
              mode="number"
              value={value}
              placeholder="金额"
              onChange={(e) => setValue(+e.target.value)}
              onEnter={(e) => { }}
              onFocus={(e) => { }}
              onBlur={(e) => { }}
            />
            元
          </div>
        </Card>
        <div className={styles.toview}>
          <div className={styles.toviewone}> 免费查看字数 </div>
          <div>
            <div>
              <Slider
                value={num}
                defaultValue={num}
                formatter={(value) => `${value} %`}
                onChange={(e) => debounce(e)}
              />
            </div>
          </div>
        </div>
        <div className={styles.btn}>
          <Button type="large" className={styles['btn-one']} onClick={() => cancle()}>取消</Button>
          <Button type="large" className={styles['btn-two']} onClick={redbagconfirm}>确定</Button>
        </div>
      </div>
    </Popup>
  );
};

AllPostPaid.propTypes = {
  visible: PropTypes.bool.isRequired,//限定visible的类型为bool,且是必传的
  cancle: PropTypes.func.isRequired, //限定cancle的类型为functon,且是必传的
  confirm: PropTypes.func.isRequired, //限定confirm的类型为functon,且是必传的
};

// 设置props默认类型
AllPostPaid.defaultProps = {
  confirm: (e) => {
    //点击确定事件
    console.log(e);
  },
  visible: false,//是否显示
  data: { value: 3, num: 20 },//假设有数据返回重显
  cancle: () => console.log('cancle'),//点击取消的事件
};

export default memo(AllPostPaid);
