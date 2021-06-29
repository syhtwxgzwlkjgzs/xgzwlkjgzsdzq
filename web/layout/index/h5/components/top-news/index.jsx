import React from 'react';
import { withRouter } from 'next/router';
import { RichText } from '@discuzq/design';
import styles from './index.module.scss';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
/**
 * 置顶消息
 * @prop {{prefix:string, title:string}[]} data
 */
const TopNews = ({ data = [], router, platform = 'h5'}) => {
  const onClick = ({ threadId } = {}, e) => {
    if (e?.target?.localName === 'a') {
      return
    }
    router.push(`/thread/${threadId}`);
  };

  // 过滤内容
  const filterContent = (content) => {
    let newContent = content ? s9e.parse(content) : '暂无内容';
    newContent = xss(newContent);

    return newContent;
  };

  const handlerTitle = (title = '') => {
    if (platform = 'h5' && title.length > 20) {
      return `${title.slice(0, 20)}...`
    }
    return title
  }

  return (
    <div className={styles.list}>
      {data?.map((item, index) => (
        <div
          key={index}
          className={`${styles.item} ${platform === 'pc' ? styles.itemPC : styles.itemH5}`}
          onClick={() => onClick(item)}
        >
          <div className={styles.prefix}>{item.prefix || '置顶'}</div>
          {false && <div className={styles.title}>{handlerTitle(item.title)}</div>}
          <div className={styles.title}>
              <RichText onClick={(e) => onClick(item, e)} className={styles.richText} content={filterContent(item.title)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default withRouter(TopNews);
