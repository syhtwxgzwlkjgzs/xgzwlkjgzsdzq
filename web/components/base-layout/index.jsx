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
  const { header = null, left = null, children = null, right = null, footer = null } = props;

  return (
    <React.Fragment>
        {(header && header({ ...props })) || <Header />}

        <Row justify="center" gutter={20} className={styles.content}>
            <Col>
                {left && left({ ...props })}
            </Col>
            <Col>
                {children && children({ ...props })}
            </Col>
            <Col>
                {right && right({ ...props })}
            </Col>
        </Row>

        {footer && footer({ ...props })}
    </React.Fragment>
  );
};

export default BaseLayout;