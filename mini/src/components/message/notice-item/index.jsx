/**
 * mini - 消息通知item组件 type:私信-chat,帖子-thread,财务-financial,账号-account
*/
import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Avatar, Badge, Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import styles from './index.module.scss';

import stringToColor from '@common/utils/string-to-color';
import { diffDate } from '@common/utils/diff-date';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import PropTypes from 'prop-types';

// 账户信息前置语
const threadTips = {
  replied: '回复了你',
  related: '@了你',
  liked: '点赞了你',
}

@inject('site')
@observer
class Index extends Component {
  // 获取头像地址,非系统使用自己的url头像，系统使用站点logo
  getAvatar = (avatar) => {
    const { type, site } = this.props;
    const url = site?.webConfig?.setSite?.siteFavicon;
    if (type === 'thread') {
      return url || "/favicon.ico";
    }
    return avatar;
  }

  // 获取头像背景色
  getBackgroundColor = (name) => {
    const character = name?.charAt(0).toUpperCase() || 'a';
    return stringToColor(character);
  }

  // 针对财务消息，获取后缀提示语
  getFinancialTips = (item) => {
    if (item.type === 'rewarded') {
      return '支付了你';
    }
    if (item.type === 'questioned') {
      return '悬赏了你';
    }
    if (item.type === 'receiveredpacket') {
      return '获取红包';
    }
    if (item.type === 'withdrawal') {
      return '获取提现';
    }
  };

  // 未读消息数
  getUnReadCount = (count) => {
    return count > 99 ? '99+' : (count || null);
  };

  // parse content
  filterTag(html) {
    return html?.replace(/(<p>)|(<\/p>)|(<br>)/g, '');
  }

  // parse content
  parseHTML = () => {
    const { type, item } = this.props;
    // 1 获取基础内容，财务信息、账户信息优先使用title展示
    let _content = ['financial', 'account'].includes(type)
      ? (item.title || item.content)
      : item.content;
    // 2 过滤内容
    _content = this.filterTag(_content);
    // 3 拼接account前置tip
    if (type === 'account') {
      const tip = `<span class=\"${styles.tip}\">${threadTips[item.type]}</span>`;
      _content = tip + _content;
    }
    // 4 return
    return _content ? xss(s9e.parse(_content)) : '加载中...';
  }

  // 跳转用户中心
  toUserCenter = (e, canJump, item) => {
    e.stopPropagation();
    // 后续用户中心做好后，再根据用户id设置对应路由
    canJump && Taro.navigateTo({ url: `/subPages/user/index?id=${item.userId}` })
  }

  // 跳转主题详情or私信
  toDetailOrChat = (e, item) => {
    if (e.target.nodeName === 'A') return;
    const { type } = this.props;
    if (type === 'financial' || type === 'account') {
      Taro.navigateTo({ url: `/pages/thread/index?id=${item.id}` })
    }
    if (type === 'chat') {
      console.log('去私信页面');
    }
  }

  render() {
    const { type, item = {} } = this.props;
    const avatarUrl = this.getAvatar(item.avatar);

    return (
      <View className={styles.wrapper}>

        {/* 默认block */}
        <View className={styles.block}>
          {/* 头像 */}
          <View
            className={styles.avatar}
            onClick={(e) => this.toUserCenter(e, type !== 'thread', item)}
          >
            <Badge
              className={classNames({
                [styles.badge]: type === 'chat' && item.unreadCount > 9
              })}
              circle
              info={ type === 'chat' && this.getUnReadCount(item.unreadCount)}
            >
              {avatarUrl
                ? <Avatar image={avatarUrl} circle={true} />
                : <Avatar
                  text={item.username}
                  circle={true}
                  style={{
                    backgroundColor: `#${this.getBackgroundColor(item.username)}`
                  }}
                />
              }
            </Badge>
          </View>
          {/* 详情 */}
          <View className={classNames(styles.detail, {
            [styles['detail-chat']]: type === 'chat',
            [styles['detail-thread']]: type === 'thread',
            [styles['detail-financial']]: type === 'financial',
            [styles['detail-account']]: type === 'account',
          })}
          >
            {/* 顶部 */}
            <View
              className={classNames(styles.top, { [styles.background]: type === 'account' })}
            >
              <View
                className={styles.name}
                onClick={(e) => this.toUserCenter(e, type !== 'thread', item)}
              >
                {item.username || this.filterTag(item.title)}
              </View>
              {['chat', 'thread'].includes(type) &&
                <View className={styles.time}>{diffDate(new Date(item.createdAt))}</View>
              }
              {type === 'financial' &&
                <View className={styles.amount}>+{(item.amount).toFixed(2)}</View>
              }
            </View>

            {/* 中部 */}
            <View
              className={classNames(styles.middle)}
              onClick={(e) => this.toDetailOrChat(e, item)}
            >
              {/* 财务内容 */}
              {type === 'financial' &&
                <View
                className={styles['content-html']}
                >
                  在帖子"
                  <View
                    className={styles['single-line']}
                    style={{
                      maxWidth: `90px`,
                      display: 'inline-block',
                      verticalAlign: 'bottom'
                    }}
                    dangerouslySetInnerHTML={{ __html: this.parseHTML() }}
                  />
                  "中{this.getFinancialTips(item)}
                </View>
              }
              {/* 私信、帖子、账户 */}
              {['chat', 'thread', 'account'].includes(type) &&
                <View
                  className={classNames(styles['content-html'], {
                    [styles['single-line']]: ['chat'].includes(type),
                    [styles['multiple-line']]: ['thread', 'account'].includes(type),
                  })}
                  dangerouslySetInnerHTML={{ __html: this.parseHTML() }}
                />
              }
            </View>

            {/* 底部 */}
            {['financial', 'account'].includes(type) &&
              <View className={`${styles.bottom} ${styles.time}`}>
                {diffDate(new Date(item.createdAt))}
              </View>
            }
          </View>
        </View>
      </View>
    );
  }
}

Index.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
}

Index.defaultProps = {
  type: 'thread',
  item: {},
}

export default Index;
