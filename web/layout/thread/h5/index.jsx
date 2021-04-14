import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import createService from '@common/service/thread';
import layout from './layout.module.scss';
import comment from './comment.module.scss';
import topic from './topic.module.scss';

@inject('site')
@inject('user')
@inject('thread')
@observer
class ThreadH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.service = createService(props);
  }

  async onCollectionClick() {
    const id = this.props.thread?.threadData?.thread?.id;
    const { success, msg } = await this.service.collect(id);
    if (success) {
      console.log(msg);
    }
  }

  onBackClick() {
    this.props.router.push('/');
  }

  render() {
    const { thread } = this.props;

    return (
      <div className={layout.container}>
        <div className={layout.header}>
          <span onClick={() => this.onBackClick()}>返回</span>
        </div>

        {/* 帖子展示 */}
        <div className={layout.body}>
          <div className={`${layout.top} ${topic.container}`}>
            <div className={topic.header}>
              作者：{thread?.threadData?.author?.username}
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
          <button type="primary" onClick={() => this.onCollectionClick()}>
            {thread?.threadData?.isFavorite ? '取消收藏' : '收藏'}
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(ThreadH5Page);
