import React from 'react';
import TrendingTopic from '@layout/search/pc/components/trending-topics'
import SidebarPanel from '@components/sidebar-panel';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';

@inject('search')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadData()
  }

  onTopicClick = ({ topicId } = {}) => {
    this.props.router.push(`/topic/topic-detail/${topicId}`);
  }

  loadData = async () => {
    const { pageData = [] } = this.props.search.topics || { pageData: [] };
    if (!pageData.length) {
      await this.props.search.getTopicsList();
    }
  }

  redirectToSearchResultTopic = () => {
    this.props.router.push('/search/result-topic');
  };

  render () {
    const { pageData } = this.props.search.topics || {};

    return (
      <SidebarPanel 
        title="潮流话题"
        isLoading={!pageData}
        noData={!pageData.length} 
        onShowMore={this.redirectToSearchResultTopic}
      >
          <TrendingTopic data={pageData?.filter((_, index) => index < 10)} onItemClick={this.onTopicClick}/>
      </SidebarPanel>
    );
  }
};

export default withRouter(Index);
