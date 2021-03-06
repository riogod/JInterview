// @flow
// import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as MainActions from '../actions/main';
import Catalog from '../components/Catalog';

function mapStateToProps(state) {
  return {
    currentCategory: state.main.currentCategory,
    searchPhrase: state.main.searchPhrase,
    needToUpdateCatalogState: state.main.needToUpdateCatalog,
    categoryHaveSubs: state.main.categoryHaveSubs,
    categoryHaveItems: state.main.categoryHaveItems
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Catalog);
