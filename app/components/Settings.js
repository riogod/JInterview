// @flow
import React, { Component } from 'react';
import { Row, Col, Slider, Switch } from 'antd';
import Header from './header/Header';
import DbServiceSettings from '../db/service/settings';
import InitLoadingPage from '../containers/InitLoadingPage';

type Props = {
  setCurrentPath: any,
  setAppSettings: Function,
  appSettings: Object,
  loadedInit: boolean
};

export default class Settings extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { setCurrentPath } = this.props;
    setCurrentPath('module-settings');

    const dbSettings = new DbServiceSettings();

    dbSettings
      .getSettingsValue('QUESTION_PER_QUIZSESSION')
      .then(res => res)
      .catch(err => console.log(`Something wrong: ${err}`));
  }

  render() {
    const { setAppSettings } = this.props;

    const { appSettings, loadedInit } = this.props;
    const itemDisabled = !loadedInit;

    const { QUESTION_PER_QUIZSESSION, ALLOW_SUBDIR } = appSettings;

    const loading = !loadedInit ? (
      <InitLoadingPage />
    ) : (
      <div className="settings-container">
        <Row>
          <Col span={12}>Сколько вопросов будет задано в блоке интервью:</Col>
          <Col span={12}>
            <Slider
              defaultValue={QUESTION_PER_QUIZSESSION}
              onAfterChange={val => {
                setAppSettings('QUESTION_PER_QUIZSESSION', Number(val));
              }}
              disabled={itemDisabled}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>Включать вопросы из подкатегорий:</Col>
          <Col span={12}>
            <Switch
              defaultChecked={ALLOW_SUBDIR}
              onChange={val => {
                console.log('Switched!!!!', val);
                setAppSettings('ALLOW_SUBDIR', val);
              }}
            />
          </Col>
        </Row>
      </div>
    );

    return (
      <React.Fragment>
        <Header menu="module-settings" />
        {loading}
      </React.Fragment>
    );
  }
}
