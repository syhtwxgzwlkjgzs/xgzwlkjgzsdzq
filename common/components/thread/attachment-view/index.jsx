import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { extensionList } from './utils';

/**
 * 附件
 * @prop {Array} attachments 附件数组
 * @prop {Boolean} isHidden 是否隐藏删除按钮
 */

const Index = ({ attachments = [], isHidden = true }) => (
    <div>
        {
          attachments.map((item, index) => {
            // 获取文件类型
            const extension = item.name.split('.')[item.name.split('.').length - 1];
            const type = extensionList.indexOf(extension.toUpperCase()) > 0
              ? extension.toUpperCase()
              : 'UNKNOWN';
            return (
              <div className={styles.container} key={index}>
                <div>
                  {/* TODO 此处逻辑接口确定之后再改 */}
                  <Icon name={type && 'PaperClipOutlined'} />
                  <span className={styles.content}>{item.name}</span>
                  <span className={styles.size}>{item.size}</span>
                </div>

                {!isHidden && <Icon name="CloseOutlined" />}
              </div>
            );
          })
        }
    </div>
);

export default React.memo(Index);
