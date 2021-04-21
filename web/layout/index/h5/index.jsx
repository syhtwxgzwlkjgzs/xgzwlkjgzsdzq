import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import { Button, Upload, Tabs, Popup } from '@discuzq/design';
import ThreadContent from '@components/thread';
import HomeHeader from '@components/thread/home-header';
import styles from './index.module.scss';
import List from './components/list';
import TopNew from './components/top-news';
import FilterModalPopup from './components/filter-modal-popup';
import filterData from './data';
import Tabbar from './components/tabbar';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexH5Page extends React.Component {
  state = { visible: false };
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
  // 筛选数据
  screenClick = (classification, topicType, parameter) => {
    console.log(classification, topicType, parameter, '筛选值');
  }
  render() {
    console.log(this.state);
    const { index, user } = this.props;
    const { sticks, threads, categories } = index;
    const HeaderContent = () => (
          <>
            <HomeHeader/>
            <div className={styles.homeContent}>
              <Tabs
                scrollable={true}
                type={'primary'}
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
                  <Tabs.TabPanel key={index} id={item.pid} label={item.name}>
                  </Tabs.TabPanel>
                  ))}
              </Tabs>
            </div>
            <div className={styles.homeContent}>
              <TopNew data={sticks}/>
            </div>
          </>
    );
    const renderItem = (dataList, rowData) => (
        <div>
          { dataList.index === 0 && <HeaderContent />}
          <ThreadContent data={dataList.data[dataList.index]}/>
        </div>
    );
    return (
      <div className={styles.homeBox}>
        { threads.pageData.length > 0
          ? <List
          onRefresh={this.onRefresh}
          refreshing={false}
          data={threads.pageData}
          renderItem={renderItem}
        />
          : <HeaderContent />
       }
       <FilterModalPopup parent={this} visible={this.state.visible} onClose={this.onClose} filterData={filterData}></FilterModalPopup>
       <Tabbar />
      </div>
    );
  }
}
export default IndexH5Page;
