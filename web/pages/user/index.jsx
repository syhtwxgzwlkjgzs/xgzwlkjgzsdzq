import React from 'react';
// import styles from './index.module.scss';
import Redirect from '@components/redirect';
export default class Detail extends React.Component {
  render() {
    return (
      <Redirect jumpUrl={'/my'} />
    );
  }
}
