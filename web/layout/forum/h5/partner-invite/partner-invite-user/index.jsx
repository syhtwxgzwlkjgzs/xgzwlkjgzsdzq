import React from 'react';
import { inject, observer } from 'mobx-react';
import '@discuzq/design/dist/styles/index.scss';
import SectionTitle from '@components/section-title';
import NoData from '@components/no-data';
import { Spin } from '@discuzq/design';
import ActiveUsers from '../../../../search/h5/components/active-users';
import ActiveUsersMore from '../../../../search/pc/components/active-users-more';
import layout from './index.module.scss';

@inject('site')
@inject('index')
@inject('forum')
@inject('search')
@inject('user')
@inject('invite')
@observer
class PartnerInviteUser extends React.Component {
  render() {
    const { site, forum } = this.props;
    const { platform } = site;
    const { usersPageData = [], threadsPageData = [], isLoading } = forum;
    if (platform === 'h5') {
      return (
        <div className={layout.users}>
        <SectionTitle isShowMore={false} icon={{ type: 2, name: 'MemberOutlined' }} title="活跃用户"/>
          {
            !isLoading && usersPageData?.length
              ? <ActiveUsers data={usersPageData} onItemClick={this.onUserClick} />
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
      <div className={layout.pc_users}>
      <SectionTitle className={platform === 'pc' && layout.pc_users_title} isShowMore={false} icon={{ type: 2, name: 'MemberOutlined' }} title="活跃用户" />
        {
          !isLoading && usersPageData?.length
            ? <ActiveUsersMore data={usersPageData} onItemClick={this.onUserClick} noOperation/>
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
    );
  }
}

export default PartnerInviteUser;
