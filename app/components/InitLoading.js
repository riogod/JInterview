// @flow
import React, { Component } from 'react';
import { Spin } from 'antd';

import DbServiceSettings from '../db/service/settings';

type Props = {
  setInitSettings: Function,
  setLoadedInit: Function
};

export default class InitLoading extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { setInitSettings, setLoadedInit } = this.props;

    const dbSettings = new DbServiceSettings();

    dbSettings
      .getSettingsValue('QUESTION_PER_QUIZSESSION')
      .then(res => {
        setInitSettings('QUESTION_PER_QUIZSESSION', Number(res));
        dbSettings
          .getSettingsValue('ALLOW_SUBDIR')
          .then(resAsb => {
            setInitSettings('ALLOW_SUBDIR', resAsb === '1');
            setLoadedInit(true);
            return resAsb;
          })
          .catch(err => console.log(`Something wrong: ${err}`));
        return res;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  }

  render() {
    return (
      <React.Fragment>
        <Spin size="large" className="loading-spinner" />
      </React.Fragment>
    );
  }
}
