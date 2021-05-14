/**
 * 添加红包表单
 * @prop {visible} boolean 切换红包弹框显示性
 * @prop {data} object 输入红包数据
 * @prop {cancle} object 取消事件
 * @prop {confirm} object 确认事件，输出红包对象
 */
import React, { memo, useState, useEffect } from 'react'; // 性能优化的
import { Radio, Button, Input, Toast } from '@discuzq/design'; // 原来就有的封装
import styles from './index.module.scss'; // 私有样式
import DDialog from '@components/dialog';
import PropTypes from 'prop-types'; // 类型拦截

const RedpacketSelect = ({ data, confirm, cancel, pc, visible }) => {
  const [rule, setRule] = useState(1); // 0-定额 1-随机
  const [condition, setCondition] = useState(0); // 0-回复 1-集赞
  const [price, setPrice] = useState(0); // 金额
  const [number, setNumber] = useState(1); // 红包个数
  const [likenum, setLikenum] = useState(1); // 集赞数

  const onMoneyChang = (e) => { // 处理红包金额输入
    const val = e.target.value;
    const money = val.replace(/\.\d*$/, $1 => {
      return $1.slice(0, 3)
    })
    setPrice( money )
  }
  const handleClose = () => {
    cancel();
  };
  useEffect(() => {
    if (data !== undefined && Object.keys(data).length > 0) {
      setRule(data.rule);
      setCondition(data.condition);
      setPrice(data.price);
      setNumber(data.number);
      setLikenum(data.likenum);
    }
  }, []);

  const selectRedpacket = () => {
    // 校验红包选择情况
    if (!(/^(([1-9]\d*(\.\d{1,2})?)|(0\.\d{1,2}))$/.test(+price) && +price >= 0.01 && +price <= 200)) {
      Toast.warning({
        content: '金额错误，请输入0.1-200￥',
      });
      return;
    }
    if (!(/^([1-9][0-9]*)$/.test(+number) && +number <= 100)) {
      Toast.warning({
        content: '红包数量错误，请输入整数1-100',
      });
      return;
    }
    if (!(/^([1-9][0-9]*)$/.test(+likenum) && +likenum <= 250)) {
      Toast.warning({
        content: '集赞数错误，请输入整数1-250',
      });
      return;
    }
    // 确认选择
    confirm({
      rule,
      condition,
      price,
      number,
      likenum,
    });
    handleClose();
  };

  const content = (
    <div className={styles['redpacket-box']}>
      {/* 发放规则 */}
      <div className={styles['line-box']}>
        <div> 发放规则 </div>
        <div>
          <Radio.Group
            value={rule}
            onChange={(val) => {
              setRule(val);
            }}
          >
            <Radio name={1}> 随机 </Radio> <Radio name={0}> 定额 </Radio>
          </Radio.Group>
        </div>
      </div>
      {/* 红包总金额 */}
      <div className={styles['line-box']}>
        <div> 红包总金额 </div>
        <div>
          <Input mode="number" htmlType="number" value={price} onChange={e => onMoneyChang(e)} />元
        </div>
      </div>
      {/* 红包个数 */}
      <div className={styles['line-box']}>
        <div> 红包个数 </div>
        <div>
          <Input mode="number" value={number} placeholder="个数" onChange={e => setNumber(+e.target.value)} />个
        </div>
      </div>
      {/* 获利条件 */}
      <div className={styles['line-box']}>
        <div> 获利条件 </div>
        <div>
          <Radio.Group
            value={condition}
            onChange={(item) => {
              setCondition(item);
            }}
          >
            <Radio name={0}> 回复领红包 </Radio> <Radio name={1}> 集赞领红包 </Radio>
          </Radio.Group>
        </div>
      </div>
      {/* 集赞数 */}
      {condition === 1 && (
        <div className={styles.likenum}>
          <div className={styles['likenum-input']}>
            <Input mode="number" value={likenum} onChange={e => setLikenum(+e.target.value)} />个
          </div>
        </div>
      )}
      {/* 按钮 */}
      {!pc && (
        <div className={styles.btn}>
          <Button onClick={() => {
            handleClose();
          }}>
            取消
          </Button>
          <Button type="primary" onClick={selectRedpacket}>
            确定
          </Button>
        </div>
      )}
    </div>
  );

  if (!pc) return content;
  return (
    <DDialog
      visible={visible}
      className={styles.pc}
      onClose={handleClose}
      title="添加红包"
      onCacel={handleClose}
      onConfirm={selectRedpacket}
    >
      {content}
    </DDialog>
  );
};
// 设置props默认类型
RedpacketSelect.propTypes = {
  visible: PropTypes.bool.isRequired, // 限定visible的类型为bool,且是必传的
  confirm: PropTypes.func.isRequired, // 限定confirm的类型为functon,且是必传的
};

// 设置props默认参数
RedpacketSelect.defaultProps = {
  visible: false,
  data: {},
  confirm: () => {},
  cancel: () => {},
};

export default memo(RedpacketSelect);
