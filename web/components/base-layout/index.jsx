import React from 'react';
import { Flex } from '@discuzq/design';
import Header from '@components/header';

import styles from './index.module.scss';

const { Row, Col } = Flex;

/**
 * PC端集成布局组件
 * @prop {function}} header 头部视图组件
  * @prop {function}} left 内容区域左部视图组件
  * @prop {function}} children 内容区域中间视图组件
  * @prop {function}} right 内容区域右部视图组件
  * @prop {function}} footer 底部视图组件
  * example ：
  *     <BaseLayout
          left={(props) => <div>左边</div>}
          right={(props) => <div>右边</div>}
        >
          {(props) => <div>中间</div>}
        </BaseLayout>
 */

const BaseLayout = (props) => {
  const { header = null, left = null, children = null, right = null, footer = null, onSearch } = props;

  return (
    <React.Fragment>
        {(header && header({ ...props })) || <Header onSearch={onSearch} />}

        <Row justify="center" gutter={20} className={styles.content}>
            <Col>
                {typeof(left) === 'function' ? left({ ...props }) : left}
            </Col>
            <Col>
                {typeof(children) === 'function' ? children({ ...props }) : children}
            </Col>
            <Col>
                {typeof(right) === 'function' ? right({ ...props }) : right}
            </Col>
        </Row>

        {typeof(footer) === 'function' ? footer({ ...props }) : footer}
    </React.Fragment>
  );
};

export default BaseLayout;