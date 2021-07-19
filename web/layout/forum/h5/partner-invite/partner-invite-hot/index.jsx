import React from 'react';
import { inject, observer } from 'mobx-react';
import '@discuzq/design/dist/styles/index.scss';
import { Spin, Toast } from '@discuzq/design';
import ThreadContent from '@components/thread';
import layout from './index.module.scss';
import NoData from '@components/no-data';
import SectionTitle from '@components/section-title';
import PopularContents from '../../../../search/h5/components/popular-contents';

const MAX_THREAD_COUNT = 10

@inject('site')
@inject('index')
@inject('forum')
@inject('search')
@inject('user')
@inject('invite')
@observer
class PartnerInviteHot extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      errText: '暂无数据',
      isHot: false, // 是否是热门内容列表
    }
  }

  async componentDidMount() {
    const { forum, search } = this.props;
    try {
      await this.initThreadList();
      this.setState({isLoading: false})
    } catch (e) {
      this.setState({
        isLoading: false,
        errText: e?.Message || e
      })
      Toast.error({
        content: e?.Message || e,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  async initThreadList() {
    const { forum, search } = this.props;

    // 1.获取后台设置的付费推荐内容，最多10条。pay===1时，后台默认返回10条，无法修改
    const threadList = await search.getThreadList({
      site: 1, // 后台设置的热门推荐
      params: {
        pay: 1,
      },
    });

    // 2.推荐内容数量大于0则title为精彩内容预览，否则为热门内容预览
    this.setState({
      isHot: !(threadList?.pageData?.length > 0),
    });

    // 3.如果付费推荐少于MAX_THREAD_COUNT条，取热门推荐，凑齐MAX_THREAD_COUNT条
    if (threadList?.pageData?.length < MAX_THREAD_COUNT) {
      const repeatedIds = threadList?.pageData?.map(item => item.threadId);
      const hotThreads = await search.getThreadList({
        repeatedIds,
        params: {
          pay: 1,
        },
      });

      threadList?.pageData?.push(...hotThreads?.pageData?.slice(0, MAX_THREAD_COUNT - threadList?.pageData?.length));
    }

    forum.setThreadsPageData(threadList);
  }

  render() {
    const { site, forum, unifyOnClick } = this.props;
    const { platform } = site;
    const { threadsPageData = [] } = forum;
    const { isLoading, errText, isHot } = this.state;

    const icon = { type: 3, name: isHot ? 'HotOutlined' : 'WonderfulOutlined' };
    const title = `${isHot ? '热门' : '精彩'}内容预览`

    if (platform === 'h5') {
      return (
        <div className={layout.hot}>
          <SectionTitle isShowMore={false} icon={icon} title={title} onShowMore={this.redirectToSearchResultPost} />
          {
            !isLoading && threadsPageData?.length
              ? <PopularContents data={threadsPageData} unifyOnClick={unifyOnClick} />
              : <></>
          }
          {
            !isLoading && !threadsPageData?.length
              ? <NoData />
              : <></>
          }
          {
            isLoading
              ? <div className={layout.spinner}>
                  <Spin type="spinner" />
                </div>
              : <></>
          }
        </div>
      )
    }
    return (
      <div className={layout.pc_hot}>
        <div className={layout.pc_hot_title}>
          <SectionTitle titleStyle={{padding: '24px 0'}} isShowMore={false} icon={icon} title={title} onShowMore={this.redirectToSearchResultPost} />
        </div>
        {
          threadsPageData?.length
            ? threadsPageData.map((item, index) => (
              <ThreadContent unifyOnClick={unifyOnClick} className={layout.threadContent} data={item} key={index} />
            ))
            : <></>
        }
        {
          !isLoading && !threadsPageData?.length
            ? <NoData text={errText}/>
            : <></>
        }
        {
          isLoading
            ? <div className={layout.spinner}>
                <Spin type="spinner" />
              </div>
            : <></>
        }
      </div>

    );
  }
}

export default PartnerInviteHot;
