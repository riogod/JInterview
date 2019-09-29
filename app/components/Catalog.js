// @flow
import React, { Component } from 'react';
import { Icon, Input, Button } from 'antd';
import DbServiceCategory from '../db/service/categories';
import CatalogItem from '../containers/Catalog/CatalogItemModule';

type Props = {
  currentCategory: number,
  needToUpdateCatalog: Function,
  needToUpdateCatalogState: boolean
};

export default class Catalog extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      isCategoryLoaded: false,
      categoryArr: [],
      addItem: false,
      addItemValue: {
        category_name: '',
        category_descr: ''
      }
    };
  }

  componentDidMount(): void {
    const { currentCategory } = this.props;

    this.fetchCategoryToState(currentCategory);
  }

  componentDidUpdate(): void {
    const {
      needToUpdateCatalog,
      currentCategory,
      needToUpdateCatalogState
    } = this.props;

    if (needToUpdateCatalogState) {
      needToUpdateCatalog(false);
      this.fetchCategoryToState(currentCategory);
    }
  }

  dbCategory = new DbServiceCategory();

  // Get current catalog data and placing to state
  fetchCategoryToState = currentCategory => {
    const categoryArr = [];

    this.dbCategory
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
  };

  // Remove "Add new item to catalog" state
  clearAdding = () => {
    this.setState({
      addItem: false,
      addItemValue: { category_name: '', category_descr: '' }
    });
  };

  // Adding new item to catalog when press OK ar Enter
  handleSubmit = e => {
    const { categoryArr, addItemValue } = this.state;
    const { currentCategory, needToUpdateCatalog } = this.props;

    e.preventDefault();

    this.setState({ isCategoryLoaded: false });

    this.dbCategory
      .addCategory(addItemValue, currentCategory, categoryArr.length)
      .then(resu => {
        this.clearAdding();
        // this.fetchCategoryToState(currentCategory);
        needToUpdateCatalog(true);
        return resu;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  };

  catalogAddItem = () => {
    const { addItem } = this.state;
    const { addItemValue } = this.state;
    const res = addItem ? (
      <div>
        <Input
          name="category_name"
          placeholder="Category name"
          value={addItemValue.category_name}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              this.handleSubmit(e);
              console.log('Enter clicked');
            }
            if (e.key === 'Escape') {
              this.clearAdding();
            }
          }}
          onChange={e => {
            this.setState({
              addItemValue: { ...addItemValue, category_name: e.target.value }
            });
          }}
        />
        <Input
          name="category_descr"
          placeholder="Category description"
          value={addItemValue.category_descr}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              this.handleSubmit(e);
              console.log('Enter clicked');
            }
            if (e.key === 'Escape') {
              this.clearAdding();
            }
          }}
          onChange={e => {
            this.setState({
              addItemValue: { ...addItemValue, category_descr: e.target.value }
            });
          }}
        />
        <Button onClick={e => this.handleSubmit(e)}>Send</Button>
        <Button
          onClick={() => {
            this.clearAdding();
            console.log('clicked');
          }}
        >
          Cancel
        </Button>
      </div>
    ) : (
      <a
        href="#"
        onClick={() => {
          this.setState({ addItem: true });
        }}
      >
        <Icon type="plus-circle" style={{ fontSize: '46px', color: '#fff' }} />
      </a>
    );

    return <div className="catalog-itemadd">{res}</div>;
  };

  render() {
    console.log('Catalog props: ', this.props);
    console.log('Catalog state: ', this.state);
    const { isCategoryLoaded, categoryArr } = this.state;

    // this.dbCategory.updateCategory(27, 0, 'AHAHA', 'this is a descr', 8);
    const catalogItems = !isCategoryLoaded
      ? null
      : categoryArr.map(el => {
          return <CatalogItem key={el.id} item={el} />;
        });
    return (
      <div className="catalog-container">
        <div className="catalog-itemlist">
          {catalogItems} {isCategoryLoaded ? this.catalogAddItem() : null}
        </div>
      </div>
    );
  }
}
