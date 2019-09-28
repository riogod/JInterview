import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import styles from './Header.css';

type Props = {
  menu: string
};
type State = {};

export default class Header extends Component<Props, State> {
  props: Props;

  state: State;

  render() {
    const { menu } = this.props;
    return (
      <React.Fragment>
        <div className={styles.appHeader} data-tid="appHeader">
          <div className={styles['header-logo']} data-tid="logo">
            JInterview
          </div>
          <div className={styles.menuItems} data-tid="menuItems">
            <Link
              className={
                menu === 'main' ? styles.menuActiveItem : styles.menuItem
              }
              data-tid="menuItem1"
              to={routes.MAIN}
            >
              Category
            </Link>
            <Link
              className={
                menu === 'module-stat' ? styles.menuActiveItem : styles.menuItem
              }
              data-tid="menuItem2"
              to={routes.STAT}
            >
              Statistic
            </Link>
            <Link
              className={
                menu === 'module-settings'
                  ? styles.menuActiveItem
                  : styles.menuItem
              }
              data-tid="menuItem3"
              to={routes.SETTINGS}
            >
              Settings
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
