// @flow
import { SET_CURRENT_PATH, SET_LOADED_INIT, QUESTION_PER_QUIZSESSION, ALLOW_SUBDIR } from '../actions/main';
import type { Action } from './types';




let initStoreMain = {
  loadedInit: false,
  currentCategory: 0,
  searchPhrase: '',
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
