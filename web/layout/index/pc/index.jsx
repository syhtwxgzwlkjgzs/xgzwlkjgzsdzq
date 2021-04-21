import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import ThreadContent from '@components/thread'
import NewContent from './components/new-content';
import TopMenu from './components/top-menu';
import PostTheme from './components/post-theme';
import TopNews from '../h5/components/top-news';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  render() {
    const { index, user, site } = this.props;
    const { sticks, threads, categories } = index;
    return (
      <div className={styles.indexWrap}>
        <BaseLayout
          left={() => <div>左边</div>}
          right={() => <div>右边</div>}
        >
          {
            () => <div className={styles.indexContent}>
              <div className={styles.contnetTop}>
                <div className={styles.topBox}>
                  <TopMenu/>
                  <div className={styles.PostTheme}>
                    <PostTheme/>
                  </div>
                </div>
                <div className={styles.topBox}>
                  <TopNews data={sticks}/>
                </div>
                <NewContent visible='true'/>
              </div>
              <div className={styles.themeBox}>
                <div className={styles.themeItem}>
                  <ThreadContent/>
                </div>
              </div>
            </div>
          }
        </BaseLayout>
      </div>
    );
  }
}

export default IndexPCPage;
