import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Tip from './tip';
import ImageContent from './image-content';
import AudioPlay from './audio-play';
import PostContent from './post-content';
import ProductItem from './product-item';
import RedPacket from './red-packet';
import RewardQuestion from './reward-question';
import VideoPlay from './video-play';
import BottomEvent from './bottom-event';
import UserInfo from './user-info';
import AttachmentView from './attachment-view';
import dataSource from './data';
import styles from './index.module.scss';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
    static defaultProps = {
      money: '0',
    };

    dispatch = (type, data) => {
      console.log(type);
    }

    onShare = () => {
      console.log('分享');
    }

    onComment = () => {
      console.log('评论');
    }

    onPraise = () => {
      console.log('点赞');
    }

    // 帖子属性内容
    renderThreadContent = () => (
      <div className={styles.content}>
          <PostContent content={dataSource.content} />
          <VideoPlay width={200} height={200} />
          <ImageContent imgData={dataSource.imgData} />
          <RewardQuestion content={dataSource.rewardQuestion.content} money={dataSource.rewardQuestion.money} />
          <RedPacket content={dataSource.redPacket.content} />
          <ProductItem
              image={dataSource.goods.image}
              amount={dataSource.goods.amount}
              title={dataSource.goods.title}
          />
          <AudioPlay />
          <AttachmentView attachments={dataSource.attachments} />
      </div>
    )

    render() {
      const { money = '0' } = this.props;
      return (
        <div className={styles.container}>
          <div className={styles.header}>
              <UserInfo
                  name={dataSource.userInfo.name}
                  avatar={dataSource.userInfo.avatar}
                  location={dataSource.userInfo.location}
              />
          </div>

          {this.renderThreadContent()}

          {money !== '0' && <Button className={styles.button} type="primary"><span className={styles.icon}>$</span>支付{money}元查看剩余内容</Button>}

          <BottomEvent
            userImgs={dataSource.bottomEvent.userImgs}
            wholeNum={dataSource.bottomEvent.wholeNum}
            comment={dataSource.bottomEvent.comment}
            sharing={dataSource.bottomEvent.sharing}
            onShare={this.onShare}
            onComment={this.onComment}
            onPraise={this.onPraise}
          />
        </div>
      );
    }
}

Index.propTypes = {
  money: PropTypes.string, // 付费金额
};

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
