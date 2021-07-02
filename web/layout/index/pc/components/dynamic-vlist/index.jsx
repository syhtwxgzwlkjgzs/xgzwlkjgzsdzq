import React from 'react';
import NewContent from '../new-content';
import TopNews from '../../../h5/components/top-news';
import TopMenu from '../top-menu';
import { Button } from '@discuzq/design';
import ThreadContent from '@components/thread';
import WindowVList from '@components/virtual-list/pc/pc-window-scroll';
import VList from '@components/virtual-list/pc/pc-scroll';
import styles from './index.module.scss';

const TopFilterView = ({ onFilterClick, isShowDefault, onPostThread }) => {
    return (
      <div className={styles.topWrapper}>
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

export default class DynamicVList extends React.Component {
    constructor(props) {
        super(props);
        this.enabledVList = false; // 开启虚拟列表
        this.enabledWindowScroll = false; // 开启window滚动
    }

    // 中间 -- 筛选 置顶信息 是否新内容发布 主题内容
    renderContent = (data) => {
        const { visible, conNum, isShowDefault, onFilterClick, onPostThread, goRefresh } = this.props;
        const { sticks, threads } = data;
        const { pageData } = threads || {};
        return (
            <div className={styles.indexContent}>
                <TopFilterView
                    onFilterClick={onFilterClick}
                    onPostThread={onPostThread}
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
                        <NewContent visible={visible} conNum={conNum} goRefresh={goRefresh} />
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
        const { visible, conNum, isShowDefault, onFilterClick, onPostThread, goRefresh, loadNextPage, renderRight, renderLeft } = this.props;
        const { sticks, threads } = data;
        const { pageData } = threads || {};
        const { siteStore } = this.props;
        const { countThreads = 0 } = siteStore?.webConfig?.other || {};
    
        return this.enabledWindowScroll ? (
          <WindowVList
            list={pageData}
            sticks={sticks}
            platform="pc"
            pageName="home"
            loadNextPage={loadNextPage}
            left={() => renderLeft(countThreads)}
            right={() => renderRight()}
            renderItem={(item, index, recomputeRowHeights, onContentHeightChange, measure) => (
              <ThreadContent
                onContentHeightChange={measure}
                onImageReady={measure}
                onVideoReady={measure}
                key={`${item.threadId}-${item.updatedAt}`}
                data={item}
                recomputeRowHeights={measure}
              />
            )}
          >
            <div className={styles.indexContent}>
              <TopFilterView
                onFilterClick={onFilterClick}
                onPostThread={onPostThread}
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
                    <NewContent visible={visible} conNum={conNum} goRefresh={goRefresh} />
                  </div>
                )}
              </div>
            </div>
          </WindowVList>
        ) : (
          <VList
            list={pageData}
            sticks={sticks}
            platform="pc"
            pageName="home"
            loadNextPage={loadNextPage}
            left={() => renderLeft(countThreads)}
            right={() => renderRight()}
            renderItem={(item, index, recomputeRowHeights, onContentHeightChange, measure) => (
              <ThreadContent
                onContentHeightChange={measure}
                onImageReady={measure}
                onVideoReady={measure}
                key={index}
                data={item}
                recomputeRowHeights={measure}
              />
            )}
          >
            <div className={styles.indexContent}>
              <TopFilterView
                onFilterClick={onFilterClick}
                onPostThread={onPostThread}
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
                    <NewContent visible={visible} conNum={conNum} goRefresh={goRefresh} />
                  </div>
                )}
              </div>
            </div>
          </VList>
        );
    };

    render() {
        const { indexStore } = this.props;
        return this.enabledVList ? this.renderVlist(indexStore) : this.renderContent(indexStore);

    }
}
