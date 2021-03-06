// @flow
// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Main from '../components/Main';
import * as MainActions from '../actions/main';

function mapStateToProps(state) {
  return {
    currentPath: state.main.module,
    loadedInit: state.main.loadedInit,
    appSettings: state.main.settings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
