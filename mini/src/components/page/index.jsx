import React, { useMemo } from 'react';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';

@inject('user')
@inject('site')
@observer
export default class Page extends React.Component {

  static defaultProps = {
    withLogin: false,
    noWithLogin: false
  }

  constructor(props) {
    super(props);
    const { noWithLogin, withLogin, user } = this.props;
    if ( withLogin && !user.isLogin()) {
      Router.redirect({
        url: '/subPages/user/login/index'
      });
    }

    if (noWithLogin && user.isLogin()) {
      Router.redirect({
        url: '/pages/index/index'
      });
    }
  }

  componentWillMount() {
    

  }

  createContent() {
    const { children, site } = this.props;
    if (!site.webConfig) {
      return (
        <View className={styles.loadingBox}>
          <Icon className={styles.loading} name="LoadingOutlined" size="large" />
        </View>
      );
    }
    return children;
  }

  render() {
    const { site } = this.props;
    return (
      <View className={`${styles['dzq-page']} dzq-theme-${site.theme}`}>
        {this.createContent()}
      </View>
    );
  }
}
