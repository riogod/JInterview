// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Input, Rate, Checkbox, Radio } from 'antd';
import DbServiceQuestions from '../db/service/questions';
import Header from './header/Header';
import InitLoading from '../containers/InitLoadingPage';
import shineImg from '../../resources/shine.svg';
import routes from '../constants/routes';

// TODO: make a final screen

// TODO: implement @next@ button in single & multi answer

// TODO: if 0 questions in category

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
      this.loadQuestionAndState();
    }
  }

  componentDidUpdate(): void {
    const { quizSessionInit, loadedInit } = this.props;

    if (!quizSessionInit && loadedInit) {
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
                showResult: false,
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

  isFinishRender = () => {
    const { quizQuestionArr } = this.state;

    const finalAssessment = quizQuestionArr.reduce((sum, val) => {
      console.log('%c VALUE', 'color: lime', sum, val.answer.assessment);
      return sum + val.answer.assessment;
    }, 0);

    return (
      <React.Fragment>
        <div>FINISH!!!! {finalAssessment / quizQuestionArr.length}</div>
      </React.Fragment>
    );
  };

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

  showResultGroup = () => {
    const { currentQuestion, quizQuestionArr } = this.state;
    const quizQuestionsTmp = [...quizQuestionArr];

    if (quizQuestionsTmp[currentQuestion].answer.userAnswer !== ' ') {
      quizQuestionsTmp[currentQuestion].answer.showResult = true;
      this.setAssessment();

      this.setState(state => ({
        ...state,
        quizQuestionArr: quizQuestionsTmp
      }));
    }
  };

  setAssessment = () => {
    const { currentQuestion, quizQuestionArr } = this.state;
    const quizQuestionsTmp = [...quizQuestionArr];
    let questionAssessment;
    let countCorrect = 0;
    let countIncorrect = 0;
    // let countIsTrue = 0;
    let countAnswers = 0;

    if (quizQuestionsTmp[currentQuestion].type === 'select') {
      questionAssessment = quizQuestionsTmp[currentQuestion].answerData[
        quizQuestionsTmp[currentQuestion].answer.userAnswer
      ].isTrue
        ? 5
        : 1;
    }

    if (quizQuestionsTmp[currentQuestion].type === 'multi') {
      const userAnswerData =
        quizQuestionsTmp[currentQuestion].answer.userAnswer;
      const { answerData } = quizQuestionsTmp[currentQuestion];

      answerData.forEach((el, index) => {
        // if (el.isTrue) {
        //   countIsTrue += 1;
        // }
        if (userAnswerData[index].selected) {
          countAnswers += 1;
        }
        if (el.isTrue && userAnswerData[index].selected) {
          countCorrect += 1;
        }
        if (!el.isTrue && userAnswerData[index].selected) {
          countIncorrect += 1;
        }
      });

      if (countCorrect <= 0) {
        questionAssessment = 1;
      }
      if (countCorrect <= countIncorrect && countCorrect === 0) {
        questionAssessment = 2;
      }
      if (countCorrect <= countIncorrect && countCorrect !== 0) {
        questionAssessment = 3;
      }
      if (countCorrect > countIncorrect) {
        questionAssessment = 4;
      }
      if (countIncorrect <= 0) {
        questionAssessment = 5;
      }
      if (countAnswers === answerData.length) {
        questionAssessment = 1;
      }
      if (countAnswers === 0) {
        questionAssessment = 1;
      }
    }

    quizQuestionsTmp[currentQuestion].answer.assessment = questionAssessment;

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
              {answerData.map(el => {
                return (
                  <Checkbox
                    key={`select${el.selectedId}`}
                    disabled={answer.showResult}
                    onChange={value =>
                      this.setQuestionMultiAnswer(
                        el.selectedId,
                        value.target.checked
                      )
                    }
                    className={`result-show-radio ${
                      answer.showResult && el.isTrue ? 'answer-highlight' : ''
                    }`}
                  >
                    {el.text}
                  </Checkbox>
                );
              })}
              <Button
                type="primary"
                size="large"
                onClick={
                  !answer.showResult
                    ? this.showResultGroup
                    : () => {
                        this.setState(state => ({
                          ...state,
                          currentQuestion: state.currentQuestion + 1
                        }));
                      }
                }
              >
                {!answer.showResult ? 'Show result' : 'Next question'}
              </Button>
            </div>
          );
        case 'select':
          return (
            <div>
              <Radio.Group
                defaultValue={-1}
                key={`group${currentQuestion}`}
                disabled={answer.showResult}
                onChange={e => this.setQuestionSingleAnswer(e.target.value)}
              >
                {answerData.map(el => (
                  <Radio
                    value={el.selectedId}
                    key={`radio${el.selectedId}`}
                    className={`result-show-radio ${
                      answer.showResult && el.isTrue ? 'answer-highlight' : ''
                    }`}
                  >
                    {el.text}
                  </Radio>
                ))}
              </Radio.Group>
              <Button
                type="primary"
                size="large"
                onClick={
                  !answer.showResult
                    ? this.showResultGroup
                    : () => {
                        this.setState(state => ({
                          ...state,
                          currentQuestion: state.currentQuestion + 1
                        }));
                      }
                }
              >
                {!answer.showResult ? 'Show result' : 'Next question'}
              </Button>
            </div>
          );
        default:
          return (
            <React.Fragment>
              <Modal
                title="And now compare and rate it!"
                visible={showCompareModal}
                maskClosable={false}
                key={`didx${currentQuestion}`}
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
    const {
      isReady,
      isFinish,
      currentQuestion,
      quizTimer,
      quizQuestionArr
    } = this.state;
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
          finish={currentQuestion >= quizQuestionArr.length && 'yes'}
        />
        {!isReady && quizSessionInit && !isFinish ? this.isReadyRender() : null}
        {isReady && quizSessionInit && currentQuestion < quizQuestionArr.length
          ? this.quizModuleRender()
          : null}
        {isReady && quizSessionInit && currentQuestion >= quizQuestionArr.length
          ? this.isFinishRender()
          : null}
      </React.Fragment>
    );
  }
}
