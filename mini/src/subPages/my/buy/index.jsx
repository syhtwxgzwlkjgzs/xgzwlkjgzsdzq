import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '../../../layout/my/buy';
import Page from '@components/page';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  page = 1;
  perPage = 10;

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { index } = this.props;
    index.setThreads(null);
    await index.getReadThreadList({
      filter: {
        complex: 4,
      },
      perPage: this.perPage,
      page: 1,
    });
  }

  componentWillUnmount() {
    this.props.index.setThreads(null);
  }

  dispatch = async () => {
    const { index } = this.props;

    this.page += 1
    return await index.getReadThreadList({
      filter: {
        complex: 4,
      },
      perPage: this.perPage,
      page: this.page,
    });
  };

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
