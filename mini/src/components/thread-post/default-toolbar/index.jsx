
/**
 * 发帖页底部表情、话题、发布等工具栏
 */
import React, { useState, useEffect, useMemo, memo } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import { defaultIcon } from '@common/constants/const';
import { THREAD_TYPE } from '@common/constants/thread-post';

const Index = inject('user', 'threadPost')(observer(({
  user,
  threadPost,
  onPluginClick,
  onSubmit,
  operationType,
}) => {
  const [currentTool, setCurrentTool] = useState("");

  useEffect(() => {
    if (!operationType) setCurrentTool("");
  }, [operationType]);

  const getIconCls = (item) => {
    const cls = styles['plug-icon'];
    const activeCls = `${styles['plug-icon']} ${styles.active}`;
    if (item.type === THREAD_TYPE.at) return cls;
    if (item.type === THREAD_TYPE.topic) return cls;
    const { postData } = threadPost;
    if (item.type === THREAD_TYPE.redPacket && postData?.redpacket?.price) return activeCls;
    if (item.type === THREAD_TYPE.paid && (postData?.price || postData?.attachmentPrice)) return activeCls;
    if (item.id === currentTool) return activeCls;
    if (item.type === THREAD_TYPE.file && Object.keys(postData?.files || []).length > 0) return activeCls;
    return cls;
  };

  // 工具栏icon元素
  const { threadExtendPermissions: tep } = user;
  const plug = useMemo(() => {
    return defaultIcon.map((item, index) => {
      // 是否有权限
      const canInsert = tep[item.id];
      return canInsert ? (
        <Icon
          key={index}
          className={getIconCls(item)}
          onClick={() => {
            if (item.id === currentTool) {
              setCurrentTool("");
              onPluginClick({ type: "" });
            } else {
              setCurrentTool(item.id);
              onPluginClick(item);
            }
          }}
          name={item.name}
          size='20'
        />
      ) : null;
    });
  }, [tep, currentTool, operationType, threadPost.postData])

  return (
    <View className={styles['container']}>
      <View>{plug}</View>
      <Text onClick={() => {
        onSubmit();
        setCurrentTool("");
      }}>发布</Text>
    </View>
  );
}));

export default memo(Index);
