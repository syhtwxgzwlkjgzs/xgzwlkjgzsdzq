/**
 * 消息通知item组件 类型:私信-chat,帖子-thread,财务-financial,账号-account
 *
 * 私信内容：默认展示头像、昵称、时间和一行内容
 * 未读私信内容，在头像上展示未读信息条数，超过99条，则显示99+
 * 点击进入消息页面
 *
 * 帖子通知，原网的系统通知，
 * 头像默认为Q的头像，昵称默认为“内容通知”
 * 通知类型包括：编辑、举报、指定、精华、删除、注册申请、欢迎词、角色变更
 * 左滑出现删除按钮，点击删除可删除通知内容
 *
 * 财务通知，包括打赏收入、红包收入、悬赏收入、付费收入
 * 内容区显示：用户头像、名称、金额、内容、时间（12px）
 * 注：帖子内容中默认显示标题，如果没有标题则显示内容，长度限制为90px
 *
 * 账号消息，@、点赞、回复主题、回复评论
 *
*/
import React, { Component } from 'react';
import { Avatar, Badge, Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';

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
  // 获取头像地址,非帖子使用自己的url头像，帖子使用站点logo
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
    if (item.type === 'rewarded' && item.order_type === 2) {
      return '打赏了你';
    }
    if (item.type === 'rewarded' && item.order_type === 3) {
      return '支付了你';
    }
    if (item.type === 'threadrewarded') {
      return '悬赏了你';
    }
    if (item.type === 'threadrewardedexpired') {
      return '悬赏退回';
    }
    if (item.type === 'receiveredpacket') {
      return '获取红包';
    }
  }

  // parse content
  parseHTML = () => {
    const { type, item } = this.props;
    // 1 获取基础内容，财务信息、账户信息优先使用title展示
    let _content = ['financial', 'account'].includes(type)
      ? (item.title || item.content)
      : item.content;
    // 2 过滤内容
    _content = _content.replace(/^(<p>)/, '').replace(/(<\/p>)$/, '');
    // 3 拼接account前置tip
    if (type === 'account') {
      const tip = `<span class=\"${styles.tip}\">${threadTips[item.type]}</span>`;
      _content = tip + _content;
    }
    // 4 return
    return _content ? xss(s9e.parse(_content)) : '加载中...';
  }

  // 跳转用户账户中心
  toAccountCenter = (e, canJump, item) => {
    e.stopPropagation();
    // 后续用户中心做好后，需拼接用户id
    canJump && Router.push({ url: '/user' })
  }

  // 跳转主题详情or私信
  toDetailOrChat = (e, item) => {
    const { type } = this.props;
    if (type === 'financial' || type === 'account') {
      Router.push({ url: `'/thread/${item.id}` })
    }
    if (type === 'chat') {
      console.log('去私信页面');
    }
  }

  render() {
    const { type, item = {}, site, onBtnClick } = this.props;
    const { platform } = site;
    const isPc = platform === 'pc';
    const avatarUrl = this.getAvatar(item.avatar);

    return (
      <div className={'item ' + styles.wrapper}>

        {/* 默认block */}
        <div className={styles.block}>
          {/* 头像 */}
          <div
            className={styles.avatar}
            onClick={(e) => this.toAccountCenter(e, type !== 'thread', item)}
          >
            <Badge info={null}>
              {avatarUrl
                ? <Avatar image={avatarUrl} circle={true} />
                : <Avatar
                  text={item.userName}
                  circle={true}
                  style={{
                    backgroundColor: `#${this.getBackgroundColor(item.userName)}`
                  }}
                />
              }
            </Badge>
          </div>
          {/* 详情 */}
          <div className={classNames(styles.detail, {
            [styles['detail-chat']]: type === 'chat',
            [styles['detail-thread']]: type === 'thread',
            [styles['detail-financial']]: type === 'financial',
            [styles['detail-account']]: type === 'account',
          })}
          >
            {/* 顶部 */}
            <div
              className={classNames(styles.top, { [styles.background]: type === 'account' })}
            >
              <div
                className={styles.name}
                onClick={(e) => this.toAccountCenter(e, type !== 'thread', item)}
              >
                {item.userName || item.title}
              </div>
              {['chat', 'thread'].includes(type) &&
                <div className={styles.time}>{diffDate(new Date(item.created_at))}</div>
              }
              {type === 'financial' &&
                <div className={styles.amount}>+{(item.amount).toFixed(2)}</div>
              }
            </div>

            {/* 中部 */}
            <div
              className={classNames(styles.middle)}
              onClick={(e) => this.toDetailOrChat(e, item)}
            >
              {/* 财务内容 */}
              {type === 'financial' &&
                <p
                  className={styles['content-html']}
                  style={isPc ? { paddingRight: '20px' } : {}}
                >
                  在帖子"
                  <span
                    className={styles['single-line']}
                    style={{
                      maxWidth: `${isPc ? '400px' : '90px'}`,
                      display: 'inline-block',
                      verticalAlign: 'bottom'
                    }}
                    dangerouslySetInnerHTML={{ __html: this.parseHTML() }}
                  />
                  "中{this.getFinancialTips(item)}
                </p>
              }
              {/* 私信、帖子、账户 */}
              {['chat', 'thread', 'account'].includes(type) &&
                <p
                  className={classNames(styles['content-html'], {
                    [styles['single-line']]: ['chat'].includes(type),
                    [styles['multiple-line']]: ['thread', 'account'].includes(type),
                  })}
                  style={isPc ? { paddingRight: '20px' } : {}}
                  dangerouslySetInnerHTML={{ __html: this.parseHTML() }}
                />
              }
            </div>

            {/* 底部 */}
            {['financial', 'account'].includes(type) &&
              <div className={`${styles.bottom} ${styles.time}`}>
                {diffDate(new Date(item.created_at))}
              </div>
            }
          </div>
        </div>
        {/* PC删除 */}
        {isPc &&
          <div className={styles.delete} onClick={() => onBtnClick(item)}>
            <Icon className={styles.icon} name="DeleteOutlined" size={14} />
          </div>
        }
      </div>
    );
  }
}

Index.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onBtnClick: PropTypes.func,
}

Index.defaultProps = {
  type: 'thread',
  item: {},
  onBtnClick: () => { },
}

export default Index;
