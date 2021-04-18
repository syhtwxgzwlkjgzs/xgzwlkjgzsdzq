/**
 * 添加红包表单
 */
import React, { memo, useState, useEffect } from 'react'; //性能优化的
import { Card, Radio, Button, Input } from '@discuzq/design'; //原来就有的封装
import styles from './index.module.scss'; //私有样式
import PropTypes from 'prop-types'; //类型拦截

const AddRedEnvelope = ({ confirm }) => {
  const [items, setItems] = useState('随机');
  const [mold, setmold] = useState('集赞领红包');
  const [value, setValue] = useState('');
  const [num, setNum] = useState('');
  const [digit, setDigit] = useState('');

  const redbagconfirm = () => {
    confirm({ items, mold, value, num, digit });
  };
  return (
    <div>
      <Card>
        <div> 发放规则 </div>
        <div>
          <Radio.Group
            value={items}
            onChange={(item) => {
              setItems(item);
            }}
          >
            <Radio name="随机">随机</Radio>
            <Radio name="定额">定额</Radio>
          </Radio.Group>
        </div>
      </Card>
      <Card>
        <div>红包总金额</div>
        <div>
          
            <Input
              mode="number"
              value={value}
              placeholder="80"
              onChange={(e) => setValue(e.target.value)}
              onEnter={(e) => console.log('回车事件', e)}
              onFocus={(e) => console.log('聚焦事件', e)}
              onBlur={(e) => console.log('失去焦点事件', e)}
            />
            元
          
        </div>
      </Card>
      <Card>
        <div>红包个数</div>
        <div>
            <Input
              mode="number"
              value={num}
              placeholder="个数"
              onChange={(e) => setNum(e.target.value)}
              onEnter={(e) => console.log('回车事件', e)}
              onFocus={(e) => console.log('聚焦事件', e)}
              onBlur={(e) => console.log('失去焦点事件', e)}
            />
            个
        </div>
      </Card>
      <Card>
        <div> 获利条件 </div>
        <div>
          <Radio.Group
            value={mold}
            onChange={(item) => {
              setmold(item);
            }}
          >
            <Radio name="回复领红包">回复领红包</Radio>
            <Radio name="集赞领红包">集赞领红包</Radio>
          </Radio.Group>
        </div>
      </Card>
      <div className="SetNumberOfPraise">
          <Input
            mode="number"
            value={digit}
            placeholder="个数"
            onChange={(e) => setDigit(e.target.value)}
            onEnter={(e) => console.log('回车事件', e)}
            onFocus={(e) => console.log('聚焦事件', e)}
            onBlur={(e) => console.log('失去焦点事件', e)}
          />
          个
      </div>
      <div className="bigbox_bottom">
        <Button
          type="large"
          className="buttomone"
          onClick={() => {
            window.history.go(-1);
          }}
        >
          取消
        </Button>
        <Button type="large" className="buttomtwo" onClick={redbagconfirm}>
          确定
        </Button>
      </div>
    </div>
  );
};

AddRedEnvelope.propTypes = {
  confirm: PropTypes.func.isRequired, //限定confirm的类型为functon,且是必传的
};

// 设置props默认类型
AddRedEnvelope.defaultProps = {
  confirm: (e) => {
    //点击确定事件
    console.log(e);
  },
};

export default memo(AddRedEnvelope);
