import React, { createRef } from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Tabs } from '@discuzq/design';
import ThreadContent from '@components/thread';
import HomeHeader from '@components/home-header';
import NoData from '@components/no-data';
import styles from './index.module.scss';
import List from '@components/list';
import TopNew from './components/top-news';
import Tabbar from './components/tabbar';
import FilterView from './components/filter-view';
import { View, Text } from '@tarojs/components';
import PayBox from '@components/payBox'
import NavBar from './components/nav-bar'
import Taro from '@tarojs/taro';


@inject('site')
@inject('user')
@inject('index')
@observer
class IndexMiniPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      filter: {},
      currentIndex: '',
      fixedTab: false,
      showNavBar: false,
      navBarHeight: 64
    };
    this.renderItem = this.renderItem.bind(this);
  }
  
  navBarRef = React.createRef(null)

  componentDidMount() {
    try {
      const res = Taro.getSystemInfoSync()
      const height = res?.statusBarHeight || 20
      this.setState({
        navBarHeight: height + 44
      })
    } catch (e) {
      // Do something when catch error
    }
  }

  onScroll = (e) => {
    const { scrollTop = 0 } = e?.detail || {}
    this.setState({
      fixedTab: !(scrollTop < 160),
      showNavBar: !(scrollTop < 160),
    })

  }
  // 点击更多弹出筛选
  searchClick = () => {
    this.setState({
      visible: true,
    });
  }
  // 关闭筛选框
  onClose = () => {
    this.setState({
      visible: false,
    });
  }

  onClickTab = (id = '') => {
    const { dispatch = () => {} } = this.props;
    dispatch('click-filter', { categoryids: [id] });

    this.setState({
      filter: {
        categoryids: [id],
      },
      currentIndex: id,
      visible: false,
      showNavBar: false,
      fixedTab: false,
    });
  }

  // 筛选弹框点击筛选按钮后的回调：categoryids-版块 types-类型 essence-筛选
  onClickFilter = ({ categoryids, types, essence, sequence }) => {
    const { dispatch = () => {} } = this.props;

    dispatch('click-filter', { categoryids, types, essence, sequence });
    this.setState({
      filter: {
        categoryids,
        types,
        essence,
      },
      currentIndex: categoryids[0],
      visible: false,
    });
  }

  // 上拉加载更多
  onRefresh = () => {
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

  renderHeaderContent = (fixedTab = false) => {
    const { index } = this.props;
    const { currentIndex } = this.state;
    const { sticks = [] } = index;
    const newCategories = this.handleCategories();
    
    return (
      <View>
        <HomeHeader/>
        {newCategories?.length > 0 && (
            <View 
              className={!fixedTab ? styles.homeContent : styles.homeContentText}
              style={{top: !fixedTab ? '' : `${this.state.navBarHeight}px`}}
            >
            <Tabs
              className={styles.tabsBox}
              scrollable
              type='primary'
              onActive={this.onClickTab}
              activeId={currentIndex}
              external={
                <View onClick={this.searchClick} className={styles.tabIcon}>
                  <Icon className={styles.moreIcon} name="SecondaryMenuOutlined" />
                </View>
              }
            >
              {
                newCategories.map((item, index) => (
                  <Tabs.TabPanel
                    key={index}
                    id={item.pid}
                    label={item.name}
                  />
                ))
              }
            </Tabs>
          </View>
        )}
        {sticks && sticks.length > 0 && <View className={styles.homeContent}>
          <TopNew data={sticks}/>
        </View>}
      </View>
    );
  }

  renderItem = ({ index, data }) => (
    <View key={index}>
      { index === 0 && this.renderHeaderContent()}
      <ThreadContent data={data[index]} className={styles.listItem} />
    </View>
  )

  // 没有帖子列表数据时的默认展示
  renderNoData = () => (
    <>
      {this.renderHeaderContent()}
      <NoData />
    </>
  )


  render() {
    const { index, site } = this.props;
    const { filter , fixedTab, showNavBar } = this.state;
    const { threads = {} } = index;
    const { webConfig } = site
    const { currentPage, totalPage, pageData } = threads || {};
    const newCategories = this.handleCategories() 

    return (
      <View className={styles.container}>
        <NavBar ref={this.navBarRef} title={webConfig?.setSite?.siteName} isShow={showNavBar} />
        { pageData?.length > 0
          ? (
            <List
              className={styles.list}
              onRefresh={this.onRefresh}
              noMore={currentPage >= totalPage}
              onScroll={this.onScroll}
            >
             {
                pageData.map((item, index) => (
                  <View key={index}>
                    { index === 0 && this.renderHeaderContent(fixedTab)}
                    <ThreadContent data={item} className={styles.listItem} />
                  </View>
                ))
              }
            </List>
          )
          : this.renderNoData()
        }

        <FilterView
          data={newCategories}
          current={filter}
          onCancel={this.onClose}
          visible={this.state.visible}
          onSubmit={this.onClickFilter}
        />
       <Tabbar placeholder />
       <PayBox />
      </View>
    );
  }
}
export default IndexMiniPage;
