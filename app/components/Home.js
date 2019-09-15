// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import Header from './header/Header';

type Props = {
  currentPath: string
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { currentPath } = this.props;
    return (
      <div className={styles.container} data-tid="container">
        <Header menu={currentPath} />
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
