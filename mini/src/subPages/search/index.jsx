import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '../../layout/search';
import Toast from '@discuzq/design/dist/components/toast/index';
import Page from '@components/page';
import Taro from '@tarojs/taro'

@inject('site')
@inject('search')
@observer
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
