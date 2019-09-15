// @flow
import React, { Component } from 'react';

import Header from './header/Header';

type Props = {
  currentPath: string
};

export default class Settings extends Component<Props> {
  props: Props;

  render() {
    const { currentPath } = this.props;
    return (
      <React.Fragment>
        <Header menu={currentPath} />
        settings
      </React.Fragment>
    );
  }
}
