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
              <Image className={layout.icon__img} src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201408%2F30%2F20140830180834_XuWYJ.png&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620908425&t=673ddda42973b103faf179fc02818b41' alt=""/>
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
