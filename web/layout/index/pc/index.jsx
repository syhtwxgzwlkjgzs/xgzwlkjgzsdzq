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
import List from '@components/list';
import Copyright from './components/copyright';
@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      filter: {},
      currentIndex: '',
    };
  }

  changeBatch = () => {
    console.log('换一批');
  }
  recommendDetails = () => {
    console.log('推荐详情');
  }

   // 上拉加载更多
   onPullingUp = () => {
     const { dispatch = () => {} } = this.props;
     const { filter } = this.state;
     return dispatch('moreData', filter);
   }

  // 后台接口的分类数据不会包含「全部」，此处前端手动添加
  handleCategories = () => {
    const { categories = [] } = this.props.index || {};

    if (!categories?.length) {
      return categories;
    }

    let tmpCategories = categories.filter(item => item.name === '全部');
    if (tmpCategories?.length) {
      return categories;
    }
    tmpCategories = [{ name: '全部', pid: '', children: [] }, ...categories];
    return tmpCategories;
  }


  // 左侧 -- 分类
  renderLeft = () => {
    const { categories = [] } = this.props.index;
    const newCategories = this.handleCategories(categories);

    return (
      <div className={styles.indexLeft}>
        <div className={styles.indexLeftBox}>
          <Navigation categories={newCategories} />
        </div>
      </div>
    );
  }
  // 右侧 -- 二维码 推荐内容
  renderRight = () => (
      <div className={styles.indexRight}>
        <QcCode />
        <div style={{ margin: '20px 0' }}>
          <Recommend
            changeBatch={this.changeBatch}
            recommendDetails={this.recommendDetails}
          />
        </div>
        <Copyright/>
      </div>
  )
  // 中间 -- 筛选 置顶信息 是否新内容发布 主题内容
  renderContent = () => {
    const { index } = this.props;
    const { sticks, threads, categories } = index;
    const { currentPage, totalPage, pageData } = threads || {};

    const newCategories = this.handleCategories(categories);

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
          <div className={styles.themeItem}>

            <List className={styles.list} onRefresh={this.onPullingUp} noMore={currentPage === totalPage}>
              {pageData?.map((item, index) => <ThreadContent key={index} data={item} />) }
            </List>

          </div>
        </div>
      </div>
    );
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
