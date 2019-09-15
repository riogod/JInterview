// @flow
// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MainActions from '../actions/main';
import Stat from '../components/Stat';

function mapStateToProps() {
  console.log('stat!!!!');
  return {
    currentPath: 'stat'
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stat);
