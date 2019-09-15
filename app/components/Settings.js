// @flow
import React, { Component } from 'react';

import Button from 'antd/es/button';
import { InputNumber, Row, Col, Slider } from 'antd';
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
        <Row>
          <Col span={12}>col-12</Col>
          <Col span={12}>
            <Slider defaultValue={30} tooltipVisible />
          </Col>
        </Row>

        <Button type="primary">Button</Button>
        <InputNumber min={1} max={10} defaultValue={3} />
      </React.Fragment>
    );
  }
}
