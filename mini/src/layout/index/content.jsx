import React, { createRef } from 'react';
import { inject, observer } from 'mobx-react';
import Icon from '@discuzq/design/dist/components/icon/index';
import Tabs from '@discuzq/design/dist/components/tabs/index';
import { View } from '@tarojs/components'
import ThreadContent from '../../components/thread';
import HomeHeader from '../../components/home-header';
import FilterView from './components/filter-view';
import BaseLayout from '../../components/base-layout';
import { throttle } from '@common/utils/throttle-debounce.js'
import TopNew from './components/top-news';
import NavBar from './components/nav-bar';
import Taro from '@tarojs/taro';

import styles from './index.module.scss';
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
      filter: {
        categoryids: this.checkIsOpenDefaultTab() ? ['default'] : ['all'],
        sequence: this.checkIsOpenDefaultTab() ? 1 : 0,
      },
      currentIndex: this.checkIsOpenDefaultTab() ? 'default' : 'all',
      isFinished: true,
      fixedTab: false,
      navBarHeight: 64,
    };
    this.listRef = createRef();
    this.headerRef = createRef(null);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    const { filter = {} } = this.props.index

    const newFilter = { ...this.state.filter, ...filter }
    const { categoryids } = newFilter
    const currentIndex = categoryids[0] || ''

    let navBarHeight = 64
    try {
      const res = Taro.getSystemInfoSync()
      const height = res?.statusBarHeight || 20
      navBarHeight = 44 + height
    } catch (e) {
      // Do something when catch error
    }

    this.setState({ filter: newFilter, currentIndex, navBarHeight })
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
    this.props.index.setHiddenTabBar(true)

    this.setState({
      visible: true,
    });
  };
  // 关闭筛选框
  onClose = () => {
    this.props.index.setHiddenTabBar(false)

    this.setState({
      visible: false,
    });
  };

  onClickTab = (id = '') => {
    const { dispatch = () => {} } = this.props;
    const currentIndex = this.resetCategoryids(id);
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
    dispatch('click-filter', { categoryids: newCategoryIds, sequence: id === 'default' ? 1 : 0 });

    this.setState({
      filter: {
        categoryids: newCategoryIds,
        sequence: id === 'default' ? 1 : 0,
      },
      currentIndex: id,
      visible: false,
    });
  };

  // 筛选弹框点击筛选按钮后的回调：categoryids-版块 types-类型 essence-筛选
  onClickFilter = ({ categoryids, types, essence, sequence }) => {
    const { dispatch = () => {} } = this.props;
    const requestCategoryids = categoryids.slice();
    requestCategoryids[0] = (requestCategoryids[0] === 'all' || requestCategoryids[0] === 'default') ? [] : requestCategoryids[0];
    dispatch('click-filter', { categoryids: requestCategoryids, types, essence, sequence });

    let newCurrentIndex = this.resetCurrentIndex(categoryids[0])
    this.setState({
      filter: {
        categoryids,
        types,
        essence,
        sequence,
      },
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
    requestFilter.categoryids = this.resetCategoryids(requestFilter.categoryids[0]);
    return dispatch('moreData', requestFilter);
  };

  handleScroll = (e) => {
    const { scrollTop = 0 } = e?.detail || {}
    const { navBarHeight } = this.state || {}
    this.setState({ fixedTab: !(scrollTop < navBarHeight) })
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

    tmpCategories = [{ name: '全部', pid: 'all', children: [] }, ...categories];

    // 默认功能的开启
    if (this.checkIsOpenDefaultTab()) {
      tmpCategories.unshift({ name: '默认', pid: 'default', children: [] });
    }
    return tmpCategories;
  };

  renderTabs = () => {
    const { index } = this.props;
    const { currentIndex, fixedTab, navBarHeight } = this.state;
    const { categories = [], hiddenTabBar } = index;
    const newCategories = this.handleCategories(categories);

    return (
      <>
        {categories?.length > 0 && (
          <>
          <View ref={this.listRef} className={`${!fixedTab ? styles.homeContent : styles.homeContentFix}`} style={{top: `${navBarHeight}px`}}>
            <Tabs
              className={styles.tabsBox}
              scrollable
              type="primary"
              onActive={this.onClickTab}
              activeId={currentIndex}
              external={
                <View onClick={this.searchClick} className={styles.tabIcon}>
                  <Icon name="SecondaryMenuOutlined" className={styles.buttonIcon} size={16} />
                </View>
              }
            >
              {newCategories?.map((item, index) => (
                <Tabs.TabPanel key={index} id={item.pid} label={item.name} />
              ))}
            </Tabs>
          </View>
          {fixedTab &&  (
            <>
             <NavBar isShow={fixedTab} />
             <View className={styles.tabPlaceholder}></View>
            </>
          )}
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
          <View className={styles.homeContentTop}>
            <TopNew data={sticks} itemMargin="1" />
          </View>
        )}
      </>
    );
  };

  renderItem = ({ index, data }) => (
    <View key={index}>
      {index === 0 && this.renderHeaderContent()}
      <ThreadContent data={data[index]} className={styles.listItem} />
    </View>
  );

  render() {
    const { index } = this.props;
    const { filter, isFinished } = this.state;
    const { threads = {}, categories = [] } = index;
    const { currentPage, totalPage, pageData } = threads || {};
    const newCategories = this.handleCategories(categories);

    return (
      <BaseLayout
        showHeader={false}
        showTabBar
        onRefresh={this.onRefresh}
        noMore={currentPage >= totalPage}
        isFinished={isFinished}
        onScroll={this.handleScroll}
        curr='home'
        pageName='home'
        preload={1000}
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
