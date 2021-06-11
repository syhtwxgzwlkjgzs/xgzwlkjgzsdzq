import React from 'react';
import IndexPage from '@layout/index/content';
import Page from '@components/page';
import withShare from '@common/utils/withShare/withShare'
import { inject, observer } from 'mobx-react'
import { handleString2Arr } from '@common/utils/handleCategory';

@inject('site')
@inject('search')
@inject('topic')
@inject('index')
@inject('user')
@observer
@withShare({
  needLogin: true
})
class Index extends React.Component {
  $getShareData(data) {
    const { site } = this.props
    const defalutTitle = site.webConfig?.setSite?.siteName || ''
    const defalutPath = 'pages/index/index'
    if (data.from === 'timeLine') {
      return {
        title: defalutTitle
      }
    }
    if (data.from === 'menu') {
      return {
        title: defalutTitle,
        path: defalutPath
      }
    }
    const { title, path, comeFrom, threadId } = data
    if (comeFrom && comeFrom === 'thread') {
      const { user } = this.props
      this.props.index.updateThreadShare({ threadId }).then(result => {
        if (result.code === 0) {
          this.props.index.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.search.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
          this.props.topic.updateAssignThreadInfo(threadId, { updateType: 'share', updatedInfo: result.data, user: user.userInfo });
        }
      });
    }
    return {
      title,
      path
    }
  }

  page = 1;
  prePage = 10;

  state = {
    isError: false,
    errorText: '加载失败'
  }

  componentDidMount() {
    const { index } = this.props
    const { essence = 0, sequence = 0, attention = 0, sort = 1 } = index.filter;

    let newTypes = handleString2Arr(index.filter, 'types');
    let categoryIds = handleString2Arr(index.filter, 'categoryids');
    
    this.props.index.getReadCategories();
    this.props.index.getRreadStickList();
    this.props.index.getReadThreadList({
      sequence, 
      filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort } 
    });
  }



  dispatch = async (type, data = {}) => {
    const { index } = this.props;
    const newData = {...index.filter, ...data}
    const { essence, sequence, attention, sort, page } = newData;

    let newTypes = handleString2Arr(newData, 'types');

    let categoryIds = handleString2Arr(newData, 'categoryids');

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
      <Page>
        <IndexPage dispatch={this.dispatch} />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default Index;
