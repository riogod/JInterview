// @flow
import React, { Component } from 'react';
import { Button, Icon, Input, Popconfirm } from 'antd';
import DbServiceCategory from '../../db/service/categories';

type Props = {
  item: Object,
  needToUpdateCatalog: Function,
  setCurrentCategory: Function
};

export default class Catalog extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      editItem: {
        category_name: '',
        category_descr: ''
      }
    };
  }

  componentDidMount(): void {
    const { item } = this.props;
    this.setState({
      editItem: {
        category_name: item.name,
        category_descr: item.descr
      }
    });
  }

  dbCategory = new DbServiceCategory();

  confirmDeleting = () => {
    const { needToUpdateCatalog } = this.props;
    const { item } = this.props;

    this.dbCategory
      .removeCategory(item.id)
      .then(res => {
        this.dbCategory
          .getCategories(item.pid)
          .then(resource => {
            Object.keys(resource).forEach(kkey => {
              this.dbCategory
                .updateCategory(resource[kkey].id, null, null, null, kkey)
                .then(r => r)
                .catch(err => console.log(`Something wrong: ${err}`));
            });
            needToUpdateCatalog(true);
            return resource;
          })
          .catch(err => console.log(`Something wrong: ${err}`));

        return res;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  };

  // Remove "Add new item to catalog" state
  clearEditing = () => {
    this.setState({
      isEdit: false
    });
  };

  // Adding new item to catalog when press OK ar Enter
  handleSubmit = e => {
    const { editItem } = this.state;
    const { needToUpdateCatalog, item } = this.props;
    e.preventDefault();

    this.setState({ isEdit: false });

    this.dbCategory
      .updateCategory(
        item.id,
        null,
        editItem.category_name,
        editItem.category_descr,
        null
      )
      .then(resu => {
        this.clearEditing();
        // this.fetchCategoryToState(currentCategory);
        needToUpdateCatalog(true);
        return resu;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  };

  catalogEditItem = () => {
    const { isEdit, editItem } = this.state;
    const { item, setCurrentCategory } = this.props;

    const res = isEdit ? (
      <React.Fragment>
        <Input
          name="category_name"
          placeholder="Category name"
          value={editItem.category_name}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              this.handleSubmit(e);
              console.log('Enter clicked');
            }
            if (e.key === 'Escape') {
              this.clearEditing();
            }
          }}
          onChange={e => {
            this.setState({
              editItem: { ...editItem, category_name: e.target.value }
            });
          }}
        />
        <Input
          name="category_descr"
          placeholder="Category description"
          value={editItem.category_descr}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              this.handleSubmit(e);
              console.log('Enter clicked');
            }
            if (e.key === 'Escape') {
              this.clearEditing();
            }
          }}
          onChange={e => {
            this.setState({
              editItem: { ...editItem, category_descr: e.target.value }
            });
          }}
        />
        <Button onClick={e => this.handleSubmit(e)}>Send</Button>
        <Button
          onClick={() => {
            this.clearEditing();
            console.log('clicked');
          }}
        >
          Cancel
        </Button>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div>
          <a
            href="#"
            onClick={() => {
              setCurrentCategory(item.id);
            }}
          >
            {item.name}
          </a>
        </div>
        <div>
          [start] [
          <a
            href="#"
            onClick={() => {
              this.setState({ isEdit: true });
            }}
          >
            edit
          </a>
          ] [
          <Popconfirm
            title="Are you sure？"
            onConfirm={this.confirmDeleting}
            icon={<Icon type="question-circle-o" style={{ color: 'blue' }} />}
          >
            <a href="#">delete</a>
          </Popconfirm>
          ]
        </div>
      </React.Fragment>
    );
    return res;
  };

  render() {
    return <div className="catalog-item">{this.catalogEditItem()}</div>;
  }
}
