
import React from 'react';
import { Avatar, Icon, Toast } from '@discuzq/design';
import styles from './index.module.scss';

class AuthorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFollow: true, // 是否关注
      avatarUrl: '', // 楼主头像url
      name: 'Pit', // 楼主用户名
      dynamicDayNum: 2, // 活跃天数
      themeCount: 36, // 主题数量
      likeCount: 800, // 点赞数量
      concernCount: 16, // 关注数量
      fansCount: 162, // 粉丝数量
      isShowBtn: true, // 是否显示关注、私信
    };
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
                        <Avatar image={this.state.avatarUrl} circle={true}></Avatar>
                    </div>
                    <div className={styles.information}>
                        <div className={styles.name}>{this.state.name}</div>
                        <div className={styles.dynamic}>活跃在 {this.state.dynamicDayNum}天前</div>
                    </div>
                </div>
                <div className={styles.theme}>
                    <div className={styles.themeInfo}>
                        <div className={styles.title}>主题</div>
                        <div className={styles.number}>{this.state.themeCount}</div>
                    </div>
                    <div className={styles.themeInfo}>
                        <div className={styles.title}>点赞</div>
                        <div className={styles.number}>{this.state.likeCount}</div>
                    </div>
                    <div className={styles.themeInfo}>
                        <div className={styles.title}>已关注</div>
                        <div className={styles.number}>{this.state.concernCount}</div>
                    </div>
                    <div className={styles.themeInfo}>
                        <div className={styles.title}>粉丝</div>
                        <div className={styles.number}>{this.state.fansCount}</div>
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
                                {this.state.isFollow ? '已关注' : '关注'}
                            </span>
                        </div>
                        <div className={styles.privateLetter} onClick={() => this.onprivateLetter()}>
                            <Icon
                                name='MessageOutlined'
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
