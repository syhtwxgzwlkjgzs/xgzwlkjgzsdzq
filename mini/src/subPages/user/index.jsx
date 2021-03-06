import React, { useEffect } from 'react';
import OtherView from '../../layout/my/other-user/index';
import Page from '@components/page';
import { View, Text } from '@tarojs/components';
import { inject, observer } from 'mobx-react';
import withShare from '@common/utils/withShare/withShare';
import { priceShare } from '@common/utils/priceShare';
import Taro, { getCurrentInstance, eventCenter } from '@tarojs/taro';

@inject('site')
@inject('search')
@inject('topic')
@inject('index')
@inject('user')
@observer
@withShare({})
class Index extends React.Component {
  getShareData(data) {
    const { site } = this.props;
    const { id = '' } = getCurrentInstance().router.params;
    const defalutTitle = `${this.props.user?.targetUser?.nickname || this.props.user?.targetUser?.username}的主页`;
    const defalutPath = `/subPages/user/index?id=${id}`;
    if (data.from === 'menu') {
      return {
        title: defalutTitle,
        path: defalutPath,
      };
    }
    const { title, path, comeFrom, threadId, isAnonymous, isPrice } = data;
    if (comeFrom && comeFrom === 'thread') {
      const { user } = this.props;
      this.props.index.updateThreadShare({ threadId }).then((result) => {
        if (result.code === 0) {
          this.props.index.updateAssignThreadInfo(threadId, {
            updateType: 'share',
            updatedInfo: result.data,
            user: user.userInfo,
          });
          this.props.search.updateAssignThreadInfo(threadId, {
            updateType: 'share',
            updatedInfo: result.data,
            user: user.userInfo,
          });
          this.props.user.updateAssignThreadInfo(threadId, {
            updateType: 'share',
            updatedInfo: result.data,
            user: user.userInfo,
          });
          this.props.topic.updateAssignThreadInfo(threadId, {
            updateType: 'share',
            updatedInfo: result.data,
            user: user.userInfo,
          });
        }
      });
    }
    return (
      priceShare({ isAnonymous, isPrice, path }) || {
        title,
        path,
      }
    );
  }
  render() {
    return (
      <Page>
        <OtherView />
      </Page>
    );
  }
}

export default Index;
