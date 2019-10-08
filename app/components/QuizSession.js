// @flow
import React, { Component } from 'react';
import DbServiceQuestions from '../db/service/questions';
import Header from './header/Header';
import InitLoading from '../containers/InitLoadingPage';

const dbCategory = new DbServiceQuestions();

type Props = {
  setCurrentPath: Function,
  setQuizSessionInit: Function,
  settings: Object,
  match: Object,
  quizSessionInit: boolean,
  loadedInit: boolean
};

export default class QuizSession extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      quizQuestionArr: [],
      isReady: false,
      currentQuestion: 0,
      quizTimer: 0
    };
  }

  componentDidMount(): void {
    const { setCurrentPath, quizSessionInit, loadedInit } = this.props;
    setCurrentPath('module-quizsession');

    if (!quizSessionInit && loadedInit) {
      console.log('!quizSessionInit && loadedInit');
      this.loadQuestionAndState();
    }
  }

  componentDidUpdate(): void {
    const { quizSessionInit, loadedInit } = this.props;
    if (!quizSessionInit && loadedInit) {
      console.log('!quizSessionInit && loadedInit');
      this.loadQuestionAndState();
    }
  }

  componentWillUnmount(): void {
    const { setQuizSessionInit } = this.props;
    setQuizSessionInit(false);
  }

  loadQuestionAndState = () => {
    const {
      setQuizSessionInit,
      loadedInit,
      match: {
        params: { id }
      },
      settings: { QUESTION_PER_QUIZSESSION }
    } = this.props;

    dbCategory
      .getQuestionToInterview(id, QUESTION_PER_QUIZSESSION)
      .then(res => {
        setQuizSessionInit(true);
        this.setState(state => ({
          ...state,
          quizQuestionArr: res.map(val => ({
            id: val.id,
            parentId: val.parent_id,
            name: val.question_name,
            description: val.question_description,
            type: val.question_type,
            answerData: val.answer_data,
            answer: {
              userAnswer: '',
              assessment: 0,
              answerTimer: 0
            }
          }))
        }));
        console.log(
          'quizQuestionArr',
          id,
          QUESTION_PER_QUIZSESSION,
          loadedInit
        );
        return res;
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    const { loadedInit, quizSessionInit } = this.props;
    const loadInitCheck = !loadedInit ? <InitLoading /> : null;
    if (quizSessionInit) {
      console.log('QUIZ PROPS:', this.props, this.state);
    }
    return (
      <React.Fragment>
        {loadInitCheck}
        <Header menu="module-session" />
        TIME TO QUUUUUUUiZ!!!!
      </React.Fragment>
    );
  }
}
