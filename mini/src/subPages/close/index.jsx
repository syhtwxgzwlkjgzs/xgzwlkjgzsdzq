import React, { Component } from 'react';
import { View,  } from '@tarojs/components';
import Page from '@components/page';
import styles from './index.module.scss';

class Index extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <Page>
        <View className={styles.page}>
          <View className={styles.text}>站点已关闭</View>
        </View>
      </Page>
    );
  }
}

export default Index;
