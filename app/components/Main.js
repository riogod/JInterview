// @flow
import React, { Component } from 'react';
import InitLoadingPage from '../containers/InitLoadingPage';

import Header from './header/Header';
import CatalogModule from '../containers/CatalogModule';

type Props = {
  setCurrentPath: any,
  setAppSettings: Function,
  appSettings: Object,
  loadedInit: boolean
};

export default class Main extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { setCurrentPath } = this.props;
    setCurrentPath('module-category');

  }

  render() {
    const { loadedInit } = this.props;


    const loading = !loadedInit ? (
      <InitLoadingPage />
    ) : (
    <React.Fragment>
      <CatalogModule/>
    </React.Fragment>
  );

    return (
      <React.Fragment>
        <Header  menu="main" />
        {loading}
      </React.Fragment>
    );
  }
}
