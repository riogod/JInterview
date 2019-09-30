// @flow
import React, { Component } from 'react';
import { Breadcrumb, Icon } from 'antd';
import DbServiceCategory from '../../db/service/categories';

type Props = {
  setCurrentCategory: Function,
  currentCategory: number
};

export default class CatalogPane extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      isBreadcrumbsLoaded: false,
      breadcrumbs: []
    };
  }

  componentDidUpdate(prevProps): void {
    const { currentCategory } = this.props;

    if (currentCategory !== prevProps.currentCategory) {
      this.dbCategory
        .getAllParent(currentCategory)
        .then(res => {
          this.setState({
            isBreadcrumbsLoaded: true,
            breadcrumbs: res.reverse()
          });
          return res;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  dbCategory = new DbServiceCategory();

  breadcrumbArr = arr => {
    const { currentCategory } = this.props;
    const { setCurrentCategory } = this.props;

    return arr.map(item => {
      const allowLink = catName =>
        currentCategory !== item.id ? (
          <a href="#" onClick={() => setCurrentCategory(item.id)}>
            {catName}
          </a>
        ) : (
          catName
        );

      return (
        <Breadcrumb.Item key={item.id}>
          {allowLink(item.category_name)}
        </Breadcrumb.Item>
      );
    });
  };

  BreadcrumbCreate = () => {
    const { setCurrentCategory } = this.props;
    const { breadcrumbs } = this.state;

    // console.log('breadcrumbs:', breadcrumbs);

    const { isBreadcrumbsLoaded } = this.state;
    const BreadcrumbShow = isBreadcrumbsLoaded
      ? this.breadcrumbArr(breadcrumbs)
      : null;

    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <a
            href="#"
            onClick={() => {
              setCurrentCategory(0);
            }}
          >
            <Icon type="home" />
          </a>
        </Breadcrumb.Item>
        {BreadcrumbShow}
      </Breadcrumb>
    );
  };

  render() {
    return (
      <div className="catalog-pane">
        <div>{this.BreadcrumbCreate()}</div>
        <div>searching</div>
      </div>
    );
  }
}
