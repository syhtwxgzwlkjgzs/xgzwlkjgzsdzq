import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
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
import { readThreadList } from '@server';
import PayBox from '@components/payBox';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentIndex: '',
      conNum: 0,
    };
  }

  // 轮询定时器
  timer = null
  filter = {}

  componentDidMount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      const { categoryids, types, essence, attention, sort, sequence } = this.filter;
      readThreadList({ params: { page: 1, filter: { categoryids, types, essence, attention, sort }, sequence } }).then((res) => {
        const { totalCount = 0 } = res?.data || {};
        const { totalCount: nowTotal = 0 } = this.props.index?.threads || {};
        if (totalCount > nowTotal) {
          this.setState({
            visible: true,
            conNum: totalCount - nowTotal,
          });
        }
      });
    }, 30000);
  }

  onSearch = (value) => {
    if (value) {
      this.props.router.push(`/search?keyword=${value || ''}`);
    }
  }

  changeBatch = () => {
    const { dispatch = () => {} } = this.props;
     return dispatch('refresh-recommend', this.filter);
  }
  recommendDetails = (item) => {
    const { threadId } = item
    this.props.router.push(`/thread/${threadId}`);
  }

   // 上拉加载更多
   onPullingUp = () => {
     const { dispatch = () => {} } = this.props;
     return dispatch('moreData', this.filter);
   }

   onFilterClick = (result) => {
     const { sequence, essence, attention, filter: { types, sort } } = result;
     const { dispatch = () => {} } = this.props;
     this.filter = { ...this.filter, types, essence, sequence, attention, sort };
     dispatch('click-filter', this.filter);
   }

   onNavigationClick = ({ categoryIds, sequence }) => {
     const { dispatch = () => {} } = this.props;
     this.filter = { ...this.filter, categoryids: categoryIds, sequence };
     dispatch('click-filter', this.filter);
   }

   goRefresh = () => {
     const { dispatch = () => {} } = this.props;
     dispatch('click-filter', this.filter).then((res) => {
       this.setState({
         visible: false,
         conNum: 0,
       });
     });
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
  renderLeft = (countThreads = 0) => {
    const { categories = [] } = this.props.index;
    const newCategories = this.handleCategories(categories);

    return (
      <div className={styles.indexLeft}>
        <div className={styles.indexLeftBox}>
          <Navigation categories={newCategories} totalThreads={countThreads} onNavigationClick={this.onNavigationClick} />
        </div>
      </div>
    );
  }
  // 右侧 -- 二维码 推荐内容
  renderRight = (data) => (
      <div className={styles.indexRight}>
        <QcCode />
        <div style={{ margin: '20px 0' }}>
          <Recommend
            changeBatch={this.changeBatch}
            recommendDetails={this.recommendDetails}
            data={data}
          />
        </div>
        <Copyright/>
        <PayBox />
      </div>
  )
  // 中间 -- 筛选 置顶信息 是否新内容发布 主题内容
  renderContent = (data) => {
    const { visible, conNum } = this.state;
    const { sticks, threads } = data;
    const { pageData } = threads || {};
    return (
      <div className={styles.indexContent}>
        <div className={styles.contnetTop}>
          <div className={styles.topBox}>
            <TopMenu onSubmit={this.onFilterClick} />
            <div className={styles.PostTheme}>
              <PostTheme/>
            </div>
          </div>
          <div className={styles.TopNewsBox}>
            <TopNews data={sticks} itemMargin='0' isShowBorder={false}/>
          </div>
          <div className={styles.topNewContent}>
            <NewContent visible={visible} conNum={conNum} goRefresh={this.goRefresh} />
          </div>
        </div>
        <div className={styles.themeBox}>
          <div className={styles.themeItem}>
            {pageData?.map((item, index) => <ThreadContent className={styles.threadContent} key={index} data={item} />)}
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { index, site } = this.props;
    const { countThreads = 0 } = site?.webConfig?.other || {};
    const { currentPage, totalPage } = this.props.index.threads || {};
    const { recommends } = this.props.index || [];

    return (
      <List className={styles.indexWrap} onRefresh={this.onPullingUp} noMore={currentPage === totalPage}>
          <BaseLayout
            onSearch={this.onSearch}
            left={ this.renderLeft(countThreads) }
            right={ this.renderRight(recommends) }
          >
            {this.renderContent(index)}
          </BaseLayout>
      </List>
    );
  }
}

export default withRouter(IndexPCPage);
