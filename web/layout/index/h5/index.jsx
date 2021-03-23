import React from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';

@inject('site')
@inject('index')
@observer
class IndexH5Page extends React.Component {
  render() {
    const { index } = this.props;
    return (
      <div>
        {
          index.categories ? index.categories.map((item, index) => <h1 key={index}>{item.name}</h1>) : null
        }

        <Link href='/detail'>detauil</Link>
        <Link href='/user'>user</Link>
      </div>
    );
  }
}

export default IndexH5Page;
