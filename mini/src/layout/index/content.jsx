import React, { createRef } from 'react';
import { inject, observer } from 'mobx-react';
import Icon from '@discuzq/design/dist/components/icon/index';
import Tabs from '@discuzq/design/dist/components/tabs/index';
import { View } from '@tarojs/components'
import ThreadContent from '../../components/thread';
import HomeHeader from '../../components/home-header';
import FilterView from './components/filter-view';
import BaseLayout from '../../components/base-layout';
import TopNew from './components/top-news';
import NavBar from './components/nav-bar';
import { getSelectedCategoryIds } from '@common/utils/handleCategory';
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
      filter: {},
      currentIndex: 'all',
      isFinished: true,
      fixedTab: false,
      navBarHeight: 64,
    };
    this.listRef = createRef();
    this.headerRef = createRef(null);
  }

  componentDidMount() {
    let navBarHeight = 64
    try {
      const res = Taro.getSystemInfoSync()
      const height = res?.statusBarHeight || 20
      navBarHeight = 44 + height
    } catch (e) {
      // Do something when catch error
    }

    this.setState({ navBarHeight })
  }

  // 点击更多弹出筛选
  searchClick = () => {
    this.props.index.setHiddenTabBar(true)

    this.setState({ visible: true });
  };
  // 关闭筛选框
  onClose = () => {
    this.props.index.setHiddenTabBar(false)

    this.setState({ visible: false });
  };

  onClickTab = (id = '') => {
    this.changeFilter({ categoryids: [id], sequence: id === 'default' ? 1 : 0 })
  };

  changeFilter = (params) => {
    this.props.baselayout.setJumpingToTop();
    this.props.index.setHiddenTabBar(false)

    const { index, dispatch = () => {} } = this.props

    if (params) {
      const { categoryids } = params
      const categories = index.categories || [];

      // 获取处理之后的分类id
      const id = categoryids[0]
      const newCategoryIds = getSelectedCategoryIds(categories, id)

      const newFilter = { ...index.filter, ...params, categoryids: newCategoryIds };

      index.setFilter(newFilter);
    }

    dispatch('click-filter');

    this.setState({ visible: false });
  }

  // 上拉加载更多
  onRefresh = () => {
    const { dispatch = () => {} } = this.props;
    return dispatch('moreData');
  };

  handleScroll = (e) => {
      const { scrollTop = 0 } = e?.detail || {};
      const { height = 121 } = this.headerRef.current?.state || {};
      const { fixedTab } = this.state;
      
      // 只需要滚到临界点触发setState，而不是每一次滚动都触发
      if(!fixedTab && scrollTop >= height) {
        this.setState({ fixedTab: true })
      } else if(fixedTab && scrollTop < height) {
        this.setState({ fixedTab: false })
      }
    }

  renderTabs = () => {
    const { index, site } = this.props;
    const { fixedTab, navBarHeight } = this.state;
    const { categories = [], activeCategoryId, currentCategories } = index;

    return (
      <>
        {categories?.length > 0 && (
          <>
          <View 
            ref={this.listRef}
            className={`${styles.homeContent} ${fixedTab && styles.fixed}`}
            style={{top: `${navBarHeight}px`}}
          >
            <Tabs
              className={styles.tabsBox}
              scrollable
              type="primary"
              onActive={this.onClickTab}
              activeId={activeCategoryId}
              external={
                <View onClick={this.searchClick} className={styles.tabIcon}>
                  <Icon name="SecondaryMenuOutlined" className={styles.buttonIcon} size={16} />
                </View>
              }
            >
              {currentCategories?.map((item, index) => (
                <Tabs.TabPanel key={index} id={item.pid} label={item.name} />
              ))}
            </Tabs>
          </View>
          {fixedTab &&  (
            <>
             <NavBar title={site?.webConfig?.setSite?.siteName || ''} isShow={fixedTab} />
             <View className={styles.tabPlaceholder}></View>
            </>
          )}
          </>
        )}
      </>
    );
  };

  renderHeaderContent = () => {
    const { sticks = [] } = this.props.index || {};

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

  render() {
    const { index, user } = this.props;
    const { isFinished } = this.state;
    const { threads = {}, currentCategories, filter } = index;
    const { currentPage, totalPage, pageData } = threads || {};

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
        errorText={this.props.errorText}
      >
        <HomeHeader ref={this.headerRef} />

        {this.renderTabs()}

        {this.renderHeaderContent()}

        {pageData?.map((item, index) => (
            <ThreadContent
              key={index}
              showBottomStyle={index !== pageData.length - 1}
              data={item}
              className={styles.listItem}
            />
          ))}

        <FilterView
          data={currentCategories}
          current={filter}
          onCancel={this.onClose}
          visible={this.state.visible}
          onSubmit={this.changeFilter}
          permissions={user.threadExtendPermissions}
        />
      </BaseLayout>
    );
  }
}

export default IndexH5Page;