import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPageContent from './content';
import { Toast } from '@discuzq/design'
import { View } from '@tarojs/components';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';

const MemoToastProvider = React.memo(ToastProvider)

@inject('site')
@inject('index')
@inject('user')
@observer
class Index extends React.Component {
  page = 1;
  prePage = 10;

  async componentDidMount() {
    const { site } = this.props;
    this.props.index.getReadCategories();
    this.props.index.getRreadStickList();
    this.props.index.getReadThreadList({sequence: this.props.site.checkSiteIsOpenDefautlThreadListData() ? 1 : 0});
  }


  dispatch = async (type, data = {}) => {
    const { index } = this.props;
    const { categoryids, types, essence, sequence } = data;

    if (type === 'click-filter') {
      this.toastInstance = Toast.loading({
        content: '加载中...',
        duration: 1000,
      });

      this.page = 1;
      await index.screenData({ filter: { categoryids, types, essence }, sequence, perPage: 5, page: this.page, });
    } else if (type === 'moreData') {
      this.page += 1;
      await index.getReadThreadList({
        perPage: this.prePage,
        page: this.page,
        filter: { categoryids, types, essence },
        sequence,
      });

      return;
    }
  }

  render() {
    return (
      <View>
        <MemoToastProvider>
          <IndexPageContent dispatch={this.dispatch} />
        </MemoToastProvider>
      </View>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
