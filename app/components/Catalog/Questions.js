// @flow
import React, { Component } from 'react';
import { Modal, Button, Input, Radio, Icon, Checkbox } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import DbServiceQuestions from '../../db/service/questions';

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
      questionArr: [],

      addItem: {
        visible: false,
        itemName: '',
        itemDescr: '',
        itemType: 'text',
        answerData: {
          text: '',
          data: [
            {
              isTrue: false,
              text: ''
            }
          ]
        }
      }
    };

    this.setQuestionDescrState = this.setQuestionDescrState.bind(this);
    this.setAnswerTextState = this.setAnswerTextState.bind(this);
  }

  componentDidMount(): void {
    const { needToUpdateCatalogState, currentCategory } = this.props;
    const { isQuestionLoaded } = this.state;

    if (!isQuestionLoaded || needToUpdateCatalogState) {
      this.fetchQuestionToState(currentCategory);
    }
  }

  componentDidUpdate(): void {
    const { needToUpdateCatalogState, currentCategory } = this.props;
    const { isQuestionLoaded } = this.state;

    if (!isQuestionLoaded || needToUpdateCatalogState) {
      this.fetchQuestionToState(currentCategory);
    }
  }

  // Changing answer text state
  setAnswerTextState(value) {
    const { addItem } = this.state;
    this.setState({
      addItem: {
        ...addItem,
        answerData: {
          ...addItem.answerData,
          text: value
        }
      }
    });
  }

  // Changing question description text state
  setQuestionDescrState(value) {
    const { addItem } = this.state;
    this.setState({
      addItem: {
        ...addItem,
        itemDescr: value
      }
    });
  }

  // Changing question title state
  setQuestionTitleState = value => {
    const { addItem } = this.state;
    this.setState({
      addItem: {
        ...addItem,
        itemName: value
      }
    });
  };

  // Fetch all question from current directory to state
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
          this.setState({
            isQuestionLoaded: true,
            questionArr
          });
          if (!categoryHaveItems) {
            setCategoryHaveItems(true);
          }
        } else {
          this.setState({
            isQuestionLoaded: true,
            questionArr: []
          });
          if (categoryHaveItems) {
            setCategoryHaveItems(false);
          }
        }
        return true;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  };

  // Render question list of current category
  questionList = () => {
    const { isQuestionLoaded, questionArr } = this.state;

    const questionItems = !isQuestionLoaded
      ? null
      : questionArr.map(el => {
          return (
            <div key={el.id} className="question-item">
              <div className="question-item-title">{el.name}</div>
              <div className="question-item-content">{el.descr}</div>
            </div>
          );
        });

    return <div className="question-list">{questionItems}</div>;
  };

  // showing add/edit modal dialog
  showAddModal = () => {
    const { addItem } = this.state;

    this.setState({
      addItem: {
        ...addItem,
        visible: true
      }
    });
  };

  // Cancel editing or adding item
  addItemHandleCancel = () => {
    const { addItem } = this.state;
    this.setState({
      addItem: {
        ...addItem,
        visible: false
      }
    });
  };

  // Add/Edit item
  addItemHandleOk = () => {
    const { addItem } = this.state;
    this.setState({
      addItem: {
        ...addItem,
        visible: false
      }
    });
  };

  // toolbar modules for rich text editor
  RTEmodules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' }
      ],
      ['link', 'code-block'],
      ['clean']
    ]
  };

  // Function returning list of possible answers and implements add, edit an deleting functional.
  // state can be true or false.
  // true: It's a single answer selector
  // false: Multi answer selector

  answerMod = isRadioSelection => {
    const {
      addItem: {
        answerData: { data }
      }
    } = this.state;

    return (
      <div>
        {isRadioSelection ? (
          <Radio.Group
            onChange={e => {
              this.setState(st => {
                const stateCopy = Object.assign({}, st);
                stateCopy.addItem.answerData.data = data.map((val, key) => {
                  return e.target.value === key
                    ? { isTrue: true, text: val.text }
                    : { isTrue: false, text: val.text };
                });
              });
            }}
            className="answer-selectors"
          >
            {this.answerModItems(isRadioSelection)}
          </Radio.Group>
        ) : (
          this.answerModItems(isRadioSelection)
        )}
        <div>
          <a
            href="#"
            onClick={() => {
              const stateCopy = Object.assign({}, this.state);
              stateCopy.addItem.answerData.data.push({
                isTrue: false,
                text: ''
              });
              this.setState(stateCopy);
            }}
          >
            <Icon type="plus-square" />
          </a>
        </div>
      </div>
    );
  };

  answerModItems = isRadioSelection => {
    const {
      addItem: {
        answerData: { data }
      }
    } = this.state;

    const inputList = index => (
      <Input
        placeholder="Answer"
        value={data[index].text}
        onChange={value => {
          const stateCopy = Object.assign({}, this.state);
          stateCopy.addItem.answerData.data[index].text = value.target.value;
          this.setState(stateCopy);
        }}
      />
    );

    const deleteList = index => (
      <a
        href="#"
        onClick={() => {
          const stateCopy = Object.assign({}, this.state);
          stateCopy.addItem.answerData.data = [
            ...stateCopy.addItem.answerData.data.slice(0, index),
            ...stateCopy.addItem.answerData.data.slice(index + 1)
          ];
          this.setState(stateCopy);
        }}
      >
        <Icon type="delete" />
      </a>
    );

    const selectTypoList = index =>
      isRadioSelection ? (
        <Radio value={index} key={index} checked={data[index].isTrue}>
          {inputList(index)}
          {deleteList(index)}
        </Radio>
      ) : (
        <Checkbox
          value={index}
          key={index}
          checked={data[index].isTrue}
          onChange={value => {
            const stateCopy = Object.assign({}, this.state);
            stateCopy.addItem.answerData.data[index].isTrue =
              value.target.checked;
            this.setState(stateCopy);
          }}
        >
          {inputList(index)}
          {deleteList(index)}
        </Checkbox>
      );

    return data.map((val, index) => {
      return selectTypoList(index);
    });
  };

  // Function rendering add/edit interface based on selecting type of answer
  answerTypeSelect = () => {
    const {
      addItem: { itemType, answerData }
    } = this.state;

    switch (itemType) {
      case 'select':
        return this.answerMod(true);
      case 'multi':
        return this.answerMod(false);
      default:
        return (
          <React.Fragment>
            <ReactQuill
              value={answerData.text}
              modules={this.RTEmodules}
              onChange={this.setAnswerTextState}
            />
          </React.Fragment>
        );
    }
  };

  // Show add/edit dialog
  addQuestion = () => {
    const {
      addItem: { visible, itemDescr }
    } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showAddModal}>
          add item
        </Button>
        <Modal
          title="Title"
          visible={visible}
          onOk={this.addItemHandleOk}
          onCancel={this.addItemHandleCancel}
          maskClosable={false}
          width="900px"
        >
          <Input
            placeholder="Title"
            onChange={e => {
              this.setQuestionTitleState(e.target.value);
            }}
          />
          <ReactQuill
            value={itemDescr}
            modules={this.RTEmodules}
            onChange={this.setQuestionDescrState}
          />

          <Radio.Group
            onChange={e => {
              const { addItem } = this.state;
              this.setState({
                addItem: {
                  ...addItem,
                  itemType: e.target.value
                }
              });
            }}
            defaultValue="text"
          >
            <Radio.Button value="text">Текст</Radio.Button>
            <Radio.Button
              onClick={e => {
                const {
                  addItem: {
                    answerData: { data }
                  }
                } = this.state;
                const stateCopy = Object.assign({}, this.state);
                stateCopy.addItem.answerData.data = data.map(val => {
                  return e.target.value === 0
                    ? { isTrue: true, text: val.text }
                    : { isTrue: false, text: val.text };
                });
                this.setState(stateCopy);
              }}
              value="select"
            >
              Выбор
            </Radio.Button>
            <Radio.Button value="multi">Множественный выбор</Radio.Button>
          </Radio.Group>

          {this.answerTypeSelect()}
        </Modal>
      </div>
    );
  };

  render() {
    const { isQuestionLoaded, questionArr } = this.state;
    console.log('----> render', this.state);
    const { categoryHaveSubs } = this.props;

    const quShow = !categoryHaveSubs ? this.questionList() : null;

    const questionPane = !categoryHaveSubs ? this.addQuestion() : null;

    if (isQuestionLoaded) {
      console.log('Loaded ITEMS:', questionArr);
    }

    return (
      <div className="questions-block">
        {questionPane} {quShow}
      </div>
    );
  }
}
