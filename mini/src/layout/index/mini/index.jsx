import React from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Tabs } from '@discuzq/design';
import ThreadContent from '@components/thread';
import HomeHeader from '@components/home-header';
import NoData from '@components/no-data';
import styles from './index.module.scss';
import List from './components/list';
import TopNew from './components/top-news';
import Tabbar from './components/tabbar';
import FilterView from './components/filter-view';
import { View, Text } from '@tarojs/components';

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
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    console.log(this.props.user);
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
  onPullingUp = () => {
    const { dispatch = () => {} } = this.props;
    const { filter } = this.state;
    return dispatch('moreData', filter);
  }

  renderHeaderContent = () => {
    const { index } = this.props;
    const { currentIndex } = this.state;
    const { sticks = [], categories = [] } = index;

    return (
      <View>
        {/* <HomeHeader/> */}
        {categories && categories.length > 0 && <View className={styles.homeContent}>
          <Tabs
            scrollable
            type='primary'
            onActive={this.onClickTab}
            activeId={currentIndex}
            tabBarExtraContent={
              <View onClick={this.searchClick} className={styles.tabIcon}>
                <Icon name="SecondaryMenuOutlined" />
              </View>
            }
          >
            {
              categories.map((item, index) => (
                <Tabs.TabPanel
                  key={index}
                  id={item.pid}
                  label={item.name}
                />
              ))
            }
          </Tabs>
        </View>}
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
    const { index } = this.props;
    const { filter } = this.state;
    const { threads = {}, categories = [] } = index;
    const { currentPage, totalPage, pageData } = threads || {};
    console.log(index, '数据');
    return (
      <View className={styles.container}>
        {/* { pageData?.length > 0
          ? (
            <List
              className={styles.list}
              onRefresh={this.onRefresh}
              refreshing={false}
              data={pageData}
              renderItem={this.renderItem}
              onPullingUp={this.onPullingUp}
              noMore={currentPage >= totalPage}
            />
          )
          : this.renderNoData()
        } */}

        <FilterView
          data={categories}
          current={filter}
          onCancel={this.onClose}
          visible={this.state.visible}
          onSubmit={this.onClickFilter}
        />
       <Tabbar placeholder />
       {/* <ThreadContent /> */}
      </View>
    );
  }
}
export default IndexMiniPage;
