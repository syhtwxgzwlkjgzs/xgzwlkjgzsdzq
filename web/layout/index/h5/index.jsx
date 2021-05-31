import React, { createRef } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Tabs } from '@discuzq/design';
import ThreadContent from '@components/thread';
import HomeHeader from '@components/home-header';
import styles from './index.module.scss';
import TopNew from './components/top-news';
import FilterView from './components/filter-view';
import BaseLayout from '@components/base-layout';


@inject('site')
@inject('user')
@inject('index')
@inject('baselayout')
@observer
class IndexH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      filter: {},
      currentIndex: 'all',
      isFinished: true,
      fixedTab: false,
    };
    this.listRef = createRef();
    // 用于获取顶部视图的高度
    this.headerRef = createRef(null);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    const { filter = {} } = this.props.index

    const newFilter = { ...this.state.filter, ...filter }
    const { categoryids = [] } = newFilter
 
    const currentIndex = this.resetCurrentIndex(categoryids[0] || 'all')
    
    this.setState({ filter: newFilter, currentIndex })
  }

  componentWillUnmount() {
    const { filter } = this.state
    this.props.index.setFilter(filter)
  }

  checkIsOpenDefaultTab() {
    return this.props.site.checkSiteIsOpenDefautlThreadListData();
  }

  // 点击更多弹出筛选
  searchClick = () => {
    this.setState({
      visible: true,
    });
  };
  // 关闭筛选框
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 点击底部tabBar
  onClickTabBar = (data, index) => {
    if (index !== 0) {
      return
    }
    const { dispatch = () => {} } = this.props;
    const { filter } = this.state;
    const requestFilter = Object.assign({}, filter);
    dispatch('click-filter', requestFilter);
  }

  onClickTab = (id = '') => {
    const { dispatch = () => {} } = this.props;
    const currentIndex = this.resetCurrentIndex(id);
    const { categories = [] } = this.props.index

    // 若选中的一级标签，存在二级标签，则将一级id和所有二级id全都传给后台
    let newCategoryIds = [currentIndex]
    const tmp = categories.filter(item => item.pid === currentIndex)
    if (tmp.length && tmp[0]?.children?.length) {
      newCategoryIds = [currentIndex]
      tmp[0]?.children?.forEach(item => {
        newCategoryIds.push(item.pid)
      })
    }

    this.props.baselayout.setJumpingToTop();

    const newFilter = { ...this.state.filter, categoryids: newCategoryIds, sequence: id === 'default' ? 1 : 0, }

    dispatch('click-filter', newFilter);

    this.setState({
      filter: newFilter,
      currentIndex: id,
      visible: false,
    });
  };

  // 筛选弹框点击筛选按钮后的回调：categoryids-版块 types-类型 essence-筛选
  onClickFilter = ({ categoryids, types, essence, sequence }) => {
    const { dispatch = () => {} } = this.props;
    const requestCategoryids = categoryids.slice();
    
    const newFilter = { ...this.state.filter, categoryids: requestCategoryids, types, essence, sequence }
    dispatch('click-filter', newFilter);

    let newCurrentIndex = this.resetCurrentIndex(categoryids[0])
    this.setState({
      filter: newFilter,
      currentIndex: newCurrentIndex,
      visible: false,
    });
  };

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

  // 上拉加载更多
  onRefresh = () => {
    const { dispatch = () => {} } = this.props;
    const { filter } = this.state;
    const requestFilter = Object.assign({}, filter);
    return dispatch('moreData', requestFilter);
  };

  handleScroll = ({ scrollTop = 0 } = {}) => {
    const { height = 180 } = this.headerRef.current?.state || {}
    const { fixedTab } = this.state;
    // 只需要滚到临界点触发setState，而不是每一次滚动都触发
    if(!fixedTab && scrollTop >= height) {
      this.setState({ fixedTab: true })
    } else if(fixedTab && scrollTop < height) {
      this.setState({ fixedTab: false })
    }
  }

  // 后台接口的分类数据不会包含「全部」，此处前端手动添加
  handleCategories = () => {
    const { categories = [] } = this.props.index || {};

    if (!categories?.length) {
      return categories;
    }

    let tmpCategories = [{ name: '全部', pid: 'all', children: [] }]

    if (this.checkIsOpenDefaultTab()) {
      tmpCategories.push({ name: '推荐', pid: 'default', children: [] });
    }

    return [...tmpCategories, ...categories];
  };

  renderTabs = () => {
    const { index } = this.props;
    const { currentIndex, fixedTab } = this.state;
    const { categories = [] } = index;
    const newCategories = this.handleCategories();

    return (
      <>
        {categories?.length > 0 && (
          <>
          <div ref={this.listRef} className={`${styles.homeContent} ${fixedTab && styles.fixed}`}>
            <Tabs
              className={styles.tabsBox}
              scrollable
              type="primary"
              onActive={this.onClickTab}
              activeId={currentIndex}
              tabBarExtraContent={
                <div onClick={this.searchClick} className={styles.tabIcon}>
                  <Icon name="SecondaryMenuOutlined" className={styles.buttonIcon} size={16} />
                </div>
              }
            >
              {newCategories?.map((item, index) => (
                <Tabs.TabPanel key={index} id={item.pid} label={item.name} />
              ))}
            </Tabs>
          </div>
          {fixedTab &&  <div className={styles.tabPlaceholder}></div>}
          </>
        )}
      </>
    );
  };

  renderHeaderContent = () => {
    const { index } = this.props;
    const { sticks = [] } = index;

    return (
      <>
        {sticks && sticks.length > 0 && (
          <div className={styles.homeContentTop}>
            <TopNew data={sticks} itemMargin="1" />
          </div>
        )}
      </>
    );
  };

  renderItem = ({ index, data }) => (
    <div key={index}>
      {index === 0 && this.renderHeaderContent()}
      <ThreadContent data={data[index]} className={styles.listItem} />
    </div>
  );

  render() {
    const { index } = this.props;
    const { filter, isFinished } = this.state;
    const { threads = {} } = index;
    const { currentPage, totalPage, pageData } = threads || {};
    const newCategories = this.handleCategories();

    return (
      <BaseLayout
        showHeader={false}
        showTabBar
        onRefresh={this.onRefresh}
        noMore={currentPage >= totalPage}
        isFinished={isFinished}
        onScroll={this.handleScroll}
        quickScroll={true}
        curr='home'
        pageName='home'
        preload={1000}
        onClickTabBar={this.onClickTabBar}
        requestError={this.props.isError}
      >
        <HomeHeader ref={this.headerRef} />

        {this.renderTabs()}

        {this.renderHeaderContent()}

        {pageData?.length > 0
          && pageData.map((item, index) => (
            <ThreadContent 
              key={index} 
              showBottomStyle={index !== pageData.length - 1} 
              data={item} 
              className={styles.listItem} 
            />
          ))}

        <FilterView
          data={newCategories}
          current={filter}
          onCancel={this.onClose}
          visible={this.state.visible}
          onSubmit={this.onClickFilter}
        />
      </BaseLayout>
    );
  }
}

export default IndexH5Page;
