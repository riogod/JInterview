// @flow
import React, { Component } from 'react';

import Header from './header/Header';

type Props = {
  setCurrentPath: Function
};

export default class Stat extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { setCurrentPath } = this.props;
    setCurrentPath('module-stat');
  }

  render() {
    return (
      <React.Fragment>
        <Header menu="module-stat" />
        Comming soon...
      </React.Fragment>
    );
  }
}
