import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

import Notice from '@components/message/notice';

const Index = ({ message }) => {
  const { threadMsgList, readThreadMsgList, deleteMsg } = message;
  const { list, currentPage, totalPage } = threadMsgList;

  useEffect(() => {
    fetchMessageData(1)
  }, []);

  // 请求数据
  const fetchMessageData = async (initPage = 0) => {
    return await readThreadMsgList(initPage || currentPage + 1);
  }

  return (
    <View className={styles.container}>
      <Notice
        noMore={currentPage >= totalPage}
        list={list}
        type='thread'
        onPullDown={() => fetchMessageData(1)}
        onScrollBottom={() => fetchMessageData()}
        onBtnClick={(item) => deleteMsg(item.id, 'threadMsgList')}
      />
    </View>
  )
}

export default inject('message')(observer(Index));
