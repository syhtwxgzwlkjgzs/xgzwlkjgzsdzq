import React from 'react';
import styles from './index.module.scss';
import { Tag } from '@discuzq/design';
import { THREAD_TYPE } from '@common/constants/thread-post';
import { defaultOperation, paidOption } from '@common/constants/const';
import { formatDate } from '@common/utils/format-date';

export default function MoneyDisplay(props) {
  const {
    postData = {},
  } = props;
  const clsName = props.pc ? styles.pc : styles.h5;
  return (
    <div className={`${styles['money-box']} ${clsName}`} onClick={e => e.stopPropagation()}>
      {/* 付费 */}
      {!!(postData.price || postData.attachmentPrice) && (
        <Tag
          closeable
          onClose={() => props.setPostData({ price: 0, attachmentPrice: 0 })}
          onClick={() => {
            const curPaySelect = postData.price ? paidOption[0].name : paidOption[1].name;
            props.handleSetState({ curPaySelect });
          }}
        >付费总额{postData.price + postData.attachmentPrice}元</Tag>
      )}
      {/* 悬赏问答内容标识 */}
      {(postData.rewardQa.value && postData.rewardQa.times) && (
        <Tag closeable
          onClose={() => props.setPostData({ rewardQa: {} })}
          onClick={() => {
            props.handleSetState({ currentAttachOperation: THREAD_TYPE.reward });
          }}
        >
          {`悬赏金额${postData.rewardQa.value}元\\结束时间${formatDate(new Date(postData.rewardQa.times).getTime(), 'yyyy/MM/dd hh:mm')}`}
        </Tag>
      )}
      {/* 红包 */}
      {postData.redpacket.price && (
        <Tag closeable
          onClose={() => props.setPostData({ redpacket: {} })}
          onClick={() => props.handleSetState({ currentDefaultOperation: defaultOperation.redpacket })}
        >
          {postData.redpacket.rule === 1 ? '随机红包' : '定额红包'}
          \ 总金额{postData.redpacket.price}元\{postData.redpacket.number}个
          {postData.redpacket.condition === 1 && `\\集赞个数${postData.redpacket.likenum}`}
        </Tag>
      )}
      {/* 字数 */}
      {/* <div className={styles['editor-count']}>还能输入{MAX_COUNT - this.props.count}个字</div> */}
    </div>
  );
}
