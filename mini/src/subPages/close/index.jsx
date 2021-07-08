import React, { Component } from 'react';
import { View, Text, Image  } from '@tarojs/components';
import Page from '@components/page';
import Button from '@discuzq/design/dist/components/button/index';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import imgClose from '../../../../web/public/dzq-img/close.png';
import jump from '@common/utils/jump';
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
          <Image className={styles.img} src={imgClose}/>
          <Text className={styles.main}>关闭已站点</Text>
          {closeSiteConfig && <Text className={styles.sub}>{closeSiteConfig.detail}</Text>}
          {/* <View className={styles.fixedBox}>
            <Button onClick={jump.saveAndLogin} size='large' className={styles.btn} type='primary'>管理员登录</Button>
          </View> */}
        </View>
      </Page>
    );
  }
}

export default Index;
