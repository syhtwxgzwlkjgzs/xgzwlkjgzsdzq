import React from 'react';
import styles from './index.module.scss';
// import { Icon } from '@discuzq/design';
// import '@discuzq/design/styles/index.scss';
import CommentList from './components/comment-list/index';
import readThreadDetail from '../../../common/server/readThreadDetail';
export default class Detail extends React.Component {
  static async getInitialProps() {
    return {

    };
  }
  state = {
    commentSort: true,
    commentData: [
      {
        userName: '张三',
        content: '内容你内容内容内容你内容内容内',
        avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
      },
      {
        userName: '张三',
        content: '内容你内容内容内容你内容内容内',
        avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
      },
      {
        userName: '张三',
        content: '内容你内容内容内容你内容内容内',
        avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
      },
      {
        userName: '张三',
        content: '内容你内容内容内容你内容内容内',
        avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
      },
      {
        userName: '张三',
        content: '内容你内容内容内容你内容内容内',
        avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
      },
      {
        userName: '张三',
        content: '内容你内容内容内容你内容内容内',
        avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
      },
      {
        userName: '张三',
        content: '内容你内容内容内容你内容内容内',
        avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
      },
    ],
    commentItem: {
      userName: '张三',
      content: '内容你内容内容内容你内容内容内',
      avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201705%2F13%2F20170513155641_wCyQ2.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620980557&t=dce708a36610fb346866dc45ed90bba7',
    },
  }
  componentDidMount(e) {
    console.log(e);
    this.readThreadDetail();
  }
  // 评论列表排序
  commentSort = () => {
    console.log('评论列表排序');
    this.setState({
      commentSort: !this.state.commentSort,
    });
  }
  // 写评论
  createComment = () => {
    console.log('写评论');
  }
  // 点击详情页底部icon
  footerIconClick = (type) => {
    console.log(type);
    if (type === '1') {
      console.log('收藏');
    } else if (type === '2') {
      console.log('分享');
    } else {
      console.log('定位到评论区第一条');
    }
  }
  // 请求帖子详情
  readThreadDetail = () => {
    const param = {
      pid: 1,
    };
    const result = readThreadDetail(param);
    console.log(result);
  }

  render() {
    return (
      <div className={styles.index}>
        <div className={styles.content}>内容</div>
        <div className={styles.comment}>
          <div className={styles.commentHeader}>
            <div className={styles.commentNum}>
              共{1}条评论
            </div>
            <div className={styles.commentSort} onClick={this.commentSort}>
              {
                this.state.commentSort ? '评论从旧到新' : '评论从新到旧'
              }
            </div>
          </div>
          <div className={styles.commentItems}>
            {
              this.state.commentData.map((val, index) => <CommentList data={val} key={index}></CommentList>)
            }
          </div>
        </div>
        <div className={styles.detailFooter}>
          <div className={styles.createComment}>
            <p className={styles.createCommentText} onClick={this.createComment}>
              写评论
            </p>
          </div>
          <div className={styles.detailIcon}>
            {/* <Icon name={'comment'}></Icon> */}
            <div className={styles.footerIcon} onClick={() => this.footerIconClick('0')}>图标1</div>
            <div className={styles.footerIcon} onClick={() => this.footerIconClick('1')}>图标2</div>
            <div className={styles.footerIcon} onClick={() => this.footerIconClick('2')}>图标3</div>
          </div>
        </div>
      </div>
    );
  }
}
