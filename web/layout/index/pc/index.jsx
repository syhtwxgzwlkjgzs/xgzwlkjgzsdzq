import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Header from '@components/header';
import { Button, Upload } from '@discuzq/design';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  render() {
    const { index, user, site } = this.props;
    return (
      <div>
        <Header/>
        { user.userInfo && <h1>{user.userInfo.username}</h1> }
        {
          index.categories ? index.categories.map((item, index) => <h1 key={index}>{item.name}</h1>) : null
        }
        <p className={styles.text}>test</p>
       
        <Button>123</Button>
      </div>
    );
  }
}

export default IndexPCPage;
