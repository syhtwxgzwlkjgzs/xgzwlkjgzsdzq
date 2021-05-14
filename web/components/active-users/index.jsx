import React from 'react';
import ActiveUsers from '@layout/search/pc/components/active-users'
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

  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  }

  onUserClick = ({ userId } = {}) => {
    this.props.router.push(`/my/others?isOtherPerson=true&otherId=${userId}`);
  };

  loadData = async () => {
    const { pageData = [] } = this.props.search.users || { pageData: [] };
    if (!pageData.length) {
      await this.props.search.getUsersList()
    }
  }

  render () {
    const { pageData } = this.props.search.users || {};

    return (
      <SidebarPanel
        title="活跃用户" 
        onShowMore={this.redirectToSearchResultUser} 
        isLoading={!pageData}
        noData={!pageData?.length}
      >
        <ActiveUsers data={pageData} onItemClick={this.onUserClick}/>
      </SidebarPanel>
    );
  }
};

export default withRouter(Index);
