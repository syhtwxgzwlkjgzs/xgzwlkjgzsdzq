import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import NewContent from './components/new-content';
import TopMenu from './components/top-menu';
import TopNews from '../h5/components/top-news';
import Navigation from './components/navigation';
import QcCode from '@components/qcCode';
import Recommend from '@components/recommend';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import { readThreadList } from '@server';
import { Button } from '@discuzq/design';
import deepClone from '@common/utils/deep-clone';
import { handleString2Arr, getSelectedCategoryIds } from '@common/utils/handleCategory';
import WindowVList from '@components/virtual-list/pc/pc-window-scroll';

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

    this.enabledVList = true; // 开启虚拟列表
    this.onRefreshPlaceholder = this.onRefreshPlaceholder.bind(this);

    // 存储最新的数据，以便于点击刷新时，可以直接赋值
    this.newThread = {};

    // 轮询定时器
    this.timer = null;

    // List组件ref
    this.listRef = React.createRef();
  }

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

  // 中间 -- 筛选 置顶信息 是否新内容发布 主题内容
  renderContent = (data) => {
    const { visible, conNum, isShowDefault } = this.state;
    const { sticks, threads } = data;
    const { pageData } = threads || {};
    return (
      <div className={styles.indexContent}>
        <TopFilterView
          onFilterClick={this.onFilterClick}
          onPostThread={this.onPostThread}
          isShowDefault={isShowDefault}
        />

        <div className={styles.contnetTop}>
          {sticks?.length > 0 && (
            <div className={`${styles.TopNewsBox} ${!visible && styles.noBorder}`}>
              <TopNews data={sticks} platform="pc" isShowBorder={false} />
            </div>
          )}
          {visible && (
            <div className={styles.topNewContent}>
              <NewContent visible={visible} conNum={conNum} goRefresh={this.goRefresh} />
            </div>
          )}
        </div>
        <div className={styles.themeBox}>
          <div className={styles.themeItem}>
            {pageData?.map((item, index) => (
              <ThreadContent
                key={`${item.threadId}-${item.createdAt || ''}-${item.updatedAt || ''}`}
                className={styles.threadContent}
                data={item}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  renderVlist = (data) => {
    const { visible, conNum, isShowDefault } = this.state;
    const { sticks, threads } = data;
    const { pageData } = threads || {};
    const { index, site } = this.props;
    const { countThreads = 0 } = site?.webConfig?.other || {};

    return (
      <WindowVList
        list={pageData}
        sticks={sticks}
        platform="pc"
        pageName="home"
        // onScroll={this.handleScroll}
        loadNextPage={this.onPullingUp}
        // noMore={currentPage >= totalPage}
        // requestError={this.props.isError}
        left={this.renderLeft(countThreads)}
        right={this.renderRight()}
        renderItem={(item, index, recomputeRowHeights, onContentHeightChange, measure) => (
          <ThreadContent
            onContentHeightChange={measure}
            onImageReady={measure}
            onVideoReady={measure}
            key={`${item.threadId}-${item.updatedAt}`}
            data={item}
            className={styles.listItem}
            recomputeRowHeights={measure}
          />
        )}
      >
        <div className={styles.indexContent}>
          <TopFilterView
            onFilterClick={this.onFilterClick}
            onPostThread={this.onPostThread}
            isShowDefault={isShowDefault}
            ishide={true}
          />

          <div className={styles.contnetTop}>
            {sticks?.length > 0 && (
              <div className={`${styles.TopNewsBox} ${!visible && styles.noBorder}`}>
                <TopNews data={sticks} platform="pc" isShowBorder={false} />
              </div>
            )}
            {visible && (
              <div className={styles.topNewContent}>
                <NewContent visible={visible} conNum={conNum} goRefresh={this.goRefresh} />
              </div>
            )}
          </div>
        </div>
      </WindowVList>
    );
  };

  RefreshPlaceholderBox(key) {
    return (
      <div key={key} className={styles.placeholder}>
        <div className={styles.header}>
          <div className={styles.avatar} />
          <div className={styles.box} />
        </div>
        <div className={styles.content} />
        <div className={styles.content} />
        <div className={styles.footer}>
          <div className={styles.box} />
          <div className={styles.box} />
          <div className={styles.box} />
        </div>
      </div>
    );
  }

  onRefreshPlaceholder() {
    return [1, 2].map((item, key) => {
      return this.RefreshPlaceholderBox(key);
    });
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
        {this.enabledVList ? (
          <Fragment>
            <div className={styles.topFixed}>
              <div className={styles.emptyBox}></div>
              <TopFilterView
                onFilterClick={this.onFilterClick}
                onPostThread={this.onPostThread}
                isShowDefault={isShowDefault}
              />
            </div>
            {this.renderVlist(index)}
          </Fragment>
        ) : (
          this.renderContent(index)
        )}
      </BaseLayout>
    );
  }
}

export default withRouter(IndexPCPage);

const TopFilterView = ({ onFilterClick, isShowDefault, onPostThread, ishide }) => {
  return (
    <div className={styles.topWrapper} style={{ visibility: ishide ? 'hidden' : 'visible' }}>
      <div className={styles.topBox}>
        <TopMenu onSubmit={onFilterClick} isShowDefault={isShowDefault} />
        <div className={styles.PostTheme}>
          <Button type="primary" className={styles.publishBtn} onClick={onPostThread}>
            发布
          </Button>
        </div>
      </div>
    </div>
  );
};
