import React, { Component } from 'react';
import Router from '@discuzq/sdk/dist/router'
import { View, Text, Image } from '@tarojs/components';
import { Button} from '@discuzq/design';
import Page from '@components/page';
import styles from './index.module.scss';
import img404 from '../../../../web/public/dzq-img/404.png';

class NotFindPage extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <Page>
        <View className={styles.page}>
          <Image className={styles.img} src={img404}/>
          <Text className={styles.text}>您要访问的页面可能已被删除、已更改名称或暂时不可用</Text>
          <View className={styles.fixedBox}>
            <Button onClick={() => {Router.back()}} size='large' className={styles.btn} type='primary'>返回上一页</Button>
          </View>
        </View>
      </Page>
    );
  }
}

export default NotFindPage;
