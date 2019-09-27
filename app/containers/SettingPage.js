// @flow
// import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as MainActions from '../actions/main';
import Settings from '../components/Settings';

function mapStateToProps(state) {
  return {
    currentPath: state.main.module,
    appSettings: state.main.settings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
