// @flow
import React, { Component } from 'react';
import { Icon, Input, Button } from 'antd';
import DbServiceCategory from '../db/service/categories';
import CatalogItem from '../containers/Catalog/CatalogItemModule';
import CatalogPaneModule from '../containers/Catalog/CatalogPaneModule';
import QuestionsModule from '../containers/Catalog/QuestionsModule';

type Props = {
  currentCategory: number,
  needToUpdateCatalog: Function,
  setCategoryHaveSubs: Function,
  needToUpdateCatalogState: boolean,
  categoryHaveItems: boolean,
  categoryHaveSubs: boolean,
  searchPhrase: string
};

const { TextArea } = Input;

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

  componentDidUpdate(prevProps): void {
    const {
      needToUpdateCatalog,
      currentCategory,
      needToUpdateCatalogState
    } = this.props;
    const categoryArr = [];

    const { searchPhrase } = this.props;

    if (needToUpdateCatalogState) {
      needToUpdateCatalog(false);
      this.fetchCategoryToState(currentCategory);
    }

    if (searchPhrase !== prevProps.searchPhrase && searchPhrase.length > 2) {
      console.log(searchPhrase, searchPhrase.length);

      this.dbCategory
        .getCategoriesSearch(searchPhrase)
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

    if (searchPhrase !== prevProps.searchPhrase && searchPhrase.length <= 2) {
      this.fetchCategoryToState(currentCategory);
    }
  }

  dbCategory = new DbServiceCategory();

  // Get current catalog data and placing to state
  fetchCategoryToState = currentCategory => {
    const categoryArr = [];
    const { setCategoryHaveSubs, categoryHaveSubs } = this.props;

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

        if (categoryArr.length > 0) {
          console.log('categoryArr true', categoryArr.length, categoryHaveSubs);
          if (!categoryHaveSubs) {
            setCategoryHaveSubs(true);
          }
        } else {
          console.log(
            'categoryArr 5false',
            categoryArr.length,
            categoryHaveSubs
          );
          if (categoryHaveSubs) {
            setCategoryHaveSubs(false);
          }
        }

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
      <React.Fragment>
        <Input
          name="category_name"
          className="catalog-itemadd-header-input"
          placeholder="Category name"
          value={addItemValue.category_name}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              this.handleSubmit(e);
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
        <TextArea
          className="catalog-itemadd-header-textarea"
          autosize={{ minRows: 1, maxRows: 6 }}
          name="category_descr"
          placeholder="Category description"
          value={addItemValue.category_descr}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              this.handleSubmit(e);
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
        <div className="catalog-itemadd-edit-footer">
          <Button onClick={e => this.handleSubmit(e)}>Ok</Button>
          <Button
            onClick={() => {
              this.clearAdding();
            }}
          >
            Cancel
          </Button>
        </div>
      </React.Fragment>
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
    const { isCategoryLoaded, categoryArr } = this.state;
    const { categoryHaveItems, searchPhrase } = this.props;
    console.log('PROPS:', this.props);
    const catalogItems = !isCategoryLoaded
      ? null
      : categoryArr.map(el => {
          return <CatalogItem key={el.id} item={el} />;
        });

    console.log('categoryHaveItems:', categoryHaveItems);
    return (
      <React.Fragment>
        <CatalogPaneModule />
        <div className="catalog-container">
          <div className="catalog-itemlist">
            {catalogItems}
            {isCategoryLoaded && !categoryHaveItems && searchPhrase.length < 3
              ? this.catalogAddItem()
              : null}
          </div>
          <QuestionsModule />
        </div>
      </React.Fragment>
    );
  }
}
