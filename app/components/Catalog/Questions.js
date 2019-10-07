// @flow
import React, { Component } from 'react';
import {
  Modal,
  Button,
  Input,
  Radio,
  Icon,
  Checkbox,
  Popconfirm,
  Divider,
  Table
} from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import DbServiceQuestions from '../../db/service/questions';

const dbCategory = new DbServiceQuestions();

type Props = {
  currentCategory: number,
  needToUpdateCatalogState: boolean,
  categoryHaveItems: boolean,
  categoryHaveSubs: boolean,
  setCategoryHaveItems: Function,
  needToUpdateCatalog: Function
};

export default class Questions extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      isQuestionLoaded: false,
      questionArr: [],

      addItem: {
        isEdit: false,
        editId: 0,
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
    this.inputRef = React.createRef();
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
            questionType: el.question_type,
            answerData: el.answer_data
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

  // Set edit item to state
  setEditItemState(item) {
    this.setState(prevState => ({
      ...prevState,
      addItem: {
        isEdit: true,
        editId: item.id,
        visible: true,
        itemName: item.name,
        itemDescr: item.descr,
        itemType: item.questionType,
        answerData: {
          text: item.questionType === 'text' ? item.answerData : '',
          data: item.questionType !== 'text' ? JSON.parse(item.answerData) : []
        }
      }
    }));
  }

  // Deleting question
  confirmDeleting = itemid => {
    const { needToUpdateCatalog } = this.props;
    dbCategory
      .removeQuestion(itemid)
      .then(res => {
        needToUpdateCatalog(true);
        this.setState(prevState => ({
          ...prevState,
          addItem: {
            isEdit: false,
            editId: 0,
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
        }));
        return res;
      })
      .catch(err => console.log(`Something wrong: ${err}`));
  };

  // Render question list of current category
  questionList = () => {
    const { questionArr } = this.state;
    const columns = [
      { title: 'Question', dataIndex: 'name', id: 'name' },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: text => {
          return (
            <div className="question-item-title">
              <a
                href="#"
                onClick={() => {
                  this.setEditItemState(text);
                }}
              >
                <Icon type="form" />
              </a>
              <Popconfirm
                title="Are you sure？"
                onConfirm={() => this.confirmDeleting(text.id)}
                icon={
                  <Icon type="question-circle-o" style={{ color: 'blue' }} />
                }
              >
                <a href="#">
                  <Icon type="delete" />
                </a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];

    return (
      <div className="question-list">
        <Table
          columns={columns}
          expandedRowRender={record => (
            <p
              style={{ margin: 0 }}
              dangerouslySetInnerHTML={{ __html: record.descr }}
            />
          )}
          dataSource={questionArr}
          pagination={false}
          expandRowByClick
          showHeader={false}
        />
      </div>
    );
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
    this.setState(prevState => ({
      ...prevState,
      addItem: {
        isEdit: false,
        editId: 0,
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
    }));
  };

  // Add/Edit item
  addItemHandleOk = () => {
    const { addItem } = this.state;
    const { currentCategory, needToUpdateCatalog } = this.props;

    if (addItem.itemName !== '') {
      dbCategory
        .addQuestionToDb(addItem, currentCategory)
        .then(res => {
          needToUpdateCatalog(true);
          this.setState(prevState => ({
            ...prevState,
            addItem: {
              isEdit: false,
              editId: 0,
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
          }));
          return res;
        })
        .catch(err => console.log(`Something wrong: ${err}`));
    }
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
      <div className="checkbox-answer">
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
      addItem: { visible, itemDescr, itemName, itemType }
    } = this.state;
    const { categoryHaveItems, categoryHaveSubs } = this.props;
    return (
      <div>
        {!categoryHaveItems && !categoryHaveSubs ? (
          <Divider>Or you can add a questions:</Divider>
        ) : null}
        <Button type="primary" onClick={this.showAddModal} icon="plus-circle">
          ADD NEW QUESTION
        </Button>
        <Modal
          title="The question is:"
          visible={visible}
          className="module-addEdit"
          onOk={this.addItemHandleOk}
          onCancel={this.addItemHandleCancel}
          maskClosable={false}
          width="900px"
        >
          <div ref={this.inputRef}>
            <Input
              placeholder="Question title *requirement"
              value={itemName}
              onChange={e => {
                this.setQuestionTitleState(e.target.value);
              }}
            />
          </div>
          <ReactQuill
            value={itemDescr}
            modules={this.RTEmodules}
            onChange={this.setQuestionDescrState}
          />
          <Divider>The answer is:</Divider>
          <div className="answer-select">
            <Radio.Group
              buttonStyle="solid"
              value={itemType}
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
              <Radio.Button value="text">Text</Radio.Button>
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
                One of
              </Radio.Button>
              <Radio.Button value="multi">Several of</Radio.Button>
            </Radio.Group>
          </div>
          {this.answerTypeSelect()}
        </Modal>
      </div>
    );
  };

  render() {
    const { categoryHaveSubs } = this.props;
    const quShow = !categoryHaveSubs ? this.questionList() : null;
    const questionPane = !categoryHaveSubs ? this.addQuestion() : null;

    return (
      <div className="questions-block">
        {questionPane} {quShow}
      </div>
    );
  }
}
