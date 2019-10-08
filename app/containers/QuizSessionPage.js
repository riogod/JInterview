// @flow
// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MainActions from '../actions/main';
import QuizSession from '../components/QuizSession';

function mapStateToProps(state) {
  return {
    currentPath: state.main.module,
    quizSessionInit: state.main.quizSessionInit,
    settings: state.main.settings,
    loadedInit: state.main.loadedInit
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizSession);
