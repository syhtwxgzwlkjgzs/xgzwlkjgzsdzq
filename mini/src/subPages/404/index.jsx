import React, { Component } from 'react';
import Router from '@discuzq/sdk/dist/router'
import { View,  } from '@tarojs/components';
import { Button} from '@discuzq/design';
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
          <View className={styles.text}>你访问的页面不存在</View>
          <View className={styles.btnBox}>
            <Button size='large' type="primary" full onClick={() => {
              Router.redirect({
                url: '/pages/index/index'
              });
            }}>返回首页</Button>
          </View>
        </View>
      </Page>
    );
  }
}

export default Index;
