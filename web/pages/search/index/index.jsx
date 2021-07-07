import React from 'react';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithLogin from '@middleware/HOCWithLogin';
import Router from '@discuzq/sdk/dist/router';
class SearchReplace extends React.Component {
  componentDidMount() {
    Router.replace({url: '/search'})
  }

  render() {
    return null;
  }
}

export default HOCFetchSiteData(HOCWithLogin(SearchReplace));
