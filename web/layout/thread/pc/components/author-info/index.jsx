
import React from 'react';
import { Icon, Toast, Button } from '@discuzq/design';
import Avatar from '@components/avatar';
import styles from './index.module.scss';
import { diffDate } from '@common/utils/diff-date';
import { inject, observer } from 'mobx-react';

@inject('thread')
@observer
class AuthorInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowBtn: true,
        };

        this.user = this.props.user || {};
    }

    // 点击关注
    onFollowClick() {
        typeof this.props.onFollowClick === 'function' && this.props.onFollowClick();
    }

    // 点击私信
    onprivateLetter() { }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <span>楼主</span>
                </div>
                <div className={styles.info}>
                    <div className={styles.AuthorInfo}>
                        <div className={styles.avatar}>
                            <Avatar
                                image={this.user.avatarUrl}
                                name={this.user.username}
                                circle={true}
                                userId={this.user.id}
                                isShowPopup={true}>
                            </Avatar>
                        </div>
                        <div className={styles.information}>
                            <div className={styles.name}>{this.user.username || ''}</div>
                            <div className={styles.dynamic}>活跃在 {diffDate(new Date(this.user.updatedAt))}</div>
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
                            <Button type={this.user.follow ? 'primary' : 'primary'} className={styles.follow} onClick={() => this.onFollowClick()}>
                                <div className={styles.btnItem}>
                                    <Icon
                                        name={this.user.follow ? 'CheckOutlined' : 'PlusOutlined'}
                                        size='14'
                                        className={styles.btnIcon}>
                                    </Icon>
                                    <span>
                                        {this.user.follow ? '已关注' : '关注'}
                                    </span>
                                </div>
                            </Button>

                            <Button className={styles.privateLetter} onClick={() => this.onprivateLetter()}>
                                <div className={styles.btnItem}>
                                    <Icon
                                        name='CommentOutlined'
                                        size='14'
                                        className={styles.btnIcon}>
                                    </Icon>
                                    <span>发私信</span>
                                </div>
                            </Button>
                        </div> : <div className={styles.btn}></div>
                }
            </div>);
    }
}

export default AuthorInfo;
