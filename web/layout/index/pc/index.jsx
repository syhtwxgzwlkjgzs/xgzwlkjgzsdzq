import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import NewContent from './components/new-content';
import TopMenu from './components/top-menu';
import TopNav from './components/top-nav';
import TopNews from '../h5/components/top-news';
import Navigation from './components/navigation';
import QcCode from '@components/qcCode';
import Recommend from '@components/recommend';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import { readThreadList } from '@server';
import PayBox from '@components/payBox';
import { Button } from '@discuzq/design';
import deepClone from '@common/utils/deep-clone';

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
      // visibility: 'hidden',
      isShowDefault: this.checkIsOpenDefaultTab(),
      // 筛选过滤数据
      filter: {}
    };

    this.defaultCategoryIds = this.props.index.filter?.categoryids || ['all']
  }

  // 轮询定时器
  timer = null
  
  // List组件ref
  listRef = React.createRef()
  // 存储最新的数据，以便于点击刷新时，可以直接赋值
  newThread = {}

  componentDidMount() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const { filter = {} } = this.props.index

    const newFilter = { ...this.state.filter, ...filter }
    const { categoryids = [] } = newFilter
    const currentIndex = this.resetCurrentIndex(categoryids[0] || 'all')
    
    this.setState({ filter: newFilter, currentIndex }, () => {

      this.timer = setInterval(() => {
        const { categoryids, types, essence, attention, sort, sequence } = this.state.filter;
        const { totalCount: nowTotal = -1 } = this.props.index?.threads || {};
  
        if (nowTotal !== -1) {
          readThreadList({ params: { perPage: 10, page: 1, filter: { categoryids, types, essence, attention, sort }, sequence } }).then((res) => {
            const { totalCount = 0 } = res?.data || {};
            if (totalCount > nowTotal) {
              this.setState({
                visible: true,
                conNum: totalCount - nowTotal,
              });
              // 缓存新数据
              this.newThread = res?.data
            }
          });
        }
      }, 30000);

    })
  }

  resetCategoryids(categoryids) {
    return categoryids === 'all' || categoryids === 'default' ? '' : categoryids;
  }

  resetCurrentIndex = (id) => {
    let newCurrentIndex = id
    const newId = this.resetCategoryids(id)
    if (newId) {
      const { categories = [] } = this.props.index
      categories.forEach(item => {
        if (item.children?.length) {
          const tmp = item.children.filter(children => children.pid === newId)
          // TODO H5首页暂时不显示二级标题
          if (tmp.length) {
            newCurrentIndex = item.pid
          }
        }
      })
    }
    return newCurrentIndex
  }

  onSearch = (value) => {
    if (value) {
      this.props.router.push(`/search?keyword=${value || ''}`);
    }
  }

   // 上拉加载更多
   onPullingUp = () => {
     const { dispatch = () => {} } = this.props;
     return dispatch('moreData', this.state.filter);
   }

  onFilterClick = (result) => {
    // 隐藏刷新按钮
    this.setState({ visible: false })

    const { sequence, filter: { types, sort, essence, attention, } } = result;
    const { dispatch = () => {} } = this.props;
    const newFilter = { ...this.state.filter, types, essence, sequence, attention, sort };
    this.setState({ filter: newFilter })

    // 保存操作至store
    this.props.index.setFilter(newFilter)

    // 发起网络请求
    dispatch('click-filter', newFilter);
   }

  onNavigationClick = ({ categoryIds, sequence }) => {

    // 隐藏刷新按钮
    this.setState({ visible: false })

    const { dispatch = () => {} } = this.props;
    const newFilter = { ...this.state.filter, categoryids: categoryIds, sequence };
    this.setState({ filter: newFilter })

     // 保存操作至store
    this.props.index.setFilter(newFilter)

    // 发起网络请求
    dispatch('click-filter', newFilter);
   }

   goRefresh = () => {
    const { dispatch = () => {} } = this.props;

    if (this.newThread?.pageData?.length) { // 若有缓存值，就取缓存值
      dispatch('update-page', { page: 1 })
      this.props.index.setThreads(deepClone(this.newThread))
      // 清空缓存
      this.newThread = {}
      this.setState({
        visible: false,
        conNum: 0,
      });
    } else { // 没有缓存值，直接请求网络
      dispatch('refresh-thread', this.state.filter).then((res) => {
        this.setState({
          visible: false,
          conNum: 0,
        });
      });
    }
   }

   // // 回到顶部 // visibility导致了导航栏无法正常显示子目录所以先注释掉
   // onScroll = ({ scrollTop }) => {
   //   this.setState({
   //     visibility: scrollTop > 10 ? 'visible' : 'hidden',
   //   })
   // }

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
    tmpCategories = [{ name: '全部', pid: '-1', children: [] }, ...categories];

    return tmpCategories;
  }


  // 发帖
  onPostThread = () => {
    this.props.router.push('/thread/post');
  }

  // 左侧 -- 分类
  renderLeft = (countThreads = 0) => {
    const { categories = [] } = this.props.index;
    const newCategories = this.handleCategories(categories);

    return (
      <div className={styles.indexLeft}>
        <div className={styles.indexLeftBox}>
          <Navigation 
            categories={newCategories} 
            defaultFisrtIndex={this.defaultCategoryIds[0]} 
            defaultSecondIndex={this.defaultCategoryIds[1]} 
            totalThreads={countThreads} 
            onNavigationClick={this.onNavigationClick} />
        </div>
      </div>
    );
  }
  // 右侧 -- 二维码 推荐内容
  renderRight = data => (
    <div className={styles.indexRight}>
      <QcCode />
      <div className={styles.indexRightCon}>
        <Recommend />
      </div>
      <Copyright/>
    </div>
  )

  checkIsOpenDefaultTab() {
    return this.props.site.checkSiteIsOpenDefautlThreadListData();
  }

  // 中间 -- 筛选 置顶信息 是否新内容发布 主题内容
  renderContent = (data) => {
    const { visible, conNum, isShowDefault } = this.state;
    const { sticks, threads } = data;
    const { pageData, currentPage, totalPage } = threads || {};
    return (
      <div className={styles.indexContent}>
        <div className={styles.contnetTop}>
          {sticks?.length && <div className={`${styles.TopNewsBox} ${!visible && styles.noBorder}`}>
            <TopNews data={sticks} platform="pc" isShowBorder={false}/>
          </div>}
          {
            visible && (
              <div className={styles.topNewContent}>
                <NewContent visible={visible} conNum={conNum} goRefresh={this.goRefresh} />
              </div>
            )
          }
        </div>
        <div className={styles.themeBox}>
          <div className={styles.themeItem}>
            {pageData?.map((item, index) => <ThreadContent className={styles.threadContent} key={index} data={item}/>)}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { index, site } = this.props;
    const { countThreads = 0 } = site?.webConfig?.other || {};
    const { currentPage, totalPage } = index.threads || {};
    const { isShowDefault } = this.state

    return (
      <BaseLayout
        onSearch={this.onSearch}
        onRefresh={this.onPullingUp}
        noMore={currentPage >= totalPage}
        onScroll={this.onScroll}
        quickScroll={true}
        showRefresh={false}
        left={ this.renderLeft(countThreads) }
        right={ this.renderRight() }
        pageName='home'
      >
        <TopFilterView onFilterClick={this.onFilterClick} onPostThread={this.onPostThread} isShowDefault={isShowDefault} />
        {this.renderContent(index)}
      </BaseLayout>
    );
  }
}

export default withRouter(IndexPCPage);

const TopFilterView = ({onFilterClick, isShowDefault, onPostThread}) => {
  return (
    <div className={styles.topWrapper}>
      <div className={styles.topBox}>
        <TopMenu onSubmit={onFilterClick} isShowDefault={isShowDefault}/>
        <div className={styles.PostTheme}>
          <Button type="primary" className={styles.publishBtn} onClick={onPostThread}>
            发布
          </Button>
        </div>
      </div>
    </div>
  )
}
