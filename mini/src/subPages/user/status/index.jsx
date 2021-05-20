import React, { Component } from 'react';
import { getCurrentInstance, navigateTo } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import { Button } from '@discuzq/design';
import Page from '@components/page';
import layout from './index.module.scss';


@inject('site')
@inject('commonLogin')
@observer
class Index extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { commonLogin } = this.props;
    const { statusCode, statusMsg } = getCurrentInstance().router.params;

    return (
      <Page>
        <View className={layout.container}>
          <View className={layout.content}>
            <View className={layout.icon}>
              <Image className={layout.icon__img} src='/dzq-img/login-status.jpg' alt=""/>
            </View>
            <View className={layout.functionalRegion}>
                <Text>
                  { commonLogin.statusMessage || commonLogin.setStatusMessage(statusCode, statusMsg) }
                </Text>
            </View>
            <Button className={layout.button} type="primary" onClick={() => {
              console.log('退出登录');

              navigateTo({
                url: '/subPages/user/wx-select/index'
              });
            }}>
              退出登录
            </Button>
          </View>
        </View>
      </Page>
    );
  }
}

export default Index;
