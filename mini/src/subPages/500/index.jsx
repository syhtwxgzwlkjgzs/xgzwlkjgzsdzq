import React, { Component } from 'react';
import Router from '@discuzq/sdk/dist/router'
import { View, Text, Image } from '@tarojs/components';
import Button from '@discuzq/design/dist/components/button/index';
import Page from '@components/page';
import styles from './index.module.scss';
import imgError from '../../../../web/public/dzq-img/error.png';

class SiteError extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <Page>
        <View className={styles.page}>
          <Image className={styles.img} src={imgError}/>
          <Text className={styles.text}>服务器错误 SERVER ERROR</Text>
          <View className={styles.fixedBox}>
            <Button onClick={() => {Router.redirect({url: '/500'});}} size='large' className={styles.btn} type='primary'>回到首页</Button>
          </View>
        </View>
      </Page>
    );
  }
}

export default SiteError;
