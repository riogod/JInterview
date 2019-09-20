// @flow
import React, { Component } from 'react';
import { Row, Col, Slider, Switch } from 'antd';
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
        <div className="settings-container">
          <Row>
            <Col span={12}>Questions in quiz block:</Col>
            <Col span={12}>
              <Slider defaultValue={30} tooltipVisible />
            </Col>
          </Row>
          <Row>
            <Col span={12}>Allow subdir in quiz:</Col>
            <Col span={12}>
              <Switch defaultChecked />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
