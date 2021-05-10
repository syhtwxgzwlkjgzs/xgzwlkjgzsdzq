import React, { createRef }from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Tabs } from '@discuzq/design';
import ThreadContent from '@components/thread';
import HomeHeader from '@components/home-header';
import NoData from '@components/no-data';
import styles from './index.module.scss';
import List from '@components/list';
import TopNew from './components/top-news';
import ButtomNavBar from '@components/bottom-nav-bar';
import FilterView from './components/filter-view';
import BaseLayout from '@components/base-layout';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      filter: {},
      currentIndex: '',
      scroll: true,
    };
    this.listRef = createRef();
    this.renderItem = this.renderItem.bind(this);
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
  
  onScroll = ({ scrollTop }) => {
    const el = this.listRef.current.offsetTop;

    if (scrollTop >= el) {
      this.setState({
        scroll: false,
      })
    }
    if (scrollTop < 160) {
      this.setState({
        scroll: true,
      })
    }
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

  renderHeaderContent = (scroll) => {
    const { index } = this.props;
    const { currentIndex } = this.state;
    const { sticks = [], categories = [] } = index;
    const newCategories = this.handleCategories(categories);

    return (
      <div>
        <HomeHeader/>
        {categories?.length > 0 && <div ref={this.listRef} className={scroll ? styles.homeContent : styles.homeContentText}>
          <Tabs
            className={styles.tabsBox}
            scrollable
            type='primary'
            onActive={this.onClickTab}
            activeId={currentIndex}
            tabBarExtraContent={
              <div onClick={this.searchClick} className={styles.tabIcon}>
                <Icon name="SecondaryMenuOutlined" className={styles.buttonIcon}  size={16}/>
              </div>
            }
          >
            {
              newCategories?.map((item, index) => (
                <Tabs.TabPanel
                  key={index}
                  id={item.pid}
                  label={item.name}
                />
              ))
            }
          </Tabs>
        </div>}
        {sticks && sticks.length > 0 && <div className={styles.homeContentTop}>
          <TopNew data={sticks} itemMargin='1'/>
        </div>}
      </div>
    );
  }

  renderItem = ({ index, data }) => (
    <div key={index}>
      { index === 0 && this.renderHeaderContent()}
      <ThreadContent data={data[index]} className={styles.listItem} />
    </div>
  )

  // 没有帖子列表数据时的默认展示
  renderNoData = () => (
    <>
      {this.renderHeaderContent(true)}
      <NoData />
    </>
  )


  render() {
    const { index } = this.props;
    const { filter, scroll } = this.state;
    const { threads = {}, categories = [] } = index;
    const { currentPage, totalPage, pageData } = threads || {};
    const newCategories = this.handleCategories(categories);

    return (
      <BaseLayout
        showHeader={false}
        showTabBar
        onPullDown={() => { console.log(123456); }}
        onRefresh={this.onRefresh}
        noMore={currentPage >= totalPage}
        onScroll={this.onScroll}
      >
          { pageData?.length > 0
            ? (
              pageData.map((item, index) => (
                <div key={index}>
                  { index === 0 && this.renderHeaderContent(scroll)}
                  <ThreadContent data={item} className={styles.listItem} />
                </div>
              ))
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
      </BaseLayout>
      // <div className={styles.container}>
      //   { pageData?.length > 0
      //     ? (
      //       <List
      //         className={styles.list}
      //         onRefresh={this.onRefresh}
      //         noMore={currentPage >= totalPage}
      //         onScroll={this.onScroll}
      //       >
      //         {
      //           pageData.map((item, index) => (
      //             <div key={index}>
      //               { index === 0 && this.renderHeaderContent(scroll)}
      //               <ThreadContent data={item} className={styles.listItem} />
      //             </div>
      //           ))
      //         }
      //       </List>
      //     )
      //     : this.renderNoData()
      //   }

      //   <FilterView
      //     data={newCategories}
      //     current={filter}
      //     onCancel={this.onClose}
      //     visible={this.state.visible}
      //     onSubmit={this.onClickFilter}
      //   />
      //  <ButtomNavBar placeholder/>
      // </div>
    );
  }
}
export default IndexH5Page;
