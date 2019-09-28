// @flow
import React, { Component } from 'react';
import DbServiceCategory from '../db/service/categories';
import CatalogItem from '../containers/Catalog/CatalogItemModule';

type Props = {
  currentCategory: number
};

export default class Catalog extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      isCategoryLoaded: false,
      categoryArr: []
    };
  }

  componentDidMount(): void {
    const { currentCategory } = this.props;
    const dbCategory = new DbServiceCategory();
    const categoryArr = [];

    dbCategory
      .getCategories(currentCategory)
      .then(res => {
        res.forEach(el => {
          categoryArr.push({
            id: el.id,
            name: el.category_name,
            descr: el.category_descr,
            pid: el.parent_id,
            sort_order: el.sort_order
          });
        });
        this.setState({ isCategoryLoaded: true, categoryArr });
        return true;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  }

  render() {
    console.log('Catalog state: ', this.state);
    const { isCategoryLoaded, categoryArr } = this.state;

    const catalogItems = !isCategoryLoaded
      ? null
      : categoryArr.map(el => {
          return <CatalogItem key={el.id} item={el} />;
        });
    return (
      <div className="catalog-container">
        <div className="catalog-itemlist">{catalogItems}</div>
      </div>
    );
  }
}
