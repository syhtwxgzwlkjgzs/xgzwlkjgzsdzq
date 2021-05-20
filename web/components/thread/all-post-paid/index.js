/**
 * 付费表单 - 全部
 */
import React, { useState, useEffect } from 'react'; // 性能优化的
import { Button, Input, Slider, Toast } from '@discuzq/design'; // 原来就有的封装
import DDialog from '@components/dialog';
import styles from './index.module.scss'; // 私有样式
import PropTypes from 'prop-types'; // 类型拦截
import throttle from '@common/utils/thottle';

const AllPostPaid = ({ confirm, cancle, data, exhibition, pc, visible }) => {
  const [price, setPrice] = useState('');// 支付的金额数量
  const [attachmentPrice, setAttachmentPrice] = useState('');
  const [freeWords, setFreeWords] = useState(0);// 可免费查看数量的百分比数字
  useEffect(() => { // 重显的逻辑
    if (data != undefined && Object.keys(data).length > 0) {
      if (data.price === 0) {
        setPrice('');
      } else {
        setPrice(data.price);
      }
      if (data.price === 0) {
        setAttachmentPrice('');
      } else {
        setAttachmentPrice(data.attachmentPrice);
      }
      setFreeWords(data.freeWords * 100);
    }
  }, []);
  // 当点击确定是把参数返回去
  const redbagconfirm = () => {
    if (!(price + attachmentPrice)) {
      Toast.error({ content: '付费金额必须大于0元' });
      return;
    }
    if (exhibition === '帖子付费') {
      confirm({ price, freeWords: freeWords / 100 });
    } else {
      confirm({ attachmentPrice });
    }
    cancle();
  };

  const content = (
    <div className={styles['redpacket-box']}>
      {exhibition === '帖子付费' && (
        <div>
          <div className={styles['line-box']}>
            <div className={styles.payText}> 支付金额 </div>
            <div className={styles.payNumber}>
              <Input
                mode="number"
                value={price}
                placeholder="金额"
                onChange={e => setPrice(e.target.value)}
              />
              元
            </div>
          </div>
          <div className={`${pc ? styles.toviewPC : ''} ${styles.toview}`}>
            <div className={styles.toviewone}> 免费查看字数 </div>
            <div className={styles.slider}>
              <Slider
                value={freeWords}
                defaultValue={freeWords}
                formatter={value => `${value} %`}
                onChange={throttle(e => setFreeWords(e), 100)}
              />
            </div>
          </div>
        </div>
      )}
      {exhibition === '附件付费' && (
        <div className={styles['line-box']}>
          <div> 附件内容查看价格 </div>
          <div>
            <Input
              mode="number"
              value={attachmentPrice}
              placeholder="金额"
              onChange={e => setAttachmentPrice(e.target.value)}
            />
            元
          </div>
        </div>
      )}
      {!pc && (
        <div className={styles.btn}>
          <Button type="large" className={styles['btn-one']} onClick={cancle}>取消</Button>
          <Button type="primary" className={styles['btn-two']} onClick={redbagconfirm}>确定</Button>
        </div>
      )}
    </div>
  );
  if (!pc) return content;

  return (
    <DDialog
      title={exhibition}
      visible={visible}
      className={styles.pc}
      onClose={cancle}
      onCacel={cancle}
      onConfirm={redbagconfirm}
    >
      {content}
    </DDialog>
  );
};

AllPostPaid.propTypes = {
  visible: PropTypes.bool.isRequired, // 限定visible的类型为bool,且是必传的
  cancle: PropTypes.func.isRequired, // 限定cancle的类型为functon,且是必传的
  confirm: PropTypes.func.isRequired, // 限定confirm的类型为functon,且是必传的
};

// 设置props默认类型
AllPostPaid.defaultProps = {
  confirm: (e) => {
    // 点击确定事件
    console.log(e);
  },
  visible: false, // 是否显示
  data: { price: 0, freeWords: 0, attachmentPrice: 0 }, // 假设有数据返回重显
  cancle: () => console.log('cancle'), // 点击取消的事件
  exhibition: '帖子付费', // 传A就展示第一个，传其他就展示第二个
};

export default AllPostPaid;
