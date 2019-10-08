// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DbServiceQuestions from '../db/service/questions';
import Header from './header/Header';
import InitLoading from '../containers/InitLoadingPage';
import shineImg from '../../resources/shine.svg';
import routes from '../constants/routes';

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
      isFinish: false,
      currentQuestion: 0,
      quizTimer: 0
    };
  }

  componentDidMount(): void {
    const { setCurrentPath, quizSessionInit, loadedInit } = this.props;
    setCurrentPath('module-quizsession');

    if (!quizSessionInit && loadedInit) {
      // console.log('!quizSessionInit && loadedInit');
      this.loadQuestionAndState();
    }
  }

  componentDidUpdate(): void {
    const { quizSessionInit, loadedInit } = this.props;
    if (!quizSessionInit && loadedInit) {
      // console.log('!quizSessionInit && loadedInit');
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
              answerTimerStart: 0,
              answerTimerStop: 0
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

  // Prepare screen
  isReadyRender = () => (
    <React.Fragment>
      <div className="quiz-isready-img">
        <img src={shineImg} alt="Shine" />
      </div>
      <div className="quiz-isready-title">
        Are you ready to shine ?
        <div className="action">
          <div className="action__btn">
            <div className="action__btn__slide_efx action__btn__slide_efx-green" />
            <a
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              className="action__btn__btn"
              onClick={() =>
                this.setState(state => ({ ...state, isReady: true }))
              }
            >
              READY
            </a>
          </div>
        </div>
        <div className="action">
          <div className="action__btn">
            <div className="action__btn__slide_efx" />
            <Link
              href="#"
              className="action__btn__btn"
              data-tid="menuItem1"
              to={routes.MAIN}
            >
              No
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  quizModuleRender = () => {
    // const { isReady, currentQuestion, quizTimer, quizQuestionArr } = this.state;

    return (
      <React.Fragment>
        <a
          role="button"
          tabIndex={0}
          onKeyDown={() => {}}
          className="action__btn__btn"
          onClick={() =>
            this.setState(state => ({
              ...state,
              currentQuestion: state.currentQuestion + 1
            }))
          }
        >
          NEXT
        </a>
      </React.Fragment>
    );
  };

  render() {
    const { loadedInit, quizSessionInit } = this.props;
    const { isReady, currentQuestion, quizTimer, quizQuestionArr } = this.state;
    const loadInitCheck = !loadedInit ? <InitLoading /> : null;
    if (quizSessionInit) {
      console.log('QUIZ PROPS:', this.props, this.state);
    }

    return (
      <React.Fragment>
        {loadInitCheck}
        <Header
          menu="module-qsession"
          allQuestions={quizQuestionArr.length}
          currentQuestion={currentQuestion}
          timer={quizTimer}
        />
        {!isReady && quizSessionInit ? this.isReadyRender() : null}
        {isReady && quizSessionInit ? this.quizModuleRender() : null}
      </React.Fragment>
    );
  }
}
