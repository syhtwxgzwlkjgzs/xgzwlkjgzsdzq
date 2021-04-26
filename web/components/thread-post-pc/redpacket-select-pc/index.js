/**
 * 添加红包表单
 * @prop {boolean} visible 切换红包弹框显示性
 * @prop {object} data 输入红包数据
 * @prop {function} cancle 取消事件
 * @prop {function} confirm 确认事件，输出红包对象
 */
 import React, { memo, useState, useEffect } from 'react'; // 性能优化的
 import { Popup, Radio, Button, Input, Toast,Icon } from '@discuzq/design'; // 原来就有的封装
 import styles from './index.module.scss'; // 私有样式
 
 import PropTypes from 'prop-types'; // 类型拦截
 
 const RedpacketSelect = ({ visible, data, onVisibleChange, confirm }) => {
   const [show, setShow] = useState(false); // 显示
   const [rule, setRule] = useState(1); // 0-定额 1-随机
   const [mold, setmold] = useState(0); // 0-回复 1-集赞
   const [money, setMoney] = useState(0); // 金额
   const [num, setNum] = useState(1); // 红包个数
   const [likenum, setLikenum] = useState(1); // 集赞数
 
   const handleClose = () => {
     setShow(false);
   };
 
   const onMoneyChang = (e) => { // 对红包金额做仅可输入两位小数的操作
    const val = e.target.value;
    const _money = val.replace(/\.\d*$/, $1 => {
      return $1.slice(0, 3)
    });
    setMoney( _money );
  }

   useEffect(() => {
     if (data !== undefined && Object.keys(data).length > 0) {
       setRule(data.rule);
       setmold(data.mold);
       setMoney(data.money);
       setNum(data.num);
       setLikenum(data.likenum);
     }
   }, []);
 
   useEffect(() => {
     if (visible) setShow(visible);
   }, [visible]);
 
   useEffect(() => {
     onVisibleChange(show);
   }, [show]);
 
   const selectRedpacket = () => {
     // 校验红包选择情况
     if (!(/^(([1-9]\d*(\.\d{1,2})?)|(0\.\d{1,2}))$/.test(+money) && +money >= 0.01 && +money <= 200)) {
       Toast.warning({
         content: '金额错误0-200￥',
       })
       return;
     }
     if (!(/^([1-9][0-9]*)$/.test(+num) && +num <= 100)) {
       Toast.warning({
         content: '红包数量错误1-100',
       })
       // console.log('红包数量错误1-100');
       return;
     }
     if (!(/^([1-9][0-9]*)$/.test(+likenum) && +likenum <= 250)) {
       Toast.warning({
         content: '集赞数错误1-250',
       })
       return;
     }
     // 确认选择
     confirm({
       rule,
       mold,
       money,
       num,
       likenum,
     });
     handleClose();
   };
 
   return (
     <div className={styles['redpacket-wrapper']}>
       <Popup position="center" visible={show}>
         <div className={styles['redpacket-box']}>
         <div className={styles['title-top']}><span>添加红包</span>
            <Icon className={styles['title-top-right']} onClick={handleClose} name="LikeOutlined" size={20} color="#8490a8"></Icon>
          </div>
           {/* 发放规则 */}
           <div className={styles['line-box']}>
             <div className={styles['text-style']}> 发放规则 </div>
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
             <div className={styles['text-style']}> 红包总金额 </div>
             <div>
               <Input mode="number" value={money} onChange={onMoneyChang} />元
               </div>
           </div>
           {/* 红包个数 */}
           <div className={styles['line-box']}>
             <div className={styles['text-style']}> 红包个数 </div>
             <div>
               <Input mode="number" value={num} placeholder="个数" onChange={(e) => setNum(+e.target.value)} />个
               </div>
           </div>
           {/* 获利条件 */}
           <div className={styles['line-box-unbottom']}>
             <div className={styles['text-style']}> 获利条件 </div>
             <div>
               <Radio.Group
                 value={mold}
                 onChange={(item) => {
                   setmold(item);
                 }}
               >
                 <Radio name={0}> 回复领红包 </Radio> <Radio name={1}> 集赞领红包 </Radio>
               </Radio.Group>
             </div>
           </div>
           {/* 集赞数 */}
           {mold === 1 && (
            <div className={styles.likenum}>
            <div className={styles['likenum-input']}>
              <Input mode="number" value={likenum} onChange={e => setLikenum(+e.target.value)} />个
          </div>
          </div>
           )}
           {/* 按钮 */}
           <div className={styles.btn}>
            <Button type="large" className={styles['btn-one']} onClick={handleClose}>取消</Button>
            <Button type="large" className={styles['btn-two']} onClick={selectRedpacket}>确定</Button>
          </div>
         </div>
       </Popup>
     </div>
   );
 };
 
 // 设置props默认类型
 RedpacketSelect.propTypes = {
   visible: PropTypes.bool.isRequired,
   data: PropTypes.object,
   confirm: PropTypes.func.isRequired,
   onVisibleChange: PropTypes.bool.isRequired,
 };
 
 // 设置props默认参数
 RedpacketSelect.defaultProps = {
   visible: false,
   data: {},
   confirm: () => { },
   onVisibleChange: () => { },
 };
 
 export default memo(RedpacketSelect);
 