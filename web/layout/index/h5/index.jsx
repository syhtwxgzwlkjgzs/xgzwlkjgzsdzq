import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import { Button, Upload, Tabs, Popup } from '@discuzq/design';
import ThreadContent from '@components/thread';
import HomeHeader from '@components/thread/home-header';
import NoData from '@components/no-data';
import styles from './index.module.scss';
import List from './components/list';
import TopNew from './components/top-news';
import Tabbar from './components/tabbar';
import FilterView from './components/filter-view';
import PayBox from '@components/payBox';

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
    };
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

  onClickTab = (id) => {
    const { dispatch = () => {} } = this.props;
    dispatch('', { categoryids: [id] });

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

    dispatch('', { categoryids, types, essence, sequence });
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

  renderHeaderContent() {
    const { index, site } = this.props;

    const { sticks, categories } = index;

    const { siteBackgroundImage, siteLogo } = site?.webConfig?.setSite;
    const { countUsers, countThreads } = site?.webConfig?.other;
    return (
      <div>
        <HomeHeader
          bgHeadFullImg={siteBackgroundImage}
          headImg={siteLogo}
          userNum={countUsers}
          themeNum={countThreads}
        />
        <div className={styles.homeContent}>
          <Tabs
            scrollable={true}
            type={'primary'}
            onActive={this.onClickTab}
            activeId={this.state.currentIndex}
            tabBarExtraContent={
              <div
                style={{
                  width: 70,
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button onClick={this.searchClick}>更多</Button>
              </div>
          }
          >
              {categories.map((item, index) => (
              <Tabs.TabPanel
                key={index}
                id={item.pid}
                label={item.name}
               />
              ))}
          </Tabs>
        </div>
        <div className={styles.homeContent}>
          <TopNew data={sticks}/>
        </div>
      </div>
    );
  }

  renderItem(dataList, rowData) {
    return (
      <div>
        { dataList.index === 0 && this.renderHeaderContent()}
        <ThreadContent data={dataList.data[dataList.index]}/>
      </div>
    );
  }

  renderList(data) {
    const { index } = this.props;
    const { threads } = index;
    return (
      data?.length
        ? <List
          onRefresh={this.onRefresh}
          refreshing={false}
          data={threads.pageData}
          renderItem={this.renderItem}
        />
        : <NoData />
    );
  }

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
    const { threads, categories } = index;

    return (
      <div className={styles.homeBox}>
        { threads?.pageData?.length > 0
          ? this.renderList(threads?.pageData)
          : this.renderNoData()
        }

        <FilterView
          data={categories}
          current={filter}
          onCancel={this.onClose}
          visible={this.state.visible}
          onSubmit={this.onClickFilter}
        />
       <Tabbar/>
       <PayBox />
      </div>
    );
  }
}
export default IndexH5Page;
