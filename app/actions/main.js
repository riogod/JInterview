// @flow
import type { Dispatch } from '../reducers/types';
import DbServiceSettings from '../db/service/settings';
export const SET_CURRENT_PATH = 'SET_CURRENT_PATH';
export const SET_LOADED_INIT = 'SET_LOADED_INIT'; //Init app settings from db to redux
export const QUESTION_PER_QUIZSESSION = 'QUESTION_PER_QUIZSESSION';
export const ALLOW_SUBDIR = 'ALLOW_SUBDIR';
export const NEED_TO_UPDATE_CATALOG = 'NEED_TO_UPDATE_CATALOG';
export const SET_CURRENT_CATEGORY = 'SET_CURRENT_CATEGORY';
export const SET_SEARCH_PHRASE = 'SET_SEARCH_PHRASE';
export const SET_CATALOG_HAVE_ITEMS = 'SET_CATALOG_HAVE_ITEMS';
export const SET_CATALOG_HAVE_SUBS = 'SET_CATALOG_HAVE_SUBS';

const dbSettings = new DbServiceSettings();


export function setCurrentPath(module: string) {
  return (dispatch: Dispatch) => {
    dispatch({ type: SET_CURRENT_PATH, payload: module });
  };
}

export function setSearchPhrase(module: string) {
  return (dispatch: Dispatch) => {
    dispatch({ type: SET_SEARCH_PHRASE, payload: module });
  };
}

export function setLoadedInit(init_val: boolean) {
  return (dispatch: Dispatch) => {
    dispatch({ type: SET_LOADED_INIT, payload: init_val });
  };
}

export function setCategoryHaveItems(init_val: boolean) {
  return (dispatch: Dispatch) => {
    dispatch({ type: SET_CATALOG_HAVE_ITEMS, payload: init_val });
  };
}

export function setCategoryHaveSubs(init_val: boolean) {
  return (dispatch: Dispatch) => {
    dispatch({ type: SET_CATALOG_HAVE_SUBS, payload: init_val });
  };
}

export function setCurrentCategory(init_val: number) {
  return (dispatch: Dispatch) => {
    dispatch({ type: SET_CURRENT_CATEGORY, payload: init_val });
  };
}

export function needToUpdateCatalog(init_val: boolean) {
  return (dispatch: Dispatch) => {
    dispatch({ type: NEED_TO_UPDATE_CATALOG, payload: init_val });
  };
}

export function setInitSettings(appVar: string, appVal: boolean | number | string) {

  return (dispatch: Dispatch) => {
    dispatch({ type: appVar, payload: appVal });
  };
}

export function setAppSettings(appVar: string, appVal: boolean | number | string) {

  dbSettings
    .setSettingsValue(appVar, appVal)
    .then(res => {
      console.log(`------->${res}`);
      return res;
    })
    .catch(err => console.log(`Something wrong: ${err}`));


  return (dispatch: Dispatch) => {
    dispatch({ type: appVar, payload: appVal });
  };
}
