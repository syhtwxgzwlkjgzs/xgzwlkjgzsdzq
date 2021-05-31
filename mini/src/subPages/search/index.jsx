import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '../../layout/search';
import Page from '@components/page';
import Taro from '@tarojs/taro'
import withShare from '@common/utils/withShare'
@inject('search')
@observer
@withShare({
  needShareline: false
})
class Index extends React.Component {

  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const { search } = this.props;
    Taro.hideHomeButton();
    await search.getSearchData();
  }
  render() {
    return (
      <Page>
        <IndexH5Page dispatch={this.dispatch}/>
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
