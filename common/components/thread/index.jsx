import React from 'react';
import { inject, observer } from 'mobx-react';
import { ThreadCommonContext } from './utils';
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
import BottomShare from './bottom-share';
import dataSource from './data';
import styles from './index.module.scss';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
    dispatch = (type, data) => {
      console.log(type);
    }
    state = {
      datas: [],
    }

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
            </div>
    )

    renderThread = () => (
            <div className={styles.container}>
                <div className={styles.header}>
                    <UserInfo
                        name={dataSource.userInfo.name}
                        avatar={dataSource.userInfo.avatar}
                        location={dataSource.userInfo.location}
                    />
                </div>

                {this.renderThreadContent()}

                <BottomEvent datas={dataSource.bottomEvent.datas} />

                <div className={styles.bottom}>
                    <BottomShare />
                </div>

            </div>
    )

    render() {
      return (
            <ThreadCommonContext.Provider value={{ dispatch: this.dispatch }}>
                {this.renderThread()}
            </ThreadCommonContext.Provider>
      );
    }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
