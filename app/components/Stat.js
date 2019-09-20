// @flow
import React, { Component } from 'react';

import Header from './header/Header';
import DbServiceSettings from '../db/service/settings';

type Props = {
  currentPath: string
};

export default class Stat extends Component<Props> {
  props: Props;

  dbSettings = new DbServiceSettings();

  render() {
    const { currentPath } = this.props;
    this.dbSettings
      .getSettingsValue('QUESTION_PER_QUIZSESSION')
      .then(res => {
        console.log(`------->${res}`);
        return res;
      })
      .catch(err => console.log(`Something wrong: ${err}`));

    return (
      <React.Fragment>
        <Header menu={currentPath} />
        stat
      </React.Fragment>
    );
  }
}
