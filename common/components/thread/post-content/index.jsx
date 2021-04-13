import React from 'react';

import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';

import styles from './index.module.scss';

/**
 * 帖子内容展示
 * @prop {string} content 内容
 */

const Index = ({ content, ...props }) => {
  const filterContent = React.useMemo(() => (content ? xss(s9e.parse(content)) : ''));

  return <div className={styles.container} dangerouslySetInnerHTML={{ __html: filterContent }} {...props} />;
};

export default React.memo(Index);
