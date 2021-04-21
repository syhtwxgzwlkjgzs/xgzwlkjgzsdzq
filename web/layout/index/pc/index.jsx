import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread';
import Navigation from './components/navigation';
import QcCode from './components/qcCode';
import Recommend from './components/recommend';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  changeBatch = () => {
    console.log('换一批');
  }
  recommendDetails = () => {
    console.log('推荐详情');
  }
  render() {
    const { index, user, site } = this.props;
    return (
      <div>
        <BaseLayout
          left={() => <div><Navigation /></div>}
          right={() => <div>
            <QcCode />
            <Recommend
              changeBatch={this.changeBatch}
              recommendDetails={this.recommendDetails}
            />
          </div>}
        >
          {() => <ThreadContent />}
        </BaseLayout>
      </div>
    );
  }
}

export default IndexPCPage;
