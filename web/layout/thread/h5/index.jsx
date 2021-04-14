import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button } from '@discuzq/design';
import createService from '@common/service/thread';
import layout from './layout.module.scss';
import comment from './comment.module.scss';
import topic from './topic.module.scss';

import UserInfo from '@common/components/UserInfo/web/index';

@inject('site')
@inject('user')
@inject('thread')
@observer
class ThreadH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.service = createService(props);

    this.state = {
      loading: false,
    };
  }

  async onCollectionClick() {
    if (this.state.loading) return;
    this.setState({
      loading: true,
    });
    const id = this.props.thread?.threadData?.thread?.id;
    const { success, msg } = await this.service.collect(id);
    this.setState({
      loading: false,
    });
    if (success) {
      console.log(msg);
    }
  }

  onBackClick() {
    this.props.router.push('/');
  }

  render() {
    const { thread } = this.props;

    const userInfoProps = {
      name: thread?.threadData?.author?.username || '',
      avatar: thread?.threadData?.author?.avatar || '',
      time: '5分钟前',
      location: '腾讯大厦',
      view: '98',
    };

    return (
      <div className={layout.container}>
        <div className={layout.header}>
          <span onClick={() => this.onBackClick()}>返回</span>
        </div>

        {/* 帖子展示 */}
        <div className={layout.body}>
          <div className={`${layout.top} ${topic.container}`}>
            <div className={topic.header}>
              <UserInfo {...userInfoProps}></UserInfo>
            </div>
            <div className={topic.body}>
              {thread?.threadData?.thread.postContent}

              {(thread?.threadData?.images || [])
                .map(image => image.url
                  && <img key={image.id} className={topic.image} src={image.url} alt={image.fileName} />)
              }
            </div>
          </div>

          {/* 评论 */}
          <div className={`${layout.bottom} ${comment.container}`}>
            <div className={comment.header}>
              0条评论
            </div>
            <div className={comment.body}>
              评论列表
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className={layout.footer}>
          <Button type="primary" loading={this.state.loading} onClick={() => this.onCollectionClick()}>
            {thread?.threadData?.isFavorite ? '取消收藏' : '收藏'}
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(ThreadH5Page);
