import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

@inject('site')
@inject('user')
@observer
class CommentH5Page extends React.Component {
  render() {
    return (
            <span>评论详情H5页面</span>
    );
  }
}

export default withRouter(CommentH5Page);
