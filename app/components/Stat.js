// @flow
import React, { Component } from 'react';

import Header from './header/Header';

type Props = {
  currentPath: string
};

export default class Stat extends Component<Props> {
  props: Props;

  render() {
    const { currentPath } = this.props;
    return (
      <React.Fragment>
        <Header menu={currentPath} />
        stat
      </React.Fragment>
    );
  }
}
