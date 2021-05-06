import React,  { useCallback, useEffect, useState } from 'react';
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

  const [size, setSize] = useState('xl')

  const debounce = (fn, wait) => {
    let timer = null;
    return () => {
      if(timer !== null){
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    }
  }

  const updateSize = debounce(() => {
    if (window) {
      const size = calcSize(window.innerWidth);
      setSize(size);
    }
  }, 50);

  useEffect(() => {
    if (window) {
      window.addEventListener('resize', updateSize);
      return () => {
          window.removeEventListener('resize', updateSize);
      };
    }
  });

  const calcSize = (width = 1600) => {
    let size = 'xl';
    if (width < 992) {
        size = 'sm';
    }
    else if (width >= 992 && width < 1200) {
        size = 'md';
    }
    else if (width >= 1200 && width < 1400) {
        size = 'lg';
    }
    else if (width >= 1400 && width < 1880) {
        size = 'xl';
    }
    else {
        size = 'xxl';
    }
    return size;
  };

  return (
    <React.Fragment>
        {(header && header({ ...props })) || <Header onSearch={onSearch} />}

        <Row justify="center" gutter={20} className={styles.content}>
            {
              size !== 'sm' ? (
                <Col>
                  {typeof(left) === 'function' ? useCallback(left({ ...props }), []) : left}
                </Col>
              ) : null
            }

            <Col>
                {typeof(children) === 'function' ? children({ ...props }) : children}
            </Col>
            
            {
              size !== 'sm' && size !== 'md' ? (
                <Col>
                    {typeof(right) === 'function' ? right({ ...props }) : right}
                </Col>
              ) : null
            }
            
        </Row>

        {typeof(footer) === 'function' ? footer({ ...props }) : footer}
    </React.Fragment>
  );
};

export default BaseLayout;