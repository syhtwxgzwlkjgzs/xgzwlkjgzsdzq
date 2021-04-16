import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';

@inject('site')
@inject('user')
@observer
class CommentPCPage extends React.Component {
  render() {
    return (
            <span>评论详情PC页面</span>
    );
  }
}

export default withRouter(CommentPCPage);
