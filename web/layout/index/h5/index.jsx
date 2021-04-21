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
import FilterModalPopup from './components/filter-modal-popup';
import filterData from './data';
import Tabbar from './components/tabbar';
// import PayBox from '@components/payBox';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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

  renderHeaderContent() {
    const { index } = this.props;
    const { sticks, categories } = index;
    return (
      <div>
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


  render() {
    const { index } = this.props;
    const { threads } = index;

    return (
      <div className={styles.homeBox}>
        { threads?.pageData?.length > 0
          ? this.renderList(threads?.pageData)
          : this.renderHeaderContent()
        }
       <FilterModalPopup visible={this.state.visible} onClose={this.onClose} filterData={filterData}></FilterModalPopup>
       <Tabbar/>
      </div>
    );
  }
}
export default IndexH5Page;
