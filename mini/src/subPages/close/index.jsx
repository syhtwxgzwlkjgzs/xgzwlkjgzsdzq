import React, { Component } from 'react';
import { View,  } from '@tarojs/components';
import Page from '@components/page';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';

@inject('site')
@observer
class Index extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { site } = this.props;
    const { closeSiteConfig } = site;
    return (
      <Page>
        <View className={styles.page}>
          <View className={styles.main}>站点已关闭</View>
          {closeSiteConfig && <p className={styles.sub}>{closeSiteConfig.detail}</p>}
        </View>
      </Page>
    );
  }
}

export default Index;
