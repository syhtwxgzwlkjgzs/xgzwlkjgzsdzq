import React from 'react';
import ActiveUsers from '@layout/search/pc/components/active-users';
import SidebarPanel from '@components/sidebar-panel';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';

@inject('search')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    users: null,
  }

  componentDidMount() {
    this.loadData();
  }

  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  }

  onUserClick = ({ userId } = {}) => {
    this.props.router.push(`/user/${userId}`);
  };

  loadData = async () => {
    const res = await this.props.search.getUsersList();
    if (res && res.code === 0 && res.data) {
      this.setState({
        users: res.data,
      });
    }
  }

  render() {
    const { pageData } = this.state.users || {};

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
}

export default withRouter(Index);
