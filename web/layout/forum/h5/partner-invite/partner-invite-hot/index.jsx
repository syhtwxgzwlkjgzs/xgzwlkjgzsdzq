import React from 'react';
import { inject, observer } from 'mobx-react';
import '@discuzq/design/dist/styles/index.scss';
import { Spin, Toast } from '@discuzq/design';
import ThreadContent from '@components/thread';
import layout from './index.module.scss';
import NoData from '@components/no-data';
import SectionTitle from '@components/section-title';
import PopularContents from '../../../../search/h5/components/popular-contents';

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
      errText: '暂无数据'
    }
  }
  async componentDidMount() {
    const { forum, search } = this.props;
    try {
      const threadList = await search.getThreadList();
      forum.setThreadsPageData(threadList);
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

  render() {
    const { site, forum } = this.props;
    const { platform } = site;
    const { isLoading, errText } = this.state;
    const { threadsPageData = [] } = forum;
    if (platform === 'h5') {
      return (
        <div className={layout.hot}>
          <SectionTitle isShowMore={false} icon={{ type: 3, name: 'HotOutlined' }} title="热门内容预览" onShowMore={this.redirectToSearchResultPost} />
          {
            !isLoading && threadsPageData?.length
              ? <PopularContents data={threadsPageData} onItemClick={this.onPostClick} />
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
          <SectionTitle titleStyle={{padding: '24px 0'}} isShowMore={false} icon={{ type: 3, name: 'HotOutlined' }} title="热门内容预览" onShowMore={this.redirectToSearchResultPost} />
        </div>
        {
          threadsPageData?.length
            ? threadsPageData.map((item, index) => (
              <ThreadContent className={layout.threadContent} data={item} key={index} />
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
