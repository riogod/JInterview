// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Input, Rate, Checkbox, Radio } from 'antd';
import DbServiceQuestions from '../db/service/questions';
import Header from './header/Header';
import InitLoading from '../containers/InitLoadingPage';
import shineImg from '../../resources/shine.svg';
import routes from '../constants/routes';

const dbCategory = new DbServiceQuestions();
const { TextArea } = Input;

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
      showCompareModal: false,
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
          quizQuestionArr: res.map(val => {
            const answerData =
              val.question_type !== 'text'
                ? JSON.parse(val.answer_data)
                    .sort(() => 0.5 - Math.random())
                    .map((el, idx) => ({
                      selectedId: idx,
                      isTrue: el.isTrue,
                      text: el.text
                    }))
                : ' ';

            const userAnswer =
              val.question_type === 'multi'
                ? answerData.map((el, idx) => ({
                    selectedId: idx,
                    selected: false,
                    text: el.text
                  }))
                : ' ';
            return {
              id: val.id,
              parentId: val.parent_id,
              name: val.question_name,
              description: val.question_description,
              type: val.question_type,
              answerData,
              answer: {
                userAnswer,
                assessment: 0,
                answerTimerStart: 0,
                answerTimerStop: 0
              }
            };
          })
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

  startMainTimer() {
    const { quizTimer } = this.state;
    this.timer = setInterval(
      () =>
        this.setState(state => ({
          ...state,
          quizTimer: quizTimer + 1
        })),
      1000
    );
  }

  stopTimer() {
    clearInterval(this.timer);
    console.log('stop');
  }

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

  compareAndRateAnswerShow = () => {
    this.setState(state => ({
      ...state,
      showCompareModal: true
    }));
  };

  changeAnswerState = inputAnswer => {
    const { currentQuestion, quizQuestionArr } = this.state;

    console.log('%c E:', 'color: red;', inputAnswer);

    const quizQuestionsTmp = [...quizQuestionArr];

    quizQuestionsTmp[currentQuestion] = {
      ...quizQuestionsTmp[currentQuestion],
      answer: {
        ...quizQuestionsTmp[currentQuestion].answer,
        userAnswer: inputAnswer
      }
    };

    console.log('%c STATE:', 'color: green;', quizQuestionsTmp);

    this.setState(state => ({
      ...state,
      quizQuestionArr: quizQuestionsTmp
    }));
  };

  changeAnswerRate = value => {
    const { currentQuestion, quizQuestionArr } = this.state;
    const quizQuestionsTmp = [...quizQuestionArr];

    quizQuestionsTmp[currentQuestion] = {
      ...quizQuestionsTmp[currentQuestion],
      answer: {
        ...quizQuestionsTmp[currentQuestion].answer,
        assessment: value,
        userAnswer:
          quizQuestionsTmp[currentQuestion].answer.userAnswer !== ''
            ? quizQuestionsTmp[currentQuestion].answer.userAnswer
            : ' '
      }
    };

    this.setState(state => ({
      ...state,
      showCompareModal: false,
      currentQuestion:
        currentQuestion <= quizQuestionArr.length ? currentQuestion + 1 : null,
      quizQuestionArr: quizQuestionsTmp
    }));
  };

  setQuestionMultiAnswer = (idx, value) => {
    const { currentQuestion, quizQuestionArr } = this.state;
    const quizQuestionsTmp = [...quizQuestionArr];

    quizQuestionsTmp[currentQuestion].answer.userAnswer = quizQuestionsTmp[
      currentQuestion
    ].answer.userAnswer.map(el => {
      return el.selectedId === idx ? { ...el, selected: value } : { ...el };
    });

    this.setState(state => ({
      ...state,
      quizQuestionArr: quizQuestionsTmp
    }));
  };

  setQuestionSingleAnswer = idx => {
    const { currentQuestion, quizQuestionArr } = this.state;
    const quizQuestionsTmp = [...quizQuestionArr];

    quizQuestionsTmp[currentQuestion].answer.userAnswer = idx;

    this.setState(state => ({
      ...state,
      quizQuestionArr: quizQuestionsTmp
    }));
  };

  quizModuleRender = () => {
    const { currentQuestion, quizQuestionArr, showCompareModal } = this.state;
    const { id, name, description, type, answerData, answer } = quizQuestionArr[
      currentQuestion
    ];

    const userAnswerRender = typeAnswer => {
      switch (typeAnswer) {
        case 'multi':
          return (
            <div>
              {answerData.map(el => (
                <Checkbox
                  key={`select${el.selectedId}`}
                  onChange={value =>
                    this.setQuestionMultiAnswer(
                      el.selectedId,
                      value.target.checked
                    )
                  }
                >
                  {el.text}
                </Checkbox>
              ))}
            </div>
          );
        case 'select':
          return (
            <Radio.Group
              defaultValue={0}
              onChange={e => this.setQuestionSingleAnswer(e.target.value)}
            >
              {answerData.map(el => (
                <Radio value={el.selectedId} key={`radio${el.selectedId}`}>
                  {el.text}
                </Radio>
              ))}
            </Radio.Group>
          );
        default:
          return (
            <React.Fragment>
              <Modal
                title="And now compare and rate it!"
                visible={showCompareModal}
                maskClosable={false}
                key={`didx${id}`}
                width="900px"
                footer={[
                  <div className="answer-module-rate-container">
                    Rate your answer:
                    <Rate
                      key={`ridx${id}`}
                      tooltips={[
                        'terrible',
                        'bad',
                        'normal',
                        'good',
                        'wonderful'
                      ]}
                      value={0}
                      className="answer-module-rate"
                      onChange={this.changeAnswerRate}
                    />
                  </div>
                ]}
              >
                <span className="answer-modal-title">Correct answer is:</span>
                <div
                  className="answer-modal-correct"
                  dangerouslySetInnerHTML={{ __html: answerData }}
                />
                <span className="answer-modal-title">Your answer is:</span>
                <div
                  className="answer-modal-user"
                  dangerouslySetInnerHTML={{ __html: answer.userAnswer }}
                />
              </Modal>
              <TextArea
                autosize={{ minRows: 4, maxRows: 15 }}
                placeholder="Write here your answer..."
                value={answer.userAnswer}
                onChange={e => {
                  this.changeAnswerState(e.target.value);
                }}
              />
              <Button
                type="primary"
                size="large"
                onClick={this.compareAndRateAnswerShow}
              >
                I&apos;am done
              </Button>
            </React.Fragment>
          );
      }
    };

    return (
      <div className="quiz-containter">
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
        <div className="question-module">
          <div className="question-module-title">
            #{currentQuestion + 1}) {name}
          </div>
          <div className="question-module-descr">
            <p
              dangerouslySetInnerHTML={{
                __html: description
              }}
            />
          </div>
        </div>
        <div className="question-module-answer-container">
          <p className="question-module-answer-title">And your answer is:</p>
          {userAnswerRender(type)}
        </div>
      </div>
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
