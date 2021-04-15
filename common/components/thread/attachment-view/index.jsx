import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';

/**
 * 附件
 * @prop {Array} attachments 附件数组
 * @prop {Boolean} isHidden 是否隐藏删除按钮
 */

const Index = ({ attachments = [], isHidden = true }) => (
    <div>
        {
          attachments.map(item => (
            <div className={styles.container}>
              <div>
                <Icon name="PaperClipOutlined" />
                <span className={styles.content}>{item.name}</span>
                <span className={styles.size}>{item.size}</span>
              </div>

              {!isHidden && <Icon name="CloseOutlined" />}
            </div>
          ))
        }
    </div>
);

export default React.memo(Index);
