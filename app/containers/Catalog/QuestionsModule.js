// @flow
// import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as MainActions from '../../actions/main';
import Questions from '../../components/Catalog/Questions';

function mapStateToProps(state) {
  return {
    needToUpdateCatalogState: state.main.needToUpdateCatalog,
    currentCategory: state.main.currentCategory,
    categoryHaveItems: state.main.categoryHaveItems,
    categoryHaveSubs: state.main.categoryHaveSubs
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Questions);
