// @flow
// import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as MainActions from '../actions/main';
import Settings from '../components/Settings';

function mapStateToProps() {
  console.log('settings');
  return {
    currentPath: 'settings'
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
