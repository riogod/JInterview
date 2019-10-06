import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import styles from './Header.scss';

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
              className={`menuItem ${
                menu === 'main' ? 'menuActiveItem' : null
              }`}
              data-tid="menuItem1"
              to={routes.MAIN}
            >
              <span>Category</span>
            </Link>
            <Link
              className={`menuItem ${
                menu === 'module-stat' ? 'menuActiveItem' : null
              }`}
              data-tid="menuItem2"
              to={routes.STAT}
            >
              <span>Statistic</span>
            </Link>
            <Link
              className={`menuItem ${
                menu === 'module-settings' ? 'menuActiveItem' : null
              }`}
              data-tid="menuItem3"
              to={routes.SETTINGS}
            >
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
