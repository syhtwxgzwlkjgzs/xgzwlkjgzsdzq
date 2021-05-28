import React, { useCallback, useMemo } from 'react';
import PostContent from '@components/thread/post-content';
import replaceSearchResultContent from '@common/utils/replace-search-result-content';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import { noop } from '@components/thread/utils';
import styles from './index.module.scss';
import RichText from '@discuzq/design/dist/components/rich-text/index';
import { View, Text } from '@tarojs/components';


export const TopicItem = ({ data, onClick = noop }) => {
    const click = useCallback((e) => {
      if (e.target.localName === 'a') {
        return
      }
      onClick && onClick(data);
    }, [data, onClick]);

    const { threads = [] } = data

    const filterContent = useMemo(() => {
      const content = threads[0]?.content?.text || '暂无内容'
      let newContent = replaceSearchResultContent(content);
      newContent = s9e.parse(newContent);
      newContent = xss(newContent);

      return newContent;
    }, [threads]);

  // TODO 表情两行显示有问题
    return (
      <View className={styles.container} onClick={click}>
        <View className={styles.title}>{`#${data.content}#` || '暂无内容'}</View>
        <View className={styles.content}>
          <RichText onClick={click} className={styles.richText} content={filterContent} />
        </View>
        <View className={styles.tags}>
          <View className={styles.tag}>热度 {data.viewCount || 0}</View>
          <Text className={styles.dot}>·</Text>
          <View className={styles.tag}>内容 {data.threadCount || 0}</View>
        </View>
      </View>
    );
};

export default React.memo(TopicItem);
