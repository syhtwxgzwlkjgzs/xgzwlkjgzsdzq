
import React from 'react';
import { Icon, Toast } from '@discuzq/design';
import Avatar from '@components/avatar';
import styles from './index.module.scss';
import { diffDate } from '@common/utils/diff-date';

class AuthorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowBtn: true,
    };

    this.user = this.props.user || {};
  }

  onFollowClick() {
    Toast.success({
      content: '点关注',
    });
  }
  onprivateLetter() {
    Toast.success({
      content: '发私信',
    });
  }

  render() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>楼主</span>
            </div>
            <div className={styles.info}>
                <div className={styles.AuthorInfo}>
                    <div className={styles.avatar}>
                        <Avatar image={this.user.avatar} name={this.user.userName} circle={true}></Avatar>
                    </div>
                    <div className={styles.information}>
                        <div className={styles.name}>{this.user.userName || ''}</div>
                        <div className={styles.dynamic}>活跃在 {diffDate(this.user.joinedAt)}</div>
                    </div>
                </div>
                <div className={styles.theme}>
                    <div className={styles.themeInfo}>
                        <div className={styles.title}>主题</div>
                        <div className={styles.number}>{this.user.threadCount}</div>
                    </div>
                    <div className={styles.themeInfo}>
                        <div className={styles.title}>点赞</div>
                        <div className={styles.number}>{this.user.likedCount}</div>
                    </div>
                    <div className={styles.themeInfo}>
                        <div className={styles.title}>已关注</div>
                        <div className={styles.number}>{this.user.followCount}</div>
                    </div>
                    <div className={styles.themeInfo}>
                        <div className={styles.title}>粉丝</div>
                        <div className={styles.number}>{this.user.fansCount}</div>
                    </div>
                </div>
            </div>
            {
                this.state.isShowBtn
                  ? <div className={styles.btn}>
                        <div className={styles.follow} onClick={() => this.onFollowClick()}>
                            <Icon
                                name='CheckOutlined'
                                size='14'
                                className={styles.btnIcon}>
                            </Icon>
                            <span>
                                {this.user.isFollow ? '已关注' : '关注'}
                            </span>
                        </div>
                        <div className={styles.privateLetter} onClick={() => this.onprivateLetter()}>
                            <Icon
                                name='CommentOutlined'
                                size='14'
                                className={styles.btnIcon}>
                            </Icon>
                            <span>发私信</span>
                        </div>
                    </div> : ''
            }
        </div>);
  }
}

export default AuthorInfo;
