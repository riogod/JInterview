// @flow
import { SET_CURRENT_PATH, SET_LOADED_INIT, QUESTION_PER_QUIZSESSION, ALLOW_SUBDIR, NEED_TO_UPDATE_CATALOG, SET_CURRENT_CATEGORY, SET_SEARCH_PHRASE, SET_CATALOG_HAVE_ITEMS, SET_CATALOG_HAVE_SUBS } from '../actions/main';
import type { Action } from './types';




let initStoreMain = {
  loadedInit: false,
  currentCategory: 0,
  searchPhrase: '',
  needToUpdateCatalog: false,
  categoryHaveItems: false,
  categoryHaveSubs: false,
  settings: {
    QUESTION_PER_QUIZSESSION: 0,
    ALLOW_SUBDIR: false
  }
};

export default function setMainState(state: Object = initStoreMain, action: Action) {
  switch (action.type) {
    case SET_CURRENT_PATH:
      return {
        ...state,
        module: action.payload
      };
    case SET_LOADED_INIT:
      return {
        ...state,
        loadedInit: action.payload
      };
    case SET_SEARCH_PHRASE:
      return {
        ...state,
        searchPhrase: action.payload
      };
    case SET_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.payload,
        needToUpdateCatalog: true,
        searchPhrase: ''
      };
    case SET_CATALOG_HAVE_SUBS:
      return {
        ...state,
        categoryHaveSubs: action.payload
      };
    case SET_CATALOG_HAVE_ITEMS:
      return {
        ...state,
        categoryHaveItems: action.payload
      };
    case NEED_TO_UPDATE_CATALOG:
      return {
        ...state,
        needToUpdateCatalog: action.payload
      };
    case QUESTION_PER_QUIZSESSION:
      return {
        ...state,
        settings: {
          ...state.settings,
          QUESTION_PER_QUIZSESSION: action.payload
        }
      };
    case ALLOW_SUBDIR:
      return {
        ...state,
        settings: {
          ...state.settings,
          ALLOW_SUBDIR: action.payload
        }
      };
    default:
      return state;
  }
}
