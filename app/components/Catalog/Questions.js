// @flow
import React, { Component } from 'react';
// import { Button, Icon, Input, Popconfirm } from 'antd';
import DbServiceQuestions from '../../db/service/questions';
// import CatalogItem from '../Catalog';

const dbCategory = new DbServiceQuestions();

type Props = {
  currentCategory: number,
  needToUpdateCatalogState: boolean,
  categoryHaveItems: boolean,
  categoryHaveSubs: boolean,
  setCategoryHaveItems: Function
};

export default class Questions extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      isQuestionLoaded: false,
      questionArr: []
    };
  }

  componentDidUpdate(): void {
    const { needToUpdateCatalogState, currentCategory } = this.props;

    const { isQuestionLoaded } = this.state;

    if (!isQuestionLoaded || needToUpdateCatalogState) {
      this.fetchQuestionToState(currentCategory);
    }
  }

  fetchQuestionToState = currentCategory => {
    const questionArr = [];
    const { setCategoryHaveItems, categoryHaveItems } = this.props;

    dbCategory
      .getQuestionItems(currentCategory)
      .then(res => {
        res.forEach(el => {
          questionArr.push({
            id: el.id,
            name: el.question_name,
            descr: el.question_description,
            pid: el.parent_id,
            questionType: el.question_type
          });
        });

        if (questionArr.length > 0) {
          this.setState({ isQuestionLoaded: true, questionArr });
          if (!categoryHaveItems) {
            setCategoryHaveItems(true);
          }
        } else {
          this.setState({ isQuestionLoaded: true, questionArr: [] });
          if (categoryHaveItems) {
            setCategoryHaveItems(false);
          }
        }
        return true;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  };

  render() {
    const { isQuestionLoaded, questionArr } = this.state;

    const { categoryHaveSubs } = this.props;

    const quShow = !categoryHaveSubs ? 'Question array' : null;

    if (isQuestionLoaded) {
      console.log('Loaded ITEMS:', questionArr);
    }

    return <div className="questions-block">{quShow}</div>;
  }
}
