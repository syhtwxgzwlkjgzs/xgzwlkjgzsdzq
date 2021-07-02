import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import Navigation from './components/navigation';
import QcCode from '@components/qcCode';
import Recommend from '@components/recommend';
import Copyright from '@components/copyright';
import { readThreadList } from '@server';
import deepClone from '@common/utils/deep-clone';
import { handleString2Arr, getSelectedCategoryIds } from '@common/utils/handleCategory';
import DynamicLoading from '@components/dynamic-loading';
import dynamic from 'next/dynamic';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      conNum: 0,
      // visibility: 'hidden',
      isShowDefault: this.checkIsOpenDefaultTab(),
    };

    // 存储最新的数据，以便于点击刷新时，可以直接赋值
    this.newThread = {};
    this.enabledVList = true; // 开启虚拟列表

    // 轮询定时器
    this.timer = null;

    // List组件ref
    this.listRef = React.createRef();

    this.onFilterClick = this.onFilterClick.bind(this);
    this.onPostThread = this.onPostThread.bind(this);
    this.goRefresh = this.goRefresh.bind(this);
    this.onPullingUp = this.onPullingUp.bind(this);
    this.renderLeft = this.renderLeft.bind(this);
    this.renderRight = this.renderRight.bind(this);
  }

  DynamicVListLoading = dynamic(
    () => import('./components/dynamic-vlist'),
    { loading: (res) => {
        return (
            <div style={{width: '100%'}}>
                <DynamicLoading data={res} style={{padding: '0 0 20px 0'}} loadComponent={
                  <div style={{width: '100%'}}>
                    <div className={styles.placeholder}>
                      <div className={styles.header}>
                        <div className={styles.avatar}/>
                        <div className={styles.box}/>
                      </div>
                      <div className={styles.content}/>
                      <div className={styles.content}/>
                      <div className={styles.footer}>
                        <div className={styles.box}/>
                        <div className={styles.box}/>
                        <div className={styles.box}/>
                      </div>
                    </div>
                    <div className={styles.placeholder}>
                      <div className={styles.header}>
                        <div className={styles.avatar}/>
                        <div className={styles.box}/>
                      </div>
                      <div className={styles.content}/>
                      <div className={styles.content}/>
                      <div className={styles.footer}>
                        <div className={styles.box}/>
                        <div className={styles.box}/>
                        <div className={styles.box}/>
                      </div>
                    </div>
                  </div>
                }/>
            </div>
        )
      } }
  )

  componentDidMount() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.handleIntervalRequest();
    }, 30000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  handleIntervalRequest = () => {
    const { filter } = this.props.index;

    const { essence, attention, sort, sequence } = filter;

    const { totalCount: nowTotal = -1 } = this.props.index?.threads || {};

    let newTypes = handleString2Arr(filter, 'types');
    let categoryIds = handleString2Arr(filter, 'categoryids');

    if (nowTotal !== -1) {
      readThreadList({
        params: {
          perPage: 10,
          page: 1,
          filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort },
          sequence,
        },
      }).then((res) => {
        const { totalCount = 0 } = res?.data || {};
        const newConNum = totalCount - nowTotal;
        const { visible = false, conNum = 0 } = this.state;

        if (newConNum > conNum) {
          this.setState({
            visible: true,
            conNum: newConNum,
          });
          // 缓存新数据
          this.newThread = res?.data;
        }
      });
    }
  };

  onSearch = (value) => {
    if (value) {
      this.props.router.push(`/search?keyword=${value || ''}`);
    }
  };

  // 上拉加载更多
  onPullingUp = () => {
    const { dispatch = () => {} } = this.props;

    if (!this.props.index?.threads?.pageData?.length) return; // 火狐浏览器会记录当前浏览位置。防止刷新页面触发载入第二页数据

    return dispatch('moreData');
  };

  onFilterClick = (result) => {
    const {
      sequence,
      filter: { types, sort, essence, attention },
    } = result;

    this.changeFilter({ types, sort, essence, attention, sequence });
  };

  onNavigationClick = ({ categoryIds }) => {
    const categories = this.props.index.categories || [];
    // 获取处理之后的分类id
    const id = categoryIds[0];
    const newCategoryIds = getSelectedCategoryIds(categories, id);

    this.changeFilter({ categoryids: newCategoryIds });
  };

  changeFilter = (params) => {
    const { index, dispatch = () => {} } = this.props;

    if (params) {
      const newFilter = { ...index.filter, ...params };

      index.setFilter(newFilter);
    }

    dispatch('click-filter');

    this.setState({ visible: false });
  };

  goRefresh = () => {
    const { dispatch = () => {} } = this.props;

    if (this.newThread?.pageData?.length) {
      // 若有缓存值，就取缓存值
      dispatch('update-page', { page: 1 });
      this.props.index.setThreads(deepClone(this.newThread));
      // 清空缓存
      this.newThread = {};
      this.setState({
        visible: false,
        conNum: 0,
      });
    } else {
      // 没有缓存值，直接请求网络
      dispatch('refresh-thread').then((res) => {
        this.setState({
          visible: false,
          conNum: 0,
        });
      });
    }
  };

  // 发帖
  onPostThread = () => {
    this.props.router.push('/thread/post');
  };

  // 左侧 -- 分类
  renderLeft = (countThreads = 0) => {
    const { currentCategories, activeCategoryId, activeChildCategoryId, categoryError } = this.props.index;

    return (
      <div className={styles.indexLeft}>
        <div className={styles.indexLeftBox}>
          <Navigation
            categories={currentCategories}
            defaultFisrtIndex={activeCategoryId}
            defaultSecondIndex={activeChildCategoryId}
            totalThreads={countThreads}
            onNavigationClick={this.onNavigationClick}
            isError={categoryError.isError}
            errorText={categoryError.errorText}
          />
        </div>
      </div>
    );
  };
  // 右侧 -- 二维码 推荐内容
  renderRight = (data) => (
    <div className={styles.indexRight}>
      <Recommend />
      <div className={styles.indexRightCon}>
        <QcCode />
      </div>
      <Copyright />
    </div>
  );

  checkIsOpenDefaultTab() {
    return this.props.site.checkSiteIsOpenDefautlThreadListData();
  }

  render() {
    const { index, site } = this.props;
    const { countThreads = 0 } = site?.webConfig?.other || {};
    const { currentPage, totalPage } = index.threads || {};
    const { threadError } = index;
    const { visible, conNum, isShowDefault } = this.state;

    return (
      <BaseLayout
        onSearch={this.onSearch}
        onRefresh={this.onPullingUp}
        noMore={currentPage >= totalPage}
        onScroll={this.onScroll}
        quickScroll={true}
        showRefresh={false}
        left={this.renderLeft(countThreads)}
        right={this.renderRight()}
        pageName="home"
        requestError={threadError.isError}
        errorText={threadError.errorText}
        className="home"
        disabledList={this.enabledVList}
        onRefreshPlaceholder={this.onRefreshPlaceholder}
      >
        <this.DynamicVListLoading
          indexStore={index}
          siteStore={site}
          visible={visible}
          conNum={conNum}
          isShowDefault={isShowDefault}
          onFilterClick={this.onFilterClick}
          onPostThread={this.onPostThread}
          goRefresh={this.goRefresh}
          loadNextPage={this.onPullingUp}
          renderRight={this.renderRight}
          renderLeft={this.renderLeft}
        />
        
      </BaseLayout>
    );
  }
}

export default withRouter(IndexPCPage);

