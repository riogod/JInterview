import React, { Component } from 'react';
import './Header.scss';

type Props = {};

type State = {};

export default class Header extends Component<Props, State> {
  render() {
    return (
      <React.Fragment>
        <div className="header-style"> Hello world !!!</div>
      </React.Fragment>
    );
  }
}
