import React, { useMemo } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';

export default inject('site')(observer((props) => {
  const { children, site } = props;

  const Content = useMemo(() => {
    if (!site.webConfig) {
      return (
        <View className={styles.loadingBox}>
          <Icon className={styles.loading} name="LoadingOutlined" size="large" />
        </View>
      );
    }
    return children;
  }, [site, children])

  return (
    <View className={`${styles['dzq-page']} dzq-theme-${site.theme}`}>
      {Content}
    </View>
  );
}));
