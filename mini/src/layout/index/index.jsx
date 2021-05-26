import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPageContent from './content';
import Toast from '@discuzq/design/dist/components/toast/index';
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
    const { categoryids, types, essence, sequence, attention, sort, page } = data;

    let newTypes = [];
    if (types) {
      if (!(types instanceof Array)) {
        newTypes = [types];
      } else {
        newTypes = types;
      }
    }

    let categoryIds = [];
    if (categoryids) {
      if (!(categoryids instanceof Array)) {
        categoryIds = [categoryids];
      } else {
        categoryIds = categoryids;
      }
    }

    if (type === 'click-filter') { // 点击tab
      this.page = 1;
      await index.screenData({ filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort }, sequence, page: this.page, });
    } else if (type === 'moreData') {
      this.page += 1;
      return await index.getReadThreadList({
        perPage: this.prePage,
        page: this.page,
        filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort },
        sequence,
      });
    } else if (type === 'refresh-recommend') {
      await index.getRecommends({ categoryIds });
    } else if (type === 'update-page') {// 单独更新页数
      this.page = page
    } else if (type === 'refresh-thread') { // 点击帖子更新数的按钮，刷新帖子数据
      this.page = 1;
      return await index.getReadThreadList({ filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort }, sequence, page: this.page, });
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
