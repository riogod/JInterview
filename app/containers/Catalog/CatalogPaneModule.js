// @flow
// import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as MainActions from '../../actions/main';
import CatalogPane from '../../components/Catalog/CatalogPane';

function mapStateToProps(state) {
  return {
    currentCategory: state.main.currentCategory,
    searchPhrase: state.main.searchPhrase
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogPane);
