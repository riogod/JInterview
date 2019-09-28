// @flow
// import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as MainActions from '../../actions/main';
import CatalogItem from '../../components/Catalog/CatalogItem';

function mapStateToProps(state) {
  return {
    currentCategory: state.main.currentCategory
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MainActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogItem);
