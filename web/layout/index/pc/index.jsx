import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  render() {
    const { index, user, site } = this.props;
    return (
      <div>
        <BaseLayout
          left={() => <div>左边</div>}
          right={() => <div>右边</div>}
        >
          {() => <ThreadContent />}
        </BaseLayout>
      </div>
    );
  }
}

export default IndexPCPage;
