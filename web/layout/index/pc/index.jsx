import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import NewContent from './components/new-content';
import TopMenu from './components/top-menu';
import PostTheme from './components/post-theme';
import TopNews from '../h5/components/top-news';
import Navigation from './components/navigation';
import QcCode from './components/qcCode';
import Recommend from './components/recommend';
import IndexContent from './components/index-content'
import themeData from './data';
@inject('site')
@inject('user')
@inject('index')
@observer
class IndexPCPage extends React.Component {
  changeBatch = () => {
    console.log('换一批');
  }
  recommendDetails = () => {
    console.log('推荐详情');
  }
  render() {
    const { index, user, site } = this.props;
    const { sticks, threads, categories } = index;
    return (
      <div className={styles.indexWrap}>
        <BaseLayout
          left={() => <div className={styles.indexLeft}>
              <div className={styles.indexLeftBox}>
                <Navigation />
              </div>
            </div>}
          right={() => <div className={styles.indexRight}>
            <QcCode />
            <div style={{marginTop: '20px'}}>
              <Recommend
                changeBatch={this.changeBatch}
                recommendDetails={this.recommendDetails}
              />
            </div>
          </div>}
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
                <div className={styles.TopNewsBox}>
                  <TopNews data={sticks} itemMargin='0' isShowBorder={false}/>
                </div>
                <div className={styles.topNewContent}>
                  <NewContent visible='true'/>
                </div>
              </div>
              <div className={styles.themeBox}>
                {/* {
                  themeData.map((item, index) => { 
                    <div className={styles.themeItem} key={index}>
                      <IndexContent data={item}/>
                    </div>
                  })
                } */}
                <div className={styles.themeItem}>
                  <IndexContent/>
                </div>
                <div className={styles.themeItem}>
                  <IndexContent/>
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
