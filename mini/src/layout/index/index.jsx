import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPageContent from './content';
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

  state = {
    isError: false
  }

  async componentDidMount() {
    const { index } = this.props
    const { essence = 0, sequence = 0, attention = 0, sort = 1 } = index.filter;

    let newTypes = this.handleString2Arr(index.filter, 'types');

    let categoryIds = this.handleString2Arr(index.filter, 'categoryids');
    
    this.props.index.getReadCategories();
    this.props.index.getRreadStickList();
    try {
      await this.props.index.getReadThreadList({
        sequence, 
        filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort } 
      });
    } catch (error) {
      this.setState({ isError: true })
    }
  }

  // 将字符串转成数组，且过滤掉不必要的参数
  handleString2Arr = (dic, key) => {
    if (!dic || !dic[key]) {
      return
    }

    const target = dic[key]
    let arr = [];
    if (target) {
      if (!(target instanceof Array)) {
        arr = [target];
      } else {
        arr = target;
      }
    }

    return arr?.filter(item => item !== 'all' && item !== 'default' && item !== '') || []
  }

  dispatch = async (type, data = {}) => {
    const { index } = this.props;
    const { essence, sequence, attention, sort, page } = data;

    let newTypes = this.handleString2Arr(data, 'types');

    let categoryIds = this.handleString2Arr(data, 'categoryids');

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
          <IndexPageContent dispatch={this.dispatch} isError={this.state.isError} />
        </MemoToastProvider>
      </View>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
