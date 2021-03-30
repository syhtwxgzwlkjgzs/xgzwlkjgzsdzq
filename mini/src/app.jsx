import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import initializeStore from '@common/store';
import './app.scss';

const store = initializeStore();

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 就是要渲染的页面
  render() {
    return (
      <Provider {...store}>
        {this.props.children}
      </Provider>
    );
  }
}

export default App;
