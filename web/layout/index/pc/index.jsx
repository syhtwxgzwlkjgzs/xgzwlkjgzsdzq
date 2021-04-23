import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import NewContent from './components/new-content';
import TopMenu from './components/top-menu';
import PostTheme from './components/post-theme';
import TopNews from '../h5/components/top-news';
import Navigation from './components/navigation';
import QcCode from './components/qcCode';
import Recommend from './components/recommend';
import ThreadContent from '@components/thread';
import RewardQuestion from '@components/thread/reward-question';
import RedPacket from '@components/thread/red-packet';
import Copyright from './components/copyright';
@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  changeBatch = () => {
    console.log('换一批');
  }
  recommendDetails = () => {
    console.log('推荐详情');
  }
  // 左侧 -- 分类
  renderLeft = () => {
    return (
      <div className={styles.indexLeft}>
        <div className={styles.indexLeftBox}>
          <Navigation />
        </div>
      </div>
    )
  }
  // 右侧 -- 二维码 推荐内容
  renderRight = () => {
    return (
      <div className={styles.indexRight}>
        <QcCode />
        <div style={{margin: '20px 0'}}>
          <Recommend
            changeBatch={this.changeBatch}
            recommendDetails={this.recommendDetails}
          />
        </div>
        <Copyright/>
      </div>
    )
  }
  // 中间 -- 筛选 置顶信息 是否新内容发布 主题内容 
  renderContent = () => {
    const { index } = this.props;
    const { sticks, threads, categories } = index;
    return (
      <div className={styles.indexContent}>
        <div className={styles.contnetTop}>
          <div className={styles.topBox}>
            <TopMenu/>
            <div className={styles.PostTheme}>
              <PostTheme/>
            </div>
          </div>
          <div className={styles.TopNewsBox}>
            <TopNews data={sticks} itemMargin='0' isShowBorder={false}/>
          </div>
          <div className={styles.topNewContent}>
            <NewContent visible='true'/>
          </div>
        </div>
        <div className={styles.themeBox}>
            <RewardQuestion/>
            <RedPacket/>
          <div className={styles.themeItem}>
            <ThreadContent/>
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className={styles.indexWrap}>
        <BaseLayout
          left={ this.renderLeft }
          right={ this.renderRight }
        >
          { this.renderContent }
        </BaseLayout>
      </div>
    );
  }
}

export default IndexPCPage;
