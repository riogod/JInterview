// @flow
import React, { Component } from 'react';
import { Row, Col, Slider, Switch } from 'antd';
import Header from './header/Header';
import DbServiceSettings from '../db/service/settings';

type Props = {
  setCurrentPath: any,
  setAppSettings: Function,
  appSettings: Object
};

export default class Settings extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { setCurrentPath } = this.props;
    setCurrentPath('module-settings');

    const dbSettings = new DbServiceSettings();

    dbSettings
      .getSettingsValue('QUESTION_PER_QUIZSESSION')
      .then(res => {
        console.log(`!!!------->${res}`);
        return res;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  }

  render() {
    const { setAppSettings } = this.props;

    const { appSettings } = this.props;
    const { QUESTION_PER_QUIZSESSION, ALLOW_SUBDIR } = appSettings;
    console.log('AppSettings:', this.props);
    return (
      <React.Fragment>
        <Header menu="module-settings" />
        <div className="settings-container">
          <Row>
            <Col span={12}>Сколько вопросов будет задано в блоке интервью:</Col>
            <Col span={12}>
              <Slider
                defaultValue={QUESTION_PER_QUIZSESSION}
                onAfterChange={val => {
                  setAppSettings('QUESTION_PER_QUIZSESSION', val);
                }}
                tooltipVisible
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>Разрешить включать вопросы из поддиректорий:</Col>
            <Col span={12}>
              <Switch defaultChecked={ALLOW_SUBDIR} />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
