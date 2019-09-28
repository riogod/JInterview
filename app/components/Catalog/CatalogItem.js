// @flow
import React, { Component } from 'react';

type Props = {
  item: Object
};

export default class Catalog extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('Item: ', this.props);
    const { item } = this.props;
    return <div className="catalog-item">{item.name}</div>;
  }
}
