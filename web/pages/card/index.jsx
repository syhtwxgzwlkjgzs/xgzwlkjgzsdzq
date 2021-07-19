import React from 'react';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import SiteCard from '../../layout/card/siteCard';
import ThreadCard from '../../layout/card/threadCard';
class CreateCard extends React.Component {
  render() {
    const { router } = this.props;
    const { from } = router?.query;
    return (
        <div>
          {from === 'header' ? <SiteCard></SiteCard> : <ThreadCard></ThreadCard>}
        </div>
    );
  }
}
// eslint-disable-next-line new-cap
export default HOCFetchSiteData(CreateCard);
