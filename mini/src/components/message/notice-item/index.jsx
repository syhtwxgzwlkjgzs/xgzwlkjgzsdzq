/**
 * mini - 消息通知item组件 type:私信-chat,帖子-thread,财务-financial,账号-account
*/
import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import UnreadRedDot from '@components/unread-red-dot';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import styles from './index.module.scss';

import stringToColor from '@common/utils/string-to-color';
import { diffDate } from '@common/utils/diff-date';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import PropTypes from 'prop-types';
import defaultFavicon from '../../../public/dzq-img/default-favicon.png';

@inject('site')
@observer
class Index extends Component {
  // 获取头像地址,非帖子使用自己的url头像，帖子使用站点logo
  getAvatar = (avatar) => {
    const { type, site } = this.props;
    const url = site?.webConfig?.setSite?.siteFavicon;
    if (type === 'thread') {
      return url || defaultFavicon;
    }
    return avatar;
  }

  // 获取头像背景色
  getBackgroundColor = (name) => {
    const character = name?.charAt(0).toUpperCase() || 'a';
    return stringToColor(character);
  }

  // 未读消息数
  getUnReadCount = (count) => {
    return count > 99 ? '99+' : (count || null);
  };

  // 针对财务消息，获取后缀提示语
  getFinancialTips = (item) => {
    if (item.type === 'rewarded') {
      return '打赏了你';
    }
    if (item.type === 'receiveredpacket') {
      return '获取红包';
    }
    if (item.type === 'threadrewarded') {
      return '悬赏了你';
    }
    if (item.type === 'withdrawal') {
      return '获取提现';
    }
  };

  // 账号信息前置语
  getAccountTips = (item) => {
    switch (item.type) {
      case 'replied':
        return `回复了你的${item.isFirst ? '主题' : '评论'}`;
      case 'related':
        return `@了你`;
      case 'liked':
        return `点赞了你的${item.isFirst ? '主题' : '评论'}`;
    }
  };

  filterTag(html) {
    return html?.replace(/<(\/)?([beprt]|br|div)[^>]*>|[\r\n]/gi, '')
      .replace(/<img[^>]+>/gi, $1 => {
        return $1.includes('qq-emotion') ? $1 : "[图片]";
      });
  }

  // parse content
  parseHTML = () => {
    const { type, item } = this.props;
    let _content = (typeof item.content === 'string' && item.content !== 'undefined') ? item.content : '';

    if (type === 'account') {
      const tip = `<span class=\"${styles.tip}\">${this.getAccountTips(item)}</span>`;
      _content = tip + _content;
    }

    let t = xss(s9e.parse(this.filterTag(_content)));
    t = (typeof t === 'string') ? t : '';

    return t;
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
      Taro.navigateTo({ url: `/subPages/thread/index?id=${item.id}` })
    }
    if (type === 'chat') {
      Taro.navigateTo({ url: `/subPages/message/index?page=chat&dialogId=${item.dialogId}` });
    }
  }

  render() {
    const { type, item = {}, isLast } = this.props;
    const avatarUrl = this.getAvatar(item.avatar);

    return (
      <View className={styles.wrapper} onClick={(e) => this.toDetailOrChat(e, item)}>

        {/* 默认block */}
        <View className={styles.block}>
          {/* 头像 */}
          <View
            className={styles.avatar}
            onClick={(e) => this.toUserCenter(e, type !== 'thread', item)}
          >
            <UnreadRedDot type='avatar' unreadCount={item.unreadCount}>
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
            </UnreadRedDot>
          </View>
          {/* 详情 */}
          <View className={classNames(styles.detail, {
            [styles['detail-chat']]: type === 'chat',
            [styles['detail-thread']]: type === 'thread',
            [styles['detail-financial']]: type === 'financial',
            [styles['detail-account']]: type === 'account',
            [styles['border-none']]: isLast,
          })}
          >
            {/* 顶部 */}
            <View className={styles.top}>
              <View
                className={classNames(styles.name, {
                  [styles['single-line']]: true,
                })}
                onClick={(e) => this.toUserCenter(e, type !== 'thread', item)}
              >
                {item.username || this.filterTag(item.title)}
              </View>
              {['chat', 'thread'].includes(type) &&
                <View className={styles.time}>{diffDate(item.createdAt)}</View>
              }
              {type === 'financial' &&
                <View className={styles.amount}>+{parseFloat(item.amount).toFixed(2)}</View>
              }
            </View>

            {/* 中部 */}
            <View className={classNames(styles.middle)}>
              {/* 财务内容 */}
              {type === 'financial' &&
                <View
                  className={styles['content-html']}
                >
                  在帖子"
                  <View
                    className={`${styles['financial-content']} ${styles['single-line']}`}
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
                    [styles['multiple-line']]: ['account'].includes(type),
                  })}
                  dangerouslySetInnerHTML={{ __html: this.parseHTML() }}
                />
              }
            </View>

            {/* 底部 */}
            {['financial', 'account'].includes(type) &&
              <View className={`${styles.bottom} ${styles.time}`}>
                {diffDate(item.createdAt)}
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
